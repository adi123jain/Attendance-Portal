import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
} from '@mui/material';
import {
  getPtrFailure,
  getSubstation,
  submitPtrFailure,
} from '../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function PowerTransformerReport() {
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [ptrRecords, setPtrRecords] = useState([]);
  const sessionEmp = sessionStorage.getItem('empCode');
  const sessionDcId = sessionStorage.getItem('dcId');

  useEffect(() => {
    const fetchRecords = async () => {
      setOpenBackdrop(true);
      const response = await getPtrFailure(sessionEmp);
      if (response.data.code === '200') {
        setPtrRecords(response.data.list);
        setOpenBackdrop(false);
      } else {
        setOpenBackdrop(false);
        alert(response.data.message);
      }
    };
    fetchRecords();
  }, []);

  const [substation, setSubstation] = useState([]);

  useEffect(() => {
    const fetchsubstation = async () => {
      const response = await getSubstation(sessionDcId);
      // console.log(response);
      if (response.data.code === '200') {
        setSubstation(response.data.list);
      } else {
        alert(response.data.message);
      }
    };
    fetchsubstation();
  }, []);

  const [selectSubstation, setSelectSubstation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);
  const [remark, setRemark] = useState('');
  const [errors, setErrors] = useState({});

  // refs for focusing
  const substationRef = useRef(null);
  const capacityRef = useRef(null);
  const yearRef = useRef(null);
  const fileRef = useRef(null);
  const remarkRef = useRef(null);

  const validateForm = () => {
    let newErrors = {};

    if (!selectSubstation) newErrors.substation = 'Substation is required';
    if (!capacity) newErrors.capacity = 'Capacity is required';
    if (!year) newErrors.year = 'Year is required';
    if (!file) newErrors.file = 'File is required';
    if (!remark.trim()) newErrors.remark = 'Remark is required';

    setErrors(newErrors);

    // focus on the first invalid field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.substation) substationRef.current.focus();
      else if (newErrors.capacity) capacityRef.current.focus();
      else if (newErrors.year) yearRef.current.focus();
      else if (newErrors.file) fileRef.current.focus();
      else if (newErrors.remark) remarkRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setOpenBackdrop(true);
    const formData = new FormData();
    formData.append('substationId', selectSubstation);
    formData.append('capacityOfPtr', capacity);
    formData.append('dateOfFailure', year);
    formData.append('document', file);
    formData.append('remark', remark);
    formData.append('jeEmpCode', sessionEmp);
    formData.append('dcId', sessionDcId);

    try {
      const response = await submitPtrFailure(formData);
      //console.log(" Success:", response);
      if (response.data.code === '200') {
        alert('PTR Submit Successfully!!');
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.error(' Error:', err);
      setOpenBackdrop(false);
    }
  };

  function downloadPtrDoc(path) {
    if (!path) {
      alert('Data Not Found');
      return;
    }
    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/OnM/downPtrDoc/${path}`;
    window.open(url, '_blank');
  }

  return (
    <>
      <Card
        className="shadow-lg rounded"
        style={{
          marginTop: '20px',
        }}
      >
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            Power Transformer Report Failure
          </Typography>
        </Card.Header>

        <Card.Body>
          <Card
            style={{
              textAlign: 'center',
            }}
          >
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#0a1f83',
                }}
                // color="primary"
              >
                Records
              </Typography>
            </Card.Header>

            <Card.Body>
              <TableContainer component={Paper}>
                <Table ref={tableRef}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Employee Name</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>DC Name</StyledTableCell>
                      <StyledTableCell>Substation Name</StyledTableCell>
                      <StyledTableCell>Capacity of Failure</StyledTableCell>
                      <StyledTableCell>Date of Failure</StyledTableCell>
                      <StyledTableCell>Remark</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {ptrRecords && ptrRecords.length > 0 ? (
                      ptrRecords.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.jeName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>{item.jeEmpCode}</StyledTableCell>
                          <StyledTableCell>
                            {item.dcName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.substationName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.capacityOfPtr || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.dateOfFailure || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.remark || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title="Download" arrow placement="top">
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() => downloadPtrDoc(item.docPath)}
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
                        <StyledTableCell colSpan={13}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>

          <Card
            style={{
              marginTop: '20px',
            }}
          >
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#0a1f83',
                }}
              >
                Submit Power Transformer Report
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row className="g-3 mt-1 mb-1">
                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header> Substation</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={substationRef}
                        value={selectSubstation}
                        onChange={(e) => setSelectSubstation(e.target.value)}
                        isInvalid={!!errors.substation}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        {substation.map((item, index) => (
                          <option value={item.substationId} key={index}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.substation}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header>Capacity of PTR</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={capacityRef}
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        isInvalid={!!errors.capacity}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="3.15 MVA">3.15 MVA</option>
                        <option value="5 MVA">5 MVA</option>
                        <option value="8 MVA">8 MVA</option>
                        <option value="10 MVA">10 MVA</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.capacity}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={3}>
                  <Card>
                    <Card.Header>Date</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        ref={yearRef}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        isInvalid={!!errors.year}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.year}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={3}>
                  <Card>
                    <Card.Header>Upload File</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="file"
                        ref={fileRef}
                        onChange={(e) => setFile(e.target.files[0])}
                        isInvalid={!!errors.file}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.file}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Card className="h-100">
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        ref={remarkRef}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Enter Remark"
                        isInvalid={!!errors.remark}
                        className="w-100"
                        as="textarea"
                        rows={3}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.remark}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="outlined"
                className="cancel-button"
                component={Link}
                to="/"
              >
                Cancel
              </Button>
              &nbsp;
              <Button
                onClick={handleSubmit}
                variant="outlined"
                className="blue-button"
              >
                Submit
              </Button>
            </Card.Footer>
          </Card>
        </Card.Body>
      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default PowerTransformerReport;
