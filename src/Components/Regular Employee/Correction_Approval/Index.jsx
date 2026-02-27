import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PropagateLoader } from 'react-spinners';
import ImageIcon from '@mui/icons-material/Image';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

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
} from '@mui/material';
import {
  approveCorrections,
  approveLeave,
  getImpressionImage,
  getEmpAttSummary,
  getEmpCorrectionsDetails,
} from '../../../Services/Auth';
import Modal from 'react-bootstrap/Modal';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function CorrectionApproval() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [attSummary, setAttSummary] = useState([]);
  const tableRef = useRef();

  const location = useLocation();
  const { empCode, empName, empDesignation, month, year } =
    location.state || {};

  useEffect(() => {
    const fetchSummary = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getEmpAttSummary(empCode, month, year);
        // console.log(response);
        if (response.data.code === '200') {
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

  const [empCorrections, setEmpCorrections] = useState([]);
  useEffect(() => {
    const fetchSummary = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getEmpCorrectionsDetails(empCode, month, year);
        // console.log("100-", response);
        if (response.data.code === '200') {
          setEmpCorrections(response.data.list);
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

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const [remark, setRemark] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  //  Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(empCorrections.map((_, i) => i));
    } else {
      setSelectedRows([]);
    }
  };

  //  Handle single row checkbox
  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  // Add refs for focusing
  const selectRef = useRef(null);
  const remarkRef = useRef(null);

  const handleSubmit = async () => {
    if (!selectValue) {
      alert('Please select a status (Approved/Rejected).');
      selectRef.current?.focus();
      return;
    }
    if (!remark.trim()) {
      alert('Remark is required.');
      remarkRef.current?.focus();
      return;
    }
    if (selectedRows.length === 0) {
      alert('Please select at least one record.');
      return;
    }

    // Get selected records
    const selectedData = selectedRows.map((index) => empCorrections[index]);

    try {
      const messages = [];

      for (const record of selectedData) {
        if (record.applyFor === 'Present') {
          const payload = {
            empCode: record.empCode,
            punchDate: record.punchDate,
            correctionStatus: selectValue,
            correctionRemark: remark,
          };

          const correctionResponse = await approveCorrections(payload);
          // console.log('Present response:', correctionResponse.data);

          if (correctionResponse.data.code === '200') {
            messages.push(`Status Updated Successfully!!`);
          } else {
            messages.push(`${correctionResponse.data.message}`);
          }
        } else if (record.applyFor === 'Leave') {
          const payload = {
            empCode: record.empCode,
            leaveDate: record.punchDate,
            leaveTypeId: record.leaveTypeId,
            isHalfDay: false,
            isHql: false,
            leaveStatus: selectValue,
            roRemark: remark,
          };

          const leaveResponse = await approveLeave(payload);
          // console.log('Leave response:', leaveResponse.data);
          if (leaveResponse.data.code === '200') {
            messages.push(`Status Updated Successfully!!`);
          } else {
            messages.push(`${leaveResponse.data.message}`);
          }
        }
      }

      // Show all results at once
      alert(messages.join('\n'));
      window.location.reload();
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Something went wrong while submitting!');
    }
  };

  const [modalShow, setModalShow] = useState(false);
  const [impressionData, setImpressionData] = useState([]);
  const modalClose = () => setModalShow(false);

  const modalOpen = async (items) => {
    // console.log(items);
    setModalShow(true);
    // setImpressionData(items);
    setOpenBackdrop(true);
    const inputDate = new Date(items.punchDate);

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

    const formattedDate = `${String(inputDate.getDate()).padStart(2, '0')}-${
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
                    <Table ref={tableRef} tabIndex={-1}>
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
                    <Table ref={tableRef} tabIndex={-1}>
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
              <Row className="justify-content-center my-1 g-3">
                <Col xs={12} sm={6} md={2}>
                  <Form.Select
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    ref={selectRef}
                  >
                    <option value="" disabled>
                      -- select --
                    </option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Col>

                <Col xs={12} sm={6} md={3}>
                  <Form.Control
                    placeholder="Enter Remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    ref={remarkRef}
                  />
                </Col>

                <Col xs={12} sm={4} md={2} className="d-grid">
                  <Button
                    variant="contained"
                    className="blue-button"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>

              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>
                        Select All <br />
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </StyledTableCell>
                      <StyledTableCell>Images</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Punch Date</StyledTableCell>
                      <StyledTableCell>In Time</StyledTableCell>
                      <StyledTableCell>Out Time</StyledTableCell>
                      <StyledTableCell>Duration</StyledTableCell>
                      <StyledTableCell>Remark</StyledTableCell>
                      <StyledTableCell>Impression</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Apply For</StyledTableCell>
                      <StyledTableCell>Leave Type</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {empCorrections && empCorrections.length > 0 ? (
                      empCorrections.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(index)}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.impressions > 0 ? (
                              <Tooltip title="View Images" arrow>
                                <Button
                                  // className="green-button"
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
                          {/* <StyledTableCell>{item.inTime}</StyledTableCell>
                           */}

                          <StyledTableCell>
                            {item.inTime
                              ? item.inTime.split('T')[1]?.split('.')[0]
                              : ''}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.outTime
                              ? item.outTime.split('T')[1]?.split('.')[0]
                              : ''}
                          </StyledTableCell>

                          {/* <StyledTableCell>{item.outTime}</StyledTableCell> */}

                          <StyledTableCell>{item.duration}</StyledTableCell>
                          <StyledTableCell>{item.remark}</StyledTableCell>
                          <StyledTableCell>{item.impressions}</StyledTableCell>
                          <StyledTableCell>{item.status}</StyledTableCell>
                          <StyledTableCell>{item.applyFor}</StyledTableCell>
                          <StyledTableCell>
                            {item.leaveTypeName}
                          </StyledTableCell>
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
export default CorrectionApproval;
