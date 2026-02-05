import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { PropagateLoader } from 'react-spinners';
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
  applyCorrections,
  applyLeaves,
  getEmployeeLeaveBalance,
  viewEmpAttendanceBySessionCode,
} from '../../../Services/Auth';
import axios from 'axios';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function ApplyAttendanceCorrection() {
  const [balanceLeave, setBalanceLeave] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    const fetchEmpBalanceLeave = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getEmployeeLeaveBalance();
        // console.log("Leaver", response);
        if (
          response?.data?.code === '200' &&
          response?.data?.message === 'Success'
        ) {
          setBalanceLeave(response.data.list || []);
          setOpenBackdrop(false);
        } else {
          alert(
            response?.data?.message || 'Failed to fetch Punishment Details',
          );
          setOpenBackdrop(false);
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setOpenBackdrop(false);
      }
    };
    fetchEmpBalanceLeave();
  }, []);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [dataInTbale, setDataInTable] = useState([]);

  // refs to control focus
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  useEffect(() => {
    const currentDate = new Date();
    setMonth(String(currentDate.getMonth() + 1));
    setYear(String(currentDate.getFullYear()));
  }, []);

  const tableRef = useRef(null);
  const empAttendanceView = async () => {
    try {
      setDataInTable('');
      setOpenBackdrop(true);
      const response = await viewEmpAttendanceBySessionCode(month, year);
      if (response.data.code === '200') {
        //console.log(response);
        setDataInTable(response.data.list);
        setOpenBackdrop(false);
        // tableRef.current?.focus();
        setTimeout(() => {
          tableRef.current?.focus();
        }, 100);
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.error(err);
      setOpenBackdrop(false);
    }
  };

  const [preference, setPreference] = useState('');
  const [correctionType, setCorrectionType] = useState('');
  const [remark, setRemark] = useState('');

  const [correctionOptions, setCorrectionOptions] = useState([]);

  // Validation messages
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
    setRemark('');
    setPreferenceError('');
    setCorrectionError('');
    setRemarkError('');

    if (value === '1') {
      setShowCheckbox(false);
      setCorrectionOptions([
        { value: 'On Duty', label: 'On Duty' },
        { value: 'Work From Home', label: 'Work From Home' },
        { value: 'Meeting', label: 'Meeting' },
        { value: 'Tour', label: 'Tour' },
        { value: 'Other', label: 'Other' },
      ]);
    } else if (value === '2') {
      setShowCheckbox(true);
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
        { value: '91', label: 'Miscarriage/Sterilization' },
      ]);
    } else if (value === '3') {
      setShowCheckbox(true);
      setCorrectionOptions([{ value: '2', label: 'Casual Leave' }]);
    } else {
      setCorrectionOptions([]);
    }
  };

  const [isHql, setIsHql] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsHql(e.target.checked);
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!preference) {
      setPreferenceError('*Type of Preference is required');
      preferenceRef.current.focus();
      isValid = false;
    } else {
      setPreferenceError('');
    }

    if (!correctionType) {
      setCorrectionError('*Correction Type is required');
      if (isValid) correctionRef.current.focus();
      isValid = false;
    } else {
      setCorrectionError('');
    }

    if (!remark.trim()) {
      setRemarkError('*Remark is required');
      if (isValid) remarkRef.current.focus();
      isValid = false;
    } else {
      setRemarkError('');
    }

    if (!isValid) return;

    const CheckInput = document.querySelectorAll('.getCheckValues');
    let CheckInputVal = [];
    CheckInput.forEach((element) => {
      if (element.checked) {
        CheckInputVal.push(element.value);
      }
    });

    if (CheckInputVal.length === 0) {
      alert('Please select the checkbox first in given Table.');
      tableRef.current?.focus();
      return;
    }

    let success = true;
    let message = '';

    for (let item of CheckInputVal) {
      const dateParts = item.split('/');
      const day = String(parseInt(dateParts[0])).padStart(2, '0');
      const month = String(parseInt(dateParts[1])).padStart(2, '0');
      const year = parseInt(dateParts[2]);
      const DateFormate = `${year}-${month}-${day}`;

      let payload;
      let response;

      if (preference === '1') {
        payload = {
          empCode: sessionStorage.getItem('empCode'),
          punchDate: DateFormate,
          applicationRemark: remark,
          correctionType: correctionType,
        };

        response = await applyCorrections(payload);
      } else if (preference === '2') {
        payload = {
          empCode: sessionStorage.getItem('empCode'),
          leaveDate: DateFormate,
          remark: remark,
          leaveTypeId: correctionType,
          isHalfDay: false,
          isHql: isHql,
        };

        response = await applyLeaves(payload);
      } else if (preference === '3') {
        payload = {
          empCode: sessionStorage.getItem('empCode'),
          leaveDate: DateFormate,
          remark: remark,
          leaveTypeId: correctionType,
          isHalfDay: true,
          isHql: isHql,
        };

        response = await applyLeaves(payload);
      }

      if (response.data.code !== '200') {
        success = false;
        message = response.data.message;
        break;
      }
    }

    // Show alert once
    if (success) {
      if (preference === '1') {
        alert('Corrections Applied Successfully !!');
      } else {
        alert('Leave Applied Successfully !!');
      }
    } else {
      alert(message);
    }
  };

  const [selectedDates, setSelectedDates] = useState([]);

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleCheckBoxForPdf = (e) => {
    const { value, checked } = e.target;
    const formattedDate = formatDate(value);

    setSelectedDates((prev) =>
      checked
        ? [...prev, formattedDate]
        : prev.filter((d) => d !== formattedDate),
    );
  };

  const leavePdfDownload = async () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one checkbox.');
      return;
    }
    try {
      const userEmpCode = sessionStorage.getItem('empCode');
      const params = selectedDates.join(',');
      const apiUrl = `https://attendance.mpcz.in:8888/E-Attendance/api/leave/getLeavePdfV2?empCode=${userEmpCode}&dates=${params}`;

      const response = await axios.get(apiUrl, { responseType: 'blob' });

      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/pdf')) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' }),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${userEmpCode}_leave.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const text = await response.data.text();
        const json = JSON.parse(text);
        console.error('Error:', json);
        alert('Error: ' + (json.message || 'Failed to download PDF'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while downloading PDF!');
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="text-center text-primary p-3">
          <Typography
            variant="h4"
            sx={{
              color: '#0a1f83',
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Apply Leave's and Attendance Corrections
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Leave Name</StyledTableCell>
                      <StyledTableCell> Balance Leave</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {balanceLeave && balanceLeave.length > 0 ? (
                      balanceLeave.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>
                            {item.leaveTypeName}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.balanceLeaves}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={2}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>

            <Col md={8}>
              <Card>
                <Card.Header className="text-center p-1">
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#0a1f83',
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Attendance View
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <Row md={3} className="g-3">
                    <Col>
                      <Card>
                        <Card.Header>
                          Month{' '}
                          <span className="text-danger text-bold text-large">
                            *
                          </span>
                        </Card.Header>
                        <Card.Body>
                          <Form.Select
                            ref={monthRef}
                            onChange={(e) => setMonth(e.target.value)}
                            value={month}
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
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col>
                      <Card>
                        <Card.Header>
                          Year{' '}
                          <span className="text-danger text-bold text-large">
                            *
                          </span>
                        </Card.Header>
                        <Card.Body>
                          <Form.Select
                            ref={yearRef}
                            onChange={(e) => setYear(e.target.value)}
                            value={year}
                          >
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                          </Form.Select>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col>
                      <Card>
                        <Card.Header>Click here</Card.Header>
                        <Card.Body>
                          <Button
                            variant="contained"
                            className="blue-button w-100"
                            onClick={empAttendanceView}
                          >
                            View Attendance
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-4">
                <Card.Header className="text-center">
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#0a1f83',
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Apply for Leave or Corrections
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <Row md={3}>
                    <Col>
                      <Card>
                        <Card.Header>
                          Type of Preference{' '}
                          <span className="text-danger">*</span>
                        </Card.Header>
                        <Card.Body>
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
                          &nbsp;{' '}
                          {preferenceError && (
                            <Typography
                              variant="caption"
                              className="text-danger"
                            >
                              {preferenceError}
                            </Typography>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col>
                      <Card>
                        <Card.Header>
                          Correction Type <span className="text-danger">*</span>
                        </Card.Header>
                        <Card.Body>
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
                            <Typography
                              variant="caption"
                              className="text-danger"
                            >
                              {correctionError}
                            </Typography>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col>
                      <Card>
                        <Card.Header>
                          Enter Remark <span className="text-danger">*</span>
                        </Card.Header>
                        <Card.Body>
                          <Form.Control
                            ref={remarkRef}
                            type="text"
                            placeholder="Enter Remark"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                          />
                          {remarkError && (
                            <Typography
                              variant="caption"
                              className="text-danger"
                            >
                              {remarkError}
                            </Typography>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-center">
                  {showCheckbox && (
                    <div className="">
                      <input
                        class="form-check-input"
                        checked={isHql}
                        onChange={handleCheckboxChange}
                        type="checkbox"
                      />
                      &nbsp;
                      <label class="form-check-label" for="hqlValue">
                        On HQL (Head-Quarter Leave) ?
                      </label>
                    </div>
                  )}
                  <Button
                    variant="contained"
                    className="blue-button mt-2"
                    onClick={handleSubmit}
                  >
                    Apply
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <hr />
      <div className="d-flex align-items-center gap-2">
        <b className="text-danger">
          *please select the checkbox to enable button and click button to
          download the leave pdf.
        </b>

        <Button
          variant="contained"
          className={
            selectedDates.length === 0
              ? 'ms-auto button-disabled '
              : 'ms-auto green-button'
          }
          disabled={selectedDates.length === 0}
          onClick={leavePdfDownload}
        >
          Download Leave (PDF)
        </Button>
      </div>
      <hr />
      <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
        <Table ref={tableRef} tabIndex={-1}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Check </StyledTableCell>
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
            {dataInTbale && dataInTbale.length > 0 ? (
              dataInTbale.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>

                  <StyledTableCell>
                    <input
                      type="checkbox"
                      value={item.punchDate}
                      className="getCheckValues"
                      disabled={
                        item.status === 'Holiday' ||
                        item.status === 'Present' ||
                        item.correctionStatus === 'Approved' ||
                        item.correctionStatus === 'Pending' ||
                        item.leaveStatus === 'Rejected'
                      }
                      onChange={handleCheckBoxForPdf}
                    />
                  </StyledTableCell>
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
                  <StyledTableCell>{item.correctionStatus}</StyledTableCell>
                  <StyledTableCell>{item.leaveStatus}</StyledTableCell>
                  <StyledTableCell>{item.leaveType}</StyledTableCell>
                  <StyledTableCell>{item.inactiveSource}</StyledTableCell>
                  <StyledTableCell>{item.inactiveRemark}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={14}>Data Not Found</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ApplyAttendanceCorrection;
