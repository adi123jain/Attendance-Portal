import { useState } from 'react';
import {
  getAcrByEmpCode,
  getEmpByNameMobileEmpCode,
  getEmployeePlaceOfPosting,
} from '../../../Services/Auth';
import { PropagateLoader } from 'react-spinners';
import '../../../Constants/Style/styles.css';
import { Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Button,
  Backdrop,
} from '@mui/material';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';
import { Modal, Box, Grid, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

function EmployeeSearch() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [empCode, setEmpCode] = useState('');
  const [empCodeError, setEmpCodeError] = useState('');
  const [showEmpTable, setShowEmpTable] = useState(false);
  const [dataInEmpTable, setDataInEmpTable] = useState([]);

  const searchByEmpCode = async () => {
    if (!empCode.trim()) {
      setEmpCodeError('*This filed  is Required.');
      return;
    } else {
      setEmpCodeError('');
    }

    if (empCode.trim().length < 3) {
      setEmpCodeError('*Minimum 3 characters required.');
      return;
    } else {
      setEmpCodeError('');
    }

    setOpenBackdrop(true);

    try {
      const res = await getEmpByNameMobileEmpCode(empCode);
      if (res?.data.code === '200' && res?.data.message === 'Success') {
        setDataInEmpTable(res?.data?.list);
        setShowEmpTable(true);
      } else {
        setDataInEmpTable(null);
        setShowEmpTable(true);
        alert(res?.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };
  const [open, setOpen] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [acrData, setAcrData] = useState([]);
  const [empForImg, setEmpForImg] = useState('');
  const [postingData, setPostingData] = useState([]);

  const profileModal = async (data) => {
    setEmpForImg(data.empCode);
    const response = await getAcrByEmpCode(data.empCode);
    setStoreData(data);
    setOpen(true);
    if (response?.data.status_code === 200) {
      setAcrData(response.data.data);
    }

    const postingResponse = await getEmployeePlaceOfPosting(data.empCode);
    if (
      postingResponse?.data.code === '200' &&
      postingResponse?.data.message === 'Success'
    ) {
      setPostingData(postingResponse?.data.list);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAcrData([]);
    setStoreData([]);
    setPostingData([]);
  };

  return (
    <>
      <Card className="shadow-lg rounded">
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
            Employee Search
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <Card
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                  border: 'none',
                }}
              >
                <Card.Header
                  style={{
                    background: '#f8f9fa',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      color: '#0a1f83',
                    }}
                  >
                    Search by Employee Code, Name, Locations, Designation,
                    Department or Mobile Number
                  </Typography>
                </Card.Header>

                <Card.Body style={{ padding: '25px' }}>
                  <Row className="justify-content-center">
                    <Col xs={12}>
                      <InputGroup
                        style={{
                          borderRadius: '30px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <InputGroup.Text
                          style={{
                            background: '#fff',
                            border: 'none',
                            paddingLeft: '15px',
                          }}
                        >
                          <SearchIcon style={{ color: '#888' }} />
                        </InputGroup.Text>

                        <Form.Control
                          type="text"
                          id="empCode"
                          placeholder="Search Employee..."
                          value={empCode}
                          isInvalid={!!empCodeError}
                          onChange={(e) => {
                            setEmpCode(e.target.value);
                            if (empCodeError) setEmpCodeError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              searchByEmpCode();
                            }
                          }}
                          style={{
                            border: 'none',
                            height: '46px',
                            boxShadow: 'none',
                          }}
                        />

                        <Button
                          onClick={searchByEmpCode}
                          variant="contained"
                          sx={{
                            borderRadius: '0 30px 30px 0',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 3,
                            background: '#0a1f83',
                          }}
                        >
                          Search
                        </Button>
                      </InputGroup>

                      {empCodeError && (
                        <div className="emp-search-error">{empCodeError}</div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {showEmpTable && (
        <Card
          className="shadow-lg rounded"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          <Card.Header className="text-center p-3">
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
                color: '#0a1f83',
              }}
            >
              Employee Records
            </Typography>
          </Card.Header>

          <Card.Body>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#0a1f83',
                }}
              >
                Total Records: {dataInEmpTable?.length || 0}
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Designation</StyledTableCell>
                    <StyledTableCell>Department</StyledTableCell>
                    <StyledTableCell>Posting Location</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInEmpTable && dataInEmpTable.length > 0 ? (
                    dataInEmpTable.map((item, index) => (
                      <StyledTableRow>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{item.empCode}</StyledTableCell>
                        <StyledTableCell>{item.fullName}</StyledTableCell>
                        <StyledTableCell>{item.designation}</StyledTableCell>
                        <StyledTableCell>{item.department}</StyledTableCell>
                        <StyledTableCell>
                          {item.postingLocation}
                        </StyledTableCell>

                        <StyledTableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="dark"
                            onClick={() => profileModal(item)}
                          >
                            <VisibilityIcon color="success" />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7}>
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        disableScrollLock
        sx={{ mt: 2, mb: 2 }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 0, md: '50%' },
            left: '50%',
            transform: {
              xs: 'translate(-50%, 0)',
              md: 'translate(-50%, -50%)',
            },

            width: { xs: '100%', sm: '95%', md: '90%', lg: 1400 },

            //  IMPORTANT DIFFERENCE
            height: { xs: '100vh', md: 'auto' },
            maxHeight: { md: '85vh' },

            bgcolor: '#f9fafc',
            borderRadius: { xs: 0, md: '14px' },
            boxShadow: 24,

            //  MOBILE SCROLL HERE
            overflowY: { xs: 'auto', md: 'hidden' },

            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Grid container>
            {/* LEFT PANEL */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                background: 'linear-gradient(135deg,#11c5c6,#0a8fb5)',
                p: { xs: 2, md: 4 },
                color: '#fff',

                //  SCROLL ONLY ON DESKTOP
                maxHeight: { md: '85vh' },
                overflowY: { xs: 'visible', md: 'auto' },
              }}
            >
              <Box textAlign="center">
                <Avatar
                  src={`https://attendance.mpcz.in:8888/E-Attendance/api/employee/getEmployeeImage/${empForImg}`}
                  sx={{
                    width: { xs: 90, md: 130 },
                    height: { xs: 90, md: 130 },
                    border: '4px solid #fff',
                    margin: 'auto',
                  }}
                />

                <Typography variant="h6" mt={2} fontWeight="bold">
                  {storeData?.fullName}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {storeData?.designation}
                </Typography>
              </Box>

              <Box>
                {[
                  ['Employee ID', storeData?.empCode],
                  ['Mobile', storeData?.mobileNo],
                  ['Pay Matrix', storeData?.payMatrixLevel],
                  ['Department', storeData?.department],
                  ['Posting Location', storeData?.postingLocation],
                  ['Employment Type', storeData?.employementType],
                  ['Home Town', storeData?.city],
                ].map(([label, value], index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1.2,
                      mb: 1.2,
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="caption">{label}</Typography>
                    <Typography fontWeight="bold">{value || '-'}</Typography>
                  </Paper>
                ))}
              </Box>
            </Grid>

            {/* RIGHT PANEL */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                p: { xs: 1.5, md: 3 },

                //  THIS FIXES LG SCROLL
                maxHeight: { md: '85vh' },
                overflowY: { xs: 'visible', md: 'auto' },
              }}
            >
              {/* ACR */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ACR Records
                </Typography>

                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Emp Code</StyledTableCell>
                        <StyledTableCell>Year</StyledTableCell>
                        <StyledTableCell>Grade</StyledTableCell>
                        <StyledTableCell>Download</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>

                    <TableBody>
                      {acrData?.length > 0 ? (
                        acrData.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{item.empCode}</StyledTableCell>
                            <StyledTableCell>{item.fy}</StyledTableCell>
                            <StyledTableCell>{item.grade}</StyledTableCell>
                            <StyledTableCell>
                              <Link href={item.pdf_file} target="_blank">
                                <CloudDownloadIcon color="success" />
                              </Link>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={5}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* SCN */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  SCN Records
                </Typography>

                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Issuer</StyledTableCell>
                        <StyledTableCell>Emp Code</StyledTableCell>
                        <StyledTableCell>SCN No.</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>

                    <TableBody>
                      {storeData?.scnList?.length > 0 ? (
                        storeData.scnList.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{item.scnIssuer}</StyledTableCell>
                            <StyledTableCell>
                              {item.scnIssuerEmpCode}
                            </StyledTableCell>
                            <StyledTableCell>{item.scnNo}</StyledTableCell>
                            <StyledTableCell>{item.status}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={5}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* DE */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  DE Records
                </Typography>

                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Issuer</StyledTableCell>
                        <StyledTableCell>Emp Code</StyledTableCell>
                        <StyledTableCell>DE No.</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>

                    <TableBody>
                      {storeData?.deList?.length > 0 ? (
                        storeData.deList.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{item.deIssuer}</StyledTableCell>
                            <StyledTableCell>
                              {item.deIssuerEmpCode}
                            </StyledTableCell>
                            <StyledTableCell>{item.deNo}</StyledTableCell>
                            <StyledTableCell>{item.status}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={5}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* PREVIOUS POSTINGS */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Previous Postings
                </Typography>

                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        {[
                          'S.No.',
                          'Employee Name',
                          'Employee Code',
                          'Region',
                          'Circle',
                          'Division',
                          'SubDivision',
                          'DC',
                          'Substation',
                          'Designation',
                          'Department',
                          'From Date',
                          'To Date',
                        ].map((col, i) => (
                          <StyledTableCell key={i}>{col}</StyledTableCell>
                        ))}
                      </StyledTableRow>
                    </TableHead>

                    <TableBody>
                      {postingData?.length > 0 ? (
                        postingData.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>
                              {item.employeeName}
                            </StyledTableCell>
                            <StyledTableCell>{item.empCode}</StyledTableCell>
                            <StyledTableCell>{item.regionName}</StyledTableCell>
                            <StyledTableCell>{item.circleName}</StyledTableCell>
                            <StyledTableCell>
                              {item.divisionName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.subDivisionName}
                            </StyledTableCell>
                            <StyledTableCell>{item.dcName}</StyledTableCell>
                            <StyledTableCell>{item.subStation}</StyledTableCell>
                            <StyledTableCell>
                              {item.designation}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.departmentName}
                            </StyledTableCell>
                            <StyledTableCell>{item.fromDate}</StyledTableCell>
                            <StyledTableCell>{item.toDate}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={13}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default EmployeeSearch;

{
  /* <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1400,
            maxHeight: '85vh',
            bgcolor: '#f9fafc',
            borderRadius: '14px',
            boxShadow: 24,
            overflow: 'hidden',
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                background: 'linear-gradient(135deg,#11c5c6,#0a8fb5)',
                p: 4,
                color: '#fff',
                maxHeight: '85vh',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Box textAlign="center">
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={`https://attendance.mpcz.in:8888/E-Attendance/api/employee/getEmployeeImage/${empForImg}`}
                    sx={{
                      width: 130,
                      height: 130,
                      border: '4px solid #fff',
                    }}
                  />
                </Box>

                <Typography variant="h6" mt={2} fontWeight="bold">
                  {storeData?.fullName}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                  {storeData?.designation}
                </Typography>
              </Box>

              <Box>
                {[
                  ['Employee ID', storeData?.empCode],
                  ['Mobile', storeData?.mobileNo],
                  ['Pay Matrix', storeData?.payMatrixLevel],
                  ['Department', storeData?.department],
                  ['Posting Location', storeData?.postingLocation],
                  ['Employment Type', storeData?.employementType],
                  ['Home Town', storeData?.city],
                ].map(([label, value], index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="caption">{label}</Typography>
                    <Typography fontWeight="bold">{value || '-'}</Typography>
                  </Paper>
                ))}
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={8}
              sx={{
                p: 3,
                maxHeight: '85vh',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: '#0a1f83', mb: 2 }}
                >
                  ACR Records
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: 220,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Emp Code</StyledTableCell>
                        <StyledTableCell>Year</StyledTableCell>
                        <StyledTableCell>Grade</StyledTableCell>
                        <StyledTableCell>Download</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {acrData && acrData?.length > 0 ? (
                        acrData?.map((item, index) => (
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{item.empCode}</StyledTableCell>
                            <StyledTableCell>{item.fy}</StyledTableCell>
                            <StyledTableCell>{item.grade}</StyledTableCell>
                            <StyledTableCell>
                              <Link
                                component="a"
                                to={item.pdf_file}
                                target="_blank"
                              >
                                <CloudDownloadIcon color="success" />
                              </Link>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={7}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: '#0a1f83', mb: 2 }}
                >
                  SCN Records
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: 220,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Issuer</StyledTableCell>
                        <StyledTableCell>Emp Code</StyledTableCell>
                        <StyledTableCell>SCN No.</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {storeData?.scnList && storeData?.scnList?.length > 0 ? (
                        storeData?.scnList?.map((item, index) => (
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{item.scnIssuer}</StyledTableCell>
                            <StyledTableCell>
                              {item.scnIssuerEmpCode}
                            </StyledTableCell>
                            <StyledTableCell>{item.scnNo}</StyledTableCell>
                            <StyledTableCell>{item.status}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={7}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: '#0a1f83', mb: 2 }}
                >
                  DE Records
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: 220,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Issuer</StyledTableCell>
                        <StyledTableCell>Emp Code</StyledTableCell>
                        <StyledTableCell>DE No.</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {storeData?.deList && storeData?.deList?.length > 0 ? (
                        storeData?.deList?.map((item, index) => (
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{item.deIssuer}</StyledTableCell>
                            <StyledTableCell>
                              {item.deIssuerEmpCode}
                            </StyledTableCell>
                            <StyledTableCell>{item.deNo}</StyledTableCell>
                            <StyledTableCell>{item.status}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={7}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: '#0a1f83', mb: 2 }}
                >
                  Previous Postings
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: 220,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No.</StyledTableCell>
                        <StyledTableCell>Employee Name</StyledTableCell>
                        <StyledTableCell>Employee Code</StyledTableCell>
                        <StyledTableCell>Region</StyledTableCell>
                        <StyledTableCell>Circle</StyledTableCell>
                        <StyledTableCell>Division</StyledTableCell>
                        <StyledTableCell>SubDivision</StyledTableCell>
                        <StyledTableCell>DC</StyledTableCell>
                        <StyledTableCell>Substation</StyledTableCell>
                        <StyledTableCell>Designation</StyledTableCell>
                        <StyledTableCell>Department</StyledTableCell>
                        <StyledTableCell>From Date</StyledTableCell>
                        <StyledTableCell>To Date</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {postingData && postingData.length > 0 ? (
                        postingData.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>
                              {item.employeeName}
                            </StyledTableCell>
                            <StyledTableCell>{item.empCode}</StyledTableCell>

                            <StyledTableCell>{item.regionName}</StyledTableCell>
                            <StyledTableCell>{item.circleName}</StyledTableCell>
                            <StyledTableCell>
                              {item.divisionName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.subDivisionName}
                            </StyledTableCell>
                            <StyledTableCell>{item.dcName}</StyledTableCell>
                            <StyledTableCell>{item.subStation}</StyledTableCell>
                            <StyledTableCell>
                              {item.designation}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.departmentName}
                            </StyledTableCell>
                            <StyledTableCell>{item.fromDate}</StyledTableCell>
                            <StyledTableCell>{item.toDate}</StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={13}>
                            Data Not Found
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Modal> */
}
