import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'react-bootstrap';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Backdrop,
  tableCellClasses,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
} from '@mui/material';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PropagateLoader } from 'react-spinners';
import {
  getMedicalByCmo,
  getMedicalByRefNo,
  getMedicineDetailByRefNo,
  submitMedicalCmoStatus,
} from '../../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
  SubTableRow,
  SubTableCell,
} from '../../../../Constants/TableStyles/Index';

// const headerBackground = "linear-gradient(to right, #90A4AE, #78909C)";
// const oddRowBackground = "#F9FAFB";
// const evenRowBackground = "#F1F3F4";
// const hoverBackground = "#E0E0E0";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     background: headerBackground,
//     color: theme.palette.common.white,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     textAlign: "center",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: oddRowBackground,
//   },
//   "&:nth-of-type(even)": {
//     backgroundColor: evenRowBackground,
//   },
//   "&:hover": {
//     backgroundColor: hoverBackground,
//   },
// }));

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

const fieldCard = (label, value, index, onClick) => (
  <Grid item xs={12} sm={6} md={3} key={index}>
    <motion.div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 3,
          textAlign: 'center',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg,#f8fbff,#ffffff)',
          '&:hover': {
            transform: onClick ? 'translateY(-5px)' : 'none',
            boxShadow: onClick ? '0px 10px 25px rgba(0,0,0,0.2)' : 'none',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', color: '#3949ab', mb: 1 }}
        >
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          {value || '—'}
        </Typography>
      </Paper>
    </motion.div>
  </Grid>
);

function MedicalApprovalByCmo() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getMedicalByCmo();
        console.log(response);
        if (response.data.code == '200') {
          setOpenBackdrop(false);
          setRecords(response.data.list);
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.log('Error', error);
        setOpenBackdrop(false);
      }
    };
    fetchRecords();
  }, []);

  const [selectedRow, setSelectedRow] = useState([]);
  const [open, setOpen] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [medicineData, setMedicineData] = useState([]);

  // const handlePreview = (row) => {
  //   setSelectedRow(row);
  //   setOpen(true);
  //   fetchMedicineDetails(row.refNo);
  //   setReferenceNo(row.refNo);
  // };

  const handlePreview = async (refNo) => {
    try {
      setReferenceNo(refNo);

      // Fetch medicine details (no await? If async, add await)
      // fetchMedicineDetails(refNo);

      const response = await getMedicalByRefNo(refNo);
      console.log('API Response:', response);

      if (
        response?.data?.code === '200' &&
        response?.data?.message === 'Success'
      ) {
        setSelectedRow(response.data.list[0]);
        setMedicineData(response.data.list[0].medicineDetails);
        setOpen(true);
      } else {
        alert(response?.data?.message || 'Something went wrong');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error in handlePreview:', error);
      alert('Something went wrong while fetching details.');
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow([]);
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const handlePreviewMemo = (item, index) => {
    if (!item.memoList || item.memoList.length === 0) {
      alert('Memo list data not found');
      return;
    }

    // Toggle expand / collapse
    setExpandedRow(expandedRow === index ? null : index);
  };

  // const fetchMedicineDetails = async (refNo) => {
  //   const response = await getMedicineDetailByRefNo(refNo);
  //   console.log(response);
  //   setMedicineData(response.data.list);
  // };

  // function downloadDocument(path) {
  //   if (!path) {
  //     alert('Data not Found.');
  //     return;
  //   }
  //   const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${path}`;
  //   window.open(url, '_blank');
  // }

  const [cmoStatus, setCmoStatus] = useState('');
  const [cmoRemark, setCmoRemark] = useState('');
  const [cmoAprAmount, setCmoAprAmount] = useState('');
  // const [forwardTo, setForwardTo] = useState(''); // new state
  const [errors, setErrors] = useState({});

  const statusRef = useRef(null);
  const remarkRef = useRef(null);
  const amountRef = useRef(null);

  // const forwardToRef = useRef(null);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!cmoStatus) newErrors.cmoStatus = 'Status is required';

    // if (cmoStatus === 'Rejected' && !forwardTo) {
    //   newErrors.forwardTo = 'Forward To is required when Rejected';
    // }

    if (!cmoAprAmount.trim()) newErrors.cmoAprAmount = 'Amount is required';
    if (!cmoRemark.trim()) newErrors.cmoRemark = 'Remark is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.cmoStatus && statusRef.current) statusRef.current.focus();
      else if (newErrors.cmoAprAmount && amountRef.current)
        amountRef.current.focus();
      else if (newErrors.cmoRemark && remarkRef.current)
        remarkRef.current.focus();
      return false;
    }
    return true;
  };

  //  Submit function
  const CmoStatusUpdate = async () => {
    if (!validate()) return;
    setOpenBackdrop(true);
    const payload = {
      refNo: referenceNo,
      status: cmoStatus,
      remark: cmoRemark,
      totalAmountApprovedByDoc: cmoAprAmount,
      // next: cmoStatus === 'Approved' ? '' : forwardTo,
    };

    try {
      // replace with your API call
      const response = await submitMedicalCmoStatus(payload);
      console.log('Success:', response);
      if (response.data.code === '200') {
        alert('Status Updated Successfully !!');
        setOpenBackdrop(false);
        //window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Submission failed!');
      setOpenBackdrop(false);
    }
  };

  const handleEssentialityDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    // console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  const handleProlongedDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    // console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  const handleMemoDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    // console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };
  return (
    <>
      <Card className="shadow">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{
              color: '#0a1f83',
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            CMO Verification for Medical Reimbursement
          </Typography>
        </Card.Header>
        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Patient Name</StyledTableCell>
                  <StyledTableCell>Patient Code</StyledTableCell>
                  <StyledTableCell>Reference No.</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {records && records.length > 0 ? (
                  records.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>
                        {item.patientName || '-'}
                      </StyledTableCell>
                      <StyledTableCell>{item.empCode || '-'}</StyledTableCell>
                      <StyledTableCell>{item.refNo || '-'}</StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title="Preview" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            //sx={{ backgroundColor: "#37474F", color: "#fff" }}
                            // onClick={() => handlePreview(item)}
                            onClick={() => handlePreview(item.refNo)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={8}>
                      Data Not Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            variant="outlined"
            className="cancel-button"
            component={Link}
            to="/"
          >
            Back
          </Button>
        </Card.Footer>
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
        {/* Header */}
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
            Medical Verification By CMO
          </Typography>
        </DialogTitle>

        {/* Body */}
        <DialogContent
          dividers
          sx={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            maxHeight: '80vh',
          }}
        >
          {selectedRow && (
            <Grid container spacing={3}>
              {fieldCard('Employee Code', selectedRow.empCode, 0)}
              {fieldCard('Reference No', selectedRow.refNo, 1)}
              {fieldCard('Patient Name', selectedRow.patientName, 2)}
              {fieldCard('Patient Relation', selectedRow.patientRelation, 3)}
              {fieldCard('OPD No', selectedRow.opdNo, 4)}
              {fieldCard('OPD Date', selectedRow.opdDate, 5)}
              {fieldCard('Doctor Name', selectedRow.doctorName, 6)}
              {fieldCard(
                'Doctor Designation',
                selectedRow.doctorDesignation,
                7,
              )}
              {fieldCard('Nature of Illness', selectedRow.natureOfIllness, 8)}
              {fieldCard('Illness Duration', selectedRow.illnessDuration, 9)}
              {fieldCard(
                'Essentiality Certificate No',
                selectedRow.essentialityCertificateNo,
                10,
              )}
              {fieldCard(
                'Certificate Date',
                selectedRow.essentialityCertificateDate,
                11,
              )}
              {fieldCard(
                'No Of Living Children',
                selectedRow.noOfLivingChildren,
                12,
              )}
              {fieldCard('No In Birth Order', selectedRow.noInBirthOrder, 13)}
              {fieldCard('Application Date', selectedRow.applicationDate, 14)}
              {fieldCard('Created Date', selectedRow.created, 15)}
              {fieldCard('Present Address', selectedRow.presentAddress, 16)}
              {fieldCard('Total Amount', selectedRow.totalAmount, 17)}
              {fieldCard('HR Status', selectedRow.hrStatus, 18)}
              {fieldCard('HR Remark', selectedRow.hrRemark, 19)}
              {fieldCard('CMO Status', selectedRow.cmoStatus, 20)}
              {fieldCard('CMO Remark', selectedRow.cmoRemark, 21)}
              {fieldCard('AO Status', selectedRow.aoStatus, 22)}
              {fieldCard('AO Remark', selectedRow.aoRemark, 23)}

              {fieldCard('Bank Name', selectedRow.bankName, 24)}
              {fieldCard('Bank Code', selectedRow.bankCode, 25)}
              {fieldCard('Cheque No', selectedRow.chequeNo, 26)}
              {fieldCard(
                'Amount Approved by CMO',
                selectedRow.totalAmountApprovedByDoc,
                27,
              )}

              {fieldCard(
                'Essentiality Certificate',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                28,
                () =>
                  handleEssentialityDownload(
                    selectedRow.essentialityCertificateDoc,
                  ),
              )}

              {fieldCard(
                'Prolonged Certificate',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                29,
                () => handleProlongedDownload(selectedRow.prolongedTreatment),
              )}

              {fieldCard(
                'Memo Doc',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                30,
                () => handleMemoDownload(selectedRow.memoPath),
              )}
            </Grid>
          )}

          <Card className="shadow mt-3">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  color: '#0a1f83',
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Drug Details
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Cash Memo Date</StyledTableCell>
                      <StyledTableCell>Cash Memo No</StyledTableCell>
                      <StyledTableCell>Drug Name</StyledTableCell>
                      <StyledTableCell>Quantity</StyledTableCell>
                      <StyledTableCell>ShopName</StyledTableCell>
                      <StyledTableCell>Total Value</StyledTableCell>
                      <StyledTableCell>Document</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {medicineData && medicineData.length > 0 ? (
                      medicineData.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.cashMemoDate || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.cashMemoNo || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.drugName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.quantity || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.shopName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.totalValue || '-'}
                          </StyledTableCell>

                          <StyledTableCell>
                            <Tooltip title="Preview" arrow>
                              <Button
                                variant="contained"
                                color="dark"
                                //sx={{ backgroundColor: "#37474F", color: "#fff" }}
                                onClick={() => downloadDocument(item.memoPath)}
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
                        <StyledTableCell colSpan={8}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer> */}

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Shop Name</StyledTableCell>
                      <StyledTableCell>Cash Memo No</StyledTableCell>
                      <StyledTableCell>Cash Memo Date</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {medicineData && medicineData.length > 0 ? (
                      medicineData.map((item, index) => (
                        <React.Fragment key={index}>
                          {/* Main Row */}
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>
                              {item.shopName || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.cashMemoNo || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.cashMemoDate || '-'}
                            </StyledTableCell>

                            <StyledTableCell>
                              <Tooltip
                                title={
                                  expandedRow === index
                                    ? 'Hide Memo Details'
                                    : 'Show Memo Details'
                                }
                                arrow
                                placement="top"
                              >
                                <Button
                                  variant="contained"
                                  color="dark"
                                  onClick={() => handlePreviewMemo(item, index)}
                                  sx={{ minWidth: 40 }}
                                >
                                  {/* Toggle icon same, but color changes */}
                                  <VisibilityIcon
                                    fontSize="small"
                                    color={
                                      expandedRow === index
                                        ? 'error'
                                        : 'success'
                                    }
                                  />
                                </Button>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>

                          {/* Sub Table - Expandable */}
                          {expandedRow === index && (
                            <StyledTableRow>
                              <StyledTableCell colSpan={5} sx={{ padding: 1 }}>
                                <Table size="small">
                                  <TableHead>
                                    <SubTableRow>
                                      <SubTableCell>S.No.</SubTableCell>
                                      <SubTableCell>Cash Memo No</SubTableCell>
                                      <SubTableCell>Drug Name</SubTableCell>
                                      <SubTableCell>Quantity</SubTableCell>
                                      <SubTableCell>Total Value</SubTableCell>
                                    </SubTableRow>
                                  </TableHead>

                                  <TableBody>
                                    {item.memoList.map((memo, i) => (
                                      <SubTableRow key={i}>
                                        <SubTableCell>{i + 1}</SubTableCell>
                                        <SubTableCell>
                                          {memo.cashMemoNo || '-'}
                                        </SubTableCell>
                                        <SubTableCell>
                                          {memo.drugName || '-'}
                                        </SubTableCell>
                                        <SubTableCell>
                                          {memo.quantity || '-'}
                                        </SubTableCell>
                                        <SubTableCell>
                                          {memo.totalValue || '-'}
                                        </SubTableCell>
                                      </SubTableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </StyledTableCell>
                            </StyledTableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={8}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
            <Card.Footer className="text-center"></Card.Footer>
          </Card>

          <Card className="shadow mt-3">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  color: '#0a1f83',
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Update CMO Status
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Status Select */}
                <Col xs={12} md={3} className="mb-2">
                  <Card>
                    <Card.Header>Select Status</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={statusRef}
                        value={cmoStatus}
                        onChange={(e) => {
                          setCmoStatus(e.target.value);
                          // if (e.target.value !== 'Rejected') {
                          //   setForwardTo('');
                          // }
                        }}
                        isInvalid={!!errors.cmoStatus}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.cmoStatus}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Forward To Select */}
                <Col xs={12} md={3} className="mb-2">
                  <Card>
                    <Card.Header>Total Approved Amount</Card.Header>
                    <Card.Body>
                      <Form.Control
                        rows={2}
                        placeholder="Enter Remark..."
                        ref={amountRef}
                        value={cmoAprAmount}
                        onChange={(e) => setCmoAprAmount(e.target.value)}
                        isInvalid={!!errors.cmoAprAmount}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.cmoAprAmount}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Remark Textarea */}
                <Col xs={12} md={6}>
                  <Card>
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Remark..."
                        ref={remarkRef}
                        value={cmoRemark}
                        onChange={(e) => setCmoRemark(e.target.value)}
                        isInvalid={!!errors.cmoRemark}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.cmoRemark}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center"></Card.Footer>
          </Card>
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              onClick={handleClose}
              variant="contained"
              className="cancel-button"
            >
              Close
            </Button>
            &nbsp;
            <Button
              onClick={CmoStatusUpdate}
              variant="contained"
              className="green-button"
            >
              Submit
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default MedicalApprovalByCmo;
