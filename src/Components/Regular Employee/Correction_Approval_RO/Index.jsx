import React, { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PropagateLoader } from 'react-spinners';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ImageIcon from '@mui/icons-material/Image';

// import "../../../Constants/Style/styles.css";
import {
  Typography,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Backdrop,
} from '@mui/material';
import {
  approveCorrections,
  approveLeave,
  getEmpAttSummary,
  employeeAttendaceView,
  getImpressionImage,
} from '../../../Services/Auth';
import Modal from 'react-bootstrap/Modal';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

// const headerBackground = "linear-gradient(to right, #1E88E5, #42A5F5)";
// const oddRowBackground = "#E3F2FD";
// const evenRowBackground = "#BBDEFB";
// const hoverBackground = "#90CAF9";

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

function CorrectionUpdateByRO() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [attSummary, setAttSummary] = useState([]);
  const [showPreference, setShowPreference] = useState(false);
  const [showTypes, setShowTypes] = useState(false);

  const location = useLocation();
  const { empCode, empName, empDesignation, month, year } =
    location.state || {};

  useEffect(() => {
    const fetchSummary = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getEmpAttSummary(empCode, month, year);
        // console.log(response);
        if (response.data.code == '200') {
          setAttSummary(response.data.list);
          setOpenBackdrop(false);
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.log('Error', error);
        setOpenBackdrop(false);
      }
    };

    fetchSummary();
  }, []);

  const [currMonth, setCurrMonth] = useState('');
  const [currYear, setCurrYear] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    setCurrMonth(String(currentDate.getMonth() + 1));
    setCurrYear(String(currentDate.getFullYear()));
  }, []);

  const tableRef = useRef(null);
  const [attInTable, setAttInTable] = useState([]);
  const empAttendanceView = async () => {
    try {
      setAttInTable('');
      setOpenBackdrop(true);
      const response = await employeeAttendaceView(
        empCode,
        currMonth,
        currYear,
      );
      if (response.data.code == '200') {
        setShowPreference(true);
        setAttInTable(response.data.list);
        setOpenBackdrop(false);

        setTimeout(() => {
          tableRef.current?.focus();
        }, 100);
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
        setShowPreference(false);
      }
    } catch (err) {
      console.error(err);
      setOpenBackdrop(false);
      setShowPreference(false);
    }
  };

  const [preference, setPreference] = useState('');
  const [correctionType, setCorrectionType] = useState('');
  const [remark, setRemark] = useState('');

  const [correctionOptions, setCorrectionOptions] = useState([]);

  const [preferenceError, setPreferenceError] = useState('');
  const [correctionError, setCorrectionError] = useState('');
  const [remarkError, setRemarkError] = useState('');

  // Refs for focus
  const preferenceRef = useRef(null);
  const correctionRef = useRef(null);
  const remarkRef = useRef(null);

  const handleSelectPreference = (e) => {
    const value = e.target.value;
    setPreference(value);
    setCorrectionType('');
    setCorrectionError('');

    if (value === '1') {
      setShowTypes(false);
      setCorrectionOptions([]);
    } else if (value === '2') {
      setShowTypes(true);
      setCorrectionOptions([
        { value: '2', label: 'Casual Leave' },
        { value: '3', label: 'Earn Leave' },
        { value: '4', label: 'Commutted Leave' },
        { value: '5', label: 'Optional Leave' },
        { value: '6', label: 'Paternity Leave' },
        { value: '7', label: 'Special Leave' },
        { value: '86', label: 'Maternity Leave' },
        { value: '87', label: 'Child Care Leave' },
        { value: '88', label: 'LWP' },
        { value: '20', label: 'Comp Off' },
      ]);
    } else if (value === '3') {
      setShowTypes(true);
      setCorrectionOptions([{ value: '2', label: 'Casual Leave' }]);
    } else {
      setCorrectionOptions([]);
    }
  };

  // state to store checked items
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) => {
      const alreadySelected = prev.find((i) => i.punchDate === item.punchDate);
      if (alreadySelected) {
        // uncheck
        return prev.filter((i) => i.punchDate !== item.punchDate);
      } else {
        // check
        return [...prev, item];
      }
    });
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!preference) {
      setPreferenceError('*Type of Preference is required');
      if (preferenceRef.current) preferenceRef.current.focus();
      isValid = false;
    } else {
      setPreferenceError('');
    }

    if (showTypes && !correctionType) {
      setCorrectionError('*Correction Type is required');
      if (isValid && correctionRef.current) correctionRef.current.focus();
      isValid = false;
    } else {
      setCorrectionError('');
    }

    if (!remark.trim()) {
      setRemarkError('*Remark is required');
      if (isValid && remarkRef.current) remarkRef.current.focus();
      isValid = false;
    } else {
      setRemarkError('');
    }

    if (!isValid) return;

    if (selectedItems.length === 0) {
      alert('Please select the checkbox first in given Table.');
      if (tableRef.current) tableRef.current.focus();
      return;
    }

    let success = true;
    let message = '';

    for (let item of selectedItems) {
      const DateFormate = formatDate(item.punchDate);
      console.log(item);

      let payload;
      let response;

      if (preference === '1') {
        // Correction
        payload = {
          empCode: item.empCode,
          punchDate: DateFormate,
          correctionStatus: 'Approved',
          correctionRemark: remark,
        };
        // console.log(payload);
        response = await approveCorrections(payload);
        console.log(response);
      } else if (preference === '2') {
        // alert(preference);
        payload = {
          empCode: item.empCode,
          leaveDate: DateFormate,
          leaveTypeId: correctionType,
          isHalfDay: false,
          isHql: false,
          leaveStatus: 'Approved',
          roRemark: remark,
        };
        // console.log(payload);

        response = await approveLeave(payload);
        // console.log(response);
      } else if (preference === '3') {
        // Half-day
        payload = {
          empCode: item.empCode,
          leaveDate: DateFormate,
          leaveTypeId: correctionType,
          isHalfDay: true,
          isHql: false,
          leaveStatus: 'Approved',
          roRemark: remark,
        };
        console.log(payload);

        response = await approveLeave(payload);
        console.log(response);
      }

      if (response.data.code !== '200') {
        success = false;
        message = response.data.message;
        break;
      }
    }

    if (success) {
      if (preference === '1') {
        alert('Corrections Applied Successfully !!');
        window.location.reload();
      } else {
        alert('Leave Applied Successfully !!');
        window.location.reload();
      }
    } else {
      alert(message);
    }
  };

  const [modalShow, setModalShow] = useState(false);
  const [showImpressionTable, setShowImpressionTable] = useState(false);
  const [impressionData, setImpressionData] = useState([]);
  const modalClose = () => setModalShow(false);

  const modalOpen = async (items) => {
    setModalShow(true);
    // setImpressionData(items);
    setOpenBackdrop(true);
    const parts = items.punchDate.split('/');
    const inputDate = new Date(parts[2], parts[1] - 1, parts[0]);
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];

    const formattedDate = `${('0' + inputDate.getDate()).slice(-2)}-${
      months[inputDate.getMonth()]
    }-${inputDate.getFullYear().toString().slice(-2)}`;

    try {
      const response = await getImpressionImage(items.empCode, formattedDate);
      // console.log("impResponse", response);
      if (
        response?.data.code === '200' &&
        response?.data.message === 'Success'
      ) {
        setImpressionData(response?.data.list);
        setOpenBackdrop(false);
      } else {
        alert(response?.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('Error', error);
      setOpenBackdrop(false);
    }
  };

  const downloadImage = (imgUrl) => {
    window.location.href =
      `https://attendance.mpcz.in:8888/E-Attendance/api/attendance/dw_f/` +
      imgUrl;
  };

  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/correctionApplication">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>

          <Typography
            variant="h4"
            sx={{
              flex: 1,
              textAlign: 'center',
              color: '#0a1f83',
              mb: 0,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Approve Leave's / Correction's
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="justify-content-center my-4">
            <Col md={6}>
              <Card>
                <Card.Header className="text-center text-primary">
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#0a1f83',
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Attendance Count
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>Absent</StyledTableCell>
                          <StyledTableCell>HalfDay</StyledTableCell>
                          <StyledTableCell>Holiday</StyledTableCell>
                          <StyledTableCell>Leave</StyledTableCell>
                          <StyledTableCell>Present</StyledTableCell>
                          <StyledTableCell>Status </StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {attSummary && attSummary.length > 0 ? (
                          attSummary.map((item, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell>{item.absent}</StyledTableCell>
                              <StyledTableCell>{item.halfDay}</StyledTableCell>
                              <StyledTableCell>{item.holiday}</StyledTableCell>
                              <StyledTableCell>{item.leave}</StyledTableCell>
                              <StyledTableCell>{item.present}</StyledTableCell>
                              <StyledTableCell>{item.status}</StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            <StyledTableCell colSpan={6}>
                              Data Not Found
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card.Body>
                <Card.Footer></Card.Footer>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header className="text-center text-primary">
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#0a1f83',
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Employee Information
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>Employee Code</StyledTableCell>
                          <StyledTableCell>Employee Name</StyledTableCell>
                          <StyledTableCell>Designation</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableRow>
                          <StyledTableCell>{empCode}</StyledTableCell>
                          <StyledTableCell>{empName}</StyledTableCell>
                          <StyledTableCell>{empDesignation}</StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card.Body>
                <Card.Footer></Card.Footer>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header className="text-center text-primary">
              <Typography
                variant="h5"
                sx={{
                  color: '#0a1f83',
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Update Leave's and Corrections
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row className="justify-content-center my-4 g-3">
                <Col xs={12} sm={6} md={2}>
                  <Form.Select
                    onChange={(e) => setCurrMonth(e.target.value)}
                    value={currMonth}
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={3}>
                  <Form.Select
                    onChange={(e) => setCurrYear(e.target.value)}
                    value={currYear}
                  >
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={4} md={2} className="d-grid">
                  <Button
                    variant="contained"
                    className="blue-button"
                    onClick={empAttendanceView}
                  >
                    View Attendance
                  </Button>
                </Col>
              </Row>

              {showPreference && (
                <Row className="justify-content-center my-4 g-3">
                  <Col xs={12} sm={6} md={2}>
                    <Form.Select
                      ref={preferenceRef}
                      value={preference}
                      onChange={handleSelectPreference}
                    >
                      <option value="" disabled>
                        -- select Type --
                      </option>
                      <option value="1">Present</option>
                      <option value="2">Leave</option>
                      <option value="3">Half Day</option>
                    </Form.Select>
                    {preferenceError && (
                      <Typography variant="caption" className="text-danger">
                        {preferenceError}
                      </Typography>
                    )}
                  </Col>

                  <Col xs={12} sm={6} md={3}>
                    <Form.Control
                      ref={remarkRef}
                      type="text"
                      placeholder="Enter Remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                    {remarkError && (
                      <Typography variant="caption" className="text-danger">
                        {remarkError}
                      </Typography>
                    )}
                  </Col>

                  <Col xs={12} sm={4} md={2} className="d-grid">
                    <Button
                      variant="contained"
                      className="green-button"
                      onClick={handleSubmit}
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
              )}

              {showTypes && (
                <Row className="justify-content-center my-4 g-3">
                  <Col xs={12} sm={6} md={2}>
                    <Form.Select
                      ref={correctionRef}
                      value={correctionType}
                      onChange={(e) => setCorrectionType(e.target.value)}
                    >
                      <option value="" disabled>
                        -- select Type --
                      </option>
                      {correctionOptions.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Select>
                    {correctionError && (
                      <Typography variant="caption" className="text-danger">
                        {correctionError}
                      </Typography>
                    )}
                  </Col>

                  <Col xs={12} sm={6} md={3} className="d-grid"></Col>
                  <Col xs={12} sm={4} md={2} className="d-grid"></Col>
                </Row>
              )}

              <hr />

              <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                <Table ref={tableRef} tabIndex={-1}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Check </StyledTableCell>
                      <StyledTableCell>Images</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Punch Date </StyledTableCell>
                      <StyledTableCell>In Time </StyledTableCell>
                      <StyledTableCell>Out Time</StyledTableCell>
                      <StyledTableCell>Duration (In Mins)</StyledTableCell>
                      <StyledTableCell>Remark</StyledTableCell>
                      <StyledTableCell>Impression </StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Correction Status </StyledTableCell>
                      <StyledTableCell>Leave Status </StyledTableCell>
                      <StyledTableCell>Leave Type </StyledTableCell>
                      <StyledTableCell>Inactive Source</StyledTableCell>
                      <StyledTableCell>Inactive Remark </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {attInTable && attInTable.length > 0 ? (
                      attInTable.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            <input
                              type="checkbox"
                              disabled={
                                item.status === 'Holiday' ||
                                item.status === 'Present' ||
                                item.correctionStatus === 'Approved' ||
                                item.correctionStatus === 'Pending' ||
                                item.leaveStatus === 'Rejected'
                              }
                              checked={selectedItems.some(
                                (i) => i.punchDate === item.punchDate,
                              )}
                              onChange={() => handleCheckboxChange(item)}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.impressions > 0 ? (
                              <Tooltip title="View Images" arrow>
                                <Button
                                  variant="contained"
                                  color="dark"
                                  onClick={() => modalOpen(item)}
                                >
                                  <ImageIcon fontSize="small" color="primary" />
                                </Button>
                              </Tooltip>
                            ) : (
                              '-'
                            )}
                          </StyledTableCell>

                          <StyledTableCell>{item.empCode}</StyledTableCell>
                          <StyledTableCell>{item.punchDate}</StyledTableCell>
                          <StyledTableCell>
                            {item.inTime
                              ? new Date(item.inTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.outTime
                              ? new Date(item.outTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </StyledTableCell>
                          <StyledTableCell>{item.duration}</StyledTableCell>
                          <StyledTableCell>{item.remark}</StyledTableCell>
                          <StyledTableCell>{item.impressions}</StyledTableCell>
                          <StyledTableCell>{item.status}</StyledTableCell>
                          <StyledTableCell>
                            {item.correctionStatus}
                          </StyledTableCell>
                          <StyledTableCell>{item.leaveStatus}</StyledTableCell>
                          <StyledTableCell>{item.leaveType}</StyledTableCell>
                          <StyledTableCell>
                            {item.inactiveSource}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.inactiveRemark}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={14}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Card>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>

      <Modal
        show={modalShow}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h5"
              sx={{
                color: '#0a1f83',
                // mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              Employee Impressions
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TableContainer component={Paper}>
            <Table className="overflow-hidden">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Punch Time</StyledTableCell>
                  <StyledTableCell>LogType</StyledTableCell>
                  <StyledTableCell>Source</StyledTableCell>
                  <StyledTableCell>Download</StyledTableCell>
                  <StyledTableCell>Longitude</StyledTableCell>
                  <StyledTableCell>Lattitude</StyledTableCell>
                  {/* <StyledTableCell>Status</StyledTableCell> */}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {impressionData && impressionData.length > 0 ? (
                  impressionData.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.empCode}</StyledTableCell>
                      <StyledTableCell>{item.empName}</StyledTableCell>
                      <StyledTableCell>
                        {item.punchTime ? item.punchTime.split('T')[0] : '--'}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.punchTime
                          ? item.punchTime.split('T')[1].split('.')[0]
                          : '--'}
                      </StyledTableCell>
                      <StyledTableCell>{item.logType}</StyledTableCell>
                      <StyledTableCell>{item.source}</StyledTableCell>
                      <StyledTableCell>
                        {item.source === 'BIOMETRIC' || !item.imgPath ? (
                          <Button color="secondary" size="small" disabled>
                            View
                          </Button>
                        ) : (
                          <Button
                            className="blue-button"
                            size="small"
                            onClick={() => downloadImage(item.imgPath)}
                          >
                            <CloudDownloadIcon />
                          </Button>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{item.longitude}</StyledTableCell>
                      <StyledTableCell>{item.latitude}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={10} align="center">
                      No Impression Data Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal.Body>

        {/* <Modal.Footer></Modal.Footer> */}
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
export default CorrectionUpdateByRO;
