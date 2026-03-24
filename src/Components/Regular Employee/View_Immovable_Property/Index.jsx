import { useState, useRef, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import {
  submitImmovableProperty,
  viewImmProperty,
} from '../../../Services/Auth';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PropagateLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  Typography,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Button,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from '@mui/material';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

const years = [2025, 2026, 2027, 2028];

// const fieldCard = (label, value, index) => (
//   <Grid item xs={12} sm={6} md={3} key={index}>
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ delay: index * 0.05 }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           p: 2,
//           borderRadius: 3,
//           textAlign: 'center',
//           transition: 'all 0.3s ease',
//           background: 'linear-gradient(135deg,#f8fbff,#ffffff)',
//           '&:hover': {
//             transform: 'translateY(-5px)',
//             boxShadow: '0px 10px 25px rgba(0,0,0,0.2)',
//           },
//         }}
//       >
//         <Typography
//           variant="body2"
//           sx={{ fontWeight: 'bold', color: '#3949ab', mb: 1 }}
//         >
//           {label}
//         </Typography>

//         <Typography variant="body1" sx={{ color: '#333' }}>
//           {value || '—'}
//         </Typography>

//       </Paper>
//     </motion.div>
//   </Grid>
// );

function ImmovablePropertyView() {
  const [immovableData, setImmovableData] = useState([]);
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);
  const [open, setOpen] = useState(false);

  const empCode = sessionStorage.getItem('empCode');
  const fullName = sessionStorage.getItem('fullName');
  const [apiCalled, setApiCalled] = useState(false);

  const viewImmovable = async () => {
    try {
      setOpenBackdrop(true);
      setApiCalled(false);

      const response = await viewImmProperty(empCode, selectedYear);

      if (response?.data.code === '200') {
        setImmovableData(response.data.list || []);
      } else {
        setImmovableData([]);
      }

      setApiCalled(true);
    } catch (err) {
      console.error(err);
      setImmovableData([]);
      setApiCalled(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const [selectedRow, setSelectedRow] = useState(null);

  const handlePreview = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const DownloadDoc = async (item) => {
    const URL = `https://attendance.mpcz.in:8888/E-Attendance/api/employee/generatePropertyReturnPdfEmp?empCode=${item.empCode}&year=${item.year}`;
    window.open(URL, '_blank');
  };

  const fieldCard = (label, field, index) => {
    const isTextarea = [
      'fromWhomAcquired',
      'ownershipStatus',
      'remarks',
    ].includes(field);

    const isDate = field === 'acquisitionDate';

    // ✅ DISABLED FIELDS
    const isDisabled = ['empCode', 'empName', 'designation', 'year'].includes(
      field,
    );

    return (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              height: '100%',
              background: '#fff',
              border: '1px solid #e0e0e0',
              transition: 'all 0.25s ease',
              '&:hover': {
                boxShadow: '0px 6px 18px rgba(0,0,0,0.15)',
              },
            }}
          >
            {/* Label */}
            <Typography
              variant="caption"
              sx={{
                color: '#6c757d',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              {label}
            </Typography>

            {/* Value / Editable */}
            <TextField
              id={field} // ✅ REQUIRED FOR FOCUS
              fullWidth
              variant="standard"
              type={isDate ? 'date' : 'text'}
              value={formData?.[field] || ''}
              onChange={(e) => {
                handleChange(field, e.target.value);

                // ✅ remove error on typing
                if (errors[field]) {
                  setErrors((prev) => ({ ...prev, [field]: '' }));
                }
              }}
              multiline={isTextarea}
              minRows={isTextarea ? 3 : 1}
              disabled={isDisabled}
              error={!!errors[field]} // ✅ ERROR STATE
              helperText={errors[field] || ''} // ✅ ERROR MESSAGE
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '15px',
                  fontWeight: 500,
                  color: isDisabled ? '#555' : '#212121',
                  mt: 0.5,
                },
              }}
              sx={{
                mt: 1,
                background: isDisabled ? '#eef1f6' : '#f8f9fa',
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            />
          </Paper>
        </motion.div>
      </Grid>
    );
  };
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const skipFields = ['empCode', 'empName', 'designation', 'year'];
  // load selected row into editable form
  useEffect(() => {
    if (selectedRow) {
      setFormData(selectedRow);
    }
  }, [selectedRow]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const requiredFields = [
    'acquisitionDate',
    'acquisitionMode',
    'fromWhomAcquired',
    'ownershipStatus',
    'privateBusinessDetails',
    'remarks',
    'agriculturalLocation',
    'agriculturalSizeArea',
    'agriculturalPresentValue',
    'housingLocation',
    'housingSizeBuildUpArea',
    'housingPresentValue',
    'residentialLocation',
    'residentialSizeArea',
    'residentialPresentValue',
    'shopLocation',
    'shopSizeBuildUpArea',
    'shopPresentValue',
    'district',
    'subDistrict',
    'talukaVillage',
    'annualIncome',
    'gpfPranEpfNo',
  ];

  const validateForm = () => {
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstField = Object.keys(newErrors)[0];

      setTimeout(() => {
        const element = document.getElementById(firstField);
        if (element) element.focus();
      }, 100);

      return false;
    }

    return true;
  };
  // 👉 UPDATE API CALL
  const handleUpdate = async () => {
    // ✅ ADD THIS LINE (MOST IMPORTANT)
    if (!validateForm()) return;
    setOpenBackdrop(true);

    try {
      const payload = {
        empCode: sessionStorage.getItem('empCode'),
        gpfPranEpfNo: formData.gpfPranEpfNo,
        district: formData.district,
        subDistrict: formData.subDistrict,
        talukaVillage: formData.talukaVillage,
        residentialLocation: formData.residentialLocation,
        residentialSizeArea: formData.residentialSizeArea,
        residentialPresentValue: formData.residentialPresentValue,
        agriculturalLocation: formData.agriculturalLocation,
        agriculturalSizeArea: formData.agriculturalSizeArea,
        agriculturalPresentValue: formData.agriculturalPresentValue,
        housingLocation: formData.housingLocation,
        housingSizeBuildUpArea: formData.housingSizeBuildUpArea,
        housingPresentValue: formData.housingPresentValue,
        shopLocation: formData.shopLocation,
        shopSizeBuildUpArea: formData.shopSizeBuildUpArea,
        shopPresentValue: formData.shopPresentValue,
        ownershipStatus: formData.ownershipStatus,
        acquisitionMode: formData.acquisitionMode,
        acquisitionDate: formData.acquisitionDate,
        fromWhomAcquired: formData.fromWhomAcquired,
        annualIncome: formData.annualIncome,
        privateBusinessDetails: formData.privateBusinessDetails,
        remarks: formData.remarks,
        createdBy: sessionStorage.getItem('empCode'),
        year: selectedYear,
        id: formData.id,
      };

      const response = await submitImmovableProperty([payload]);

      if (response.data.code === '200') {
        alert('Successfully Submitted');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card className="shadow">
        <Card.Header className="text-center text-primary p-3">
          <Typography
            variant="h4"
            sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#0a1f83' }}
          >
            Immovable Property Record
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="g-3 mt-3 mb-3">
            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Header>Employee Code</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    value={empCode || ''}
                    disabled
                    readOnly
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Header>Employee Name</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    value={fullName || ''}
                    disabled
                    readOnly
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Header>Year</Card.Header>
                <Card.Body>
                  <Form.Select
                    id="year"
                    aria-label="Select Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      -- Select Year --
                    </option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3}>
              <Card className="h-100">
                <Card.Header>Details</Card.Header>
                <Card.Body className="d-flex align-items-center">
                  <Button className="blue-button w-100" onClick={viewImmovable}>
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {apiCalled && (
            <TableContainer component={Paper}>
              <Table ref={tableRef} tabIndex={-1}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Designation</StyledTableCell>
                    <StyledTableCell>Edit</StyledTableCell>
                    <StyledTableCell>Download (pdf)</StyledTableCell>
                  </StyledTableRow>
                </TableHead>

                <TableBody>
                  {immovableData.length > 0 ? (
                    immovableData.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{item.empCode}</StyledTableCell>
                        <StyledTableCell>{item.empName}</StyledTableCell>
                        <StyledTableCell>{item.designation}</StyledTableCell>

                        <StyledTableCell>
                          <Tooltip title="Edit" arrow>
                            <Button
                              variant="contained"
                              color="dark"
                              onClick={() => handlePreview(item)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </StyledTableCell>

                        <StyledTableCell>
                          <Tooltip title="Download" arrow>
                            <Button
                              variant="contained"
                              color="dark"
                              onClick={() => DownloadDoc(item)}
                            >
                              <CloudDownloadIcon
                                fontSize="small"
                                color="success"
                              />
                            </Button>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={6} align="center">
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card.Body>

        <Card.Footer className="text-center p-3"></Card.Footer>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%)',
            boxShadow: '0px 15px 45px rgba(0,0,0,0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            bgcolor: '#e2e3e5',
            py: 2,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#0a1f83' }}
          >
            Property Details Preview
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            background: '#f4f6fb',
            maxHeight: '80vh',
            px: { xs: 1, md: 3 },
          }}
        >
          {selectedRow && (
            <Grid container spacing={3}>
              {/* {fieldCard('Employee Code', selectedRow.empCode, 0)}
              {fieldCard('Employee Name', selectedRow.empName, 1)}
              {fieldCard('Designation', selectedRow.designation, 2)}
              {fieldCard('Year', selectedRow.year, 3)}
              {fieldCard('Acquisition Date', selectedRow.acquisitionDate, 4)}
              {fieldCard('Acquisition Mode', selectedRow.acquisitionMode, 5)}
              {fieldCard('From Whom Acquired', selectedRow.fromWhomAcquired, 6)}
              {fieldCard('Ownership Status', selectedRow.ownershipStatus, 7)}
               
              {fieldCard(
                'Private Business Details',
                selectedRow.privateBusinessDetails,
                8,
              )}
              {fieldCard('Remarks', selectedRow.remarks, 9)}
              {fieldCard(
                'Agricultural Location',
                selectedRow.agriculturalLocation,
                10,
              )}
              {fieldCard(
                'Agricultural Size Area',
                selectedRow.agriculturalSizeArea,
                11,
              )}
              {fieldCard(
                'Agricultural Present Value',
                selectedRow.agriculturalPresentValue,
                12,
              )}
              {fieldCard('Housing Location', selectedRow.housingLocation, 13)}
              {fieldCard(
                'Housing Size Build-Up Area',
                selectedRow.housingSizeBuildUpArea,
                14,
              )}
              {fieldCard(
                'Housing Present Value',
                selectedRow.housingPresentValue,
                15,
              )}
              {fieldCard(
                'Residential Location',
                selectedRow.residentialLocation,
                16,
              )}
              {fieldCard(
                'Residential Size Area',
                selectedRow.residentialSizeArea,
                17,
              )}
              {fieldCard(
                'Residential Present Value',
                selectedRow.residentialPresentValue,
                18,
              )}
              {fieldCard('Shop Location', selectedRow.shopLocation, 19)}
              {fieldCard(
                'Shop Size Build-Up Area',
                selectedRow.shopSizeBuildUpArea,
                20,
              )}
              {fieldCard(
                'Shop Present Value',
                selectedRow.shopPresentValue,
                21,
              )}
              {fieldCard('District', selectedRow.district, 22)}
              {fieldCard('Sub-District', selectedRow.subDistrict, 23)}
              {fieldCard('Taluka/Village', selectedRow.talukaVillage, 24)}
              {fieldCard('Annual Income', selectedRow.annualIncome, 25)}
              {fieldCard('GPF / PRAN / EPF No', selectedRow.gpfPranEpfNo, 26)} */}

              {fieldCard('Employee Code', 'empCode', 0)}
              {fieldCard('Employee Name', 'empName', 1)}
              {fieldCard('Designation', 'designation', 2)}
              {fieldCard('Year', 'year', 3)}
              {fieldCard('Acquisition Date', 'acquisitionDate', 4)}
              {fieldCard('Acquisition Mode', 'acquisitionMode', 5)}
              {fieldCard('From Whom Acquired', 'fromWhomAcquired', 6)}
              {fieldCard('Ownership Status', 'ownershipStatus', 7)}
              {fieldCard(
                'Private Business Details',
                'privateBusinessDetails',
                8,
              )}
              {fieldCard('Remarks', 'remarks', 9)}
              {fieldCard('Agricultural Location', 'agriculturalLocation', 10)}
              {fieldCard('Agricultural Size Area', 'agriculturalSizeArea', 11)}
              {fieldCard(
                'Agricultural Present Value',
                'agriculturalPresentValue',
                12,
              )}
              {fieldCard('Housing Location', 'housingLocation', 13)}
              {fieldCard(
                'Housing Size Build-Up Area',
                'housingSizeBuildUpArea',
                14,
              )}
              {fieldCard('Housing Present Value', 'housingPresentValue', 15)}
              {fieldCard('Residential Location', 'residentialLocation', 16)}
              {fieldCard('Residential Size Area', 'residentialSizeArea', 17)}
              {fieldCard(
                'Residential Present Value',
                'residentialPresentValue',
                18,
              )}
              {fieldCard('Shop Location', 'shopLocation', 19)}
              {fieldCard('Shop Size Build-Up Area', 'shopSizeBuildUpArea', 20)}
              {fieldCard('Shop Present Value', 'shopPresentValue', 21)}
              {fieldCard('District', 'district', 22)}
              {fieldCard('Sub-District', 'subDistrict', 23)}
              {fieldCard('Taluka/Village', 'talukaVillage', 24)}
              {fieldCard('Annual Income', 'annualIncome', 25)}
              {fieldCard('GPF / PRAN / EPF No', 'gpfPranEpfNo', 26)}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* <Button
              onClick={handleClose}
              variant="contained"
              className="cancel-button"
            >
              Close
            </Button> */}

            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                className="cancel-button"
              >
                Close
              </Button>

              <Button
                onClick={handleUpdate}
                variant="contained"
                className="green-button"
              >
                Update
              </Button>
            </DialogActions>
          </motion.div>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ImmovablePropertyView;
