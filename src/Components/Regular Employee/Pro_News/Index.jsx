import { useRef, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import {
  getAfterEmpSubmitted,
  getOfficerByDesignation,
  proNewsSubmit,
} from '../../../Services/Auth';
import { PropagateLoader } from 'react-spinners';
import '../../../Constants/Style/styles.css';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  Typography,
  Button,
  Backdrop,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Tooltip,
} from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Col, Form, Row } from 'react-bootstrap';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';
function ProNews() {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // selected employee
  const [selectedOfficer, setSelectedOfficer] = useState({
    empCode: '',
    fullName: '',
  });

  const [designation, setDesignation] = useState('');
  const [officerList, setOfficerList] = useState([]);
  const [officerName, setOfficerName] = useState('');
  const [loadingOfficer, setLoadingOfficer] = useState(false);

  const handleDesignationChange = async (e) => {
    const value = e.target.value;

    setDesignation(value);
    setOfficerName('');
    setOfficerList([]);

    if (!value) return;

    try {
      setLoadingOfficer(true);

      const res = await getOfficerByDesignation(value);
      console.log(res);

      if (res?.data?.code === '200') {
        setOfficerList(res.data.list || []);
      } else {
        setOfficerList([]);
      }
    } catch (error) {
      console.error('Officer API error', error);
      setOfficerList([]);
    } finally {
      setLoadingOfficer(false);
    }
  };

  // dropdown & inputs
  const [type, setType] = useState('');
  const [newsDate, setNewsDate] = useState('');

  // file & remark
  const [documentFile, setDocumentFile] = useState(null);
  const [remark, setRemark] = useState('');

  // errors
  const [formErrors, setFormErrors] = useState({
    type: '',
    designation: '',
    officerName: '',
    date: '',
    document: '',
    remark: '',
  });

  // refs for focus
  const typeRef = useRef(null);
  const designationRef = useRef(null);
  const officerRef = useRef(null);
  const dateRef = useRef(null);
  const documentRef = useRef(null);
  const remarkRef = useRef(null);

  const validation = () => {
    let valid = true;
    const errors = {
      type: '',
      designation: '',
      officerName: '',
      date: '',
      document: '',
      remark: '',
    };

    if (!type) {
      errors.type = '*Type is required';
      valid = false;
    }

    if (!designation) {
      errors.designation = '*Designation is required';
      valid = false;
    }

    if (!officerName) {
      errors.officerName = '*Officer name is required';
      valid = false;
    }

    if (!newsDate) {
      errors.date = '*Date is required';
      valid = false;
    }

    if (!documentFile) {
      errors.document = '*Document is required';
      valid = false;
    }

    if (!remark.trim()) {
      errors.remark = '*Remark is required';
      valid = false;
    }

    setFormErrors(errors);

    // focus priority
    if (!type && typeRef.current) typeRef.current.focus();
    else if (!designation && designationRef.current)
      designationRef.current.focus();
    else if (!officerName && officerRef.current) officerRef.current.focus();
    else if (!newsDate && dateRef.current) dateRef.current.focus();
    else if (!documentFile && documentRef.current) documentRef.current.focus();
    else if (!remark.trim() && remarkRef.current) remarkRef.current.focus();

    return valid;
  };

  const handleSubmit = async () => {
    if (!validation()) return;

    const formData = new FormData();
    formData.append('type', type);
    formData.append('officerType', designation);
    formData.append('empCode', selectedOfficer.empCode);
    formData.append('empName', selectedOfficer.fullName);
    formData.append('dateOfNews', newsDate);
    formData.append('proRemark', remark);
    formData.append('proEmpCode', sessionStorage.getItem('empCode'));
    formData.append('doc', documentFile);

    try {
      setOpenBackdrop(true);
      const response = await proNewsSubmit(formData);

      if (response?.data?.code === '200') {
        alert('Submitted Successfully');
      } else {
        alert(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setOpenBackdrop(false);
    }
  };

  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setOpenBackdrop(true);

        const response = await getAfterEmpSubmitted();

        if (response?.data?.code === '200') {
          setEmployeeList(response?.data?.list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setOpenBackdrop(false);
      }
    };

    fetchEmployees();
  }, []);

  const shortText = (text, len = 35) =>
    text && text.length > len ? text.slice(0, len) + '...' : text || 'NA';

  const downloadDocument = (path) => {
    const downloadPath = `http://172.16.17.34:8084/e-Attendance/api/pro/downloadProDoc/${path}`;
    window.open(downloadPath, '_blank');
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
            Pro News
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="g-1 mt-1 mb-4">
            <Col xs={12} md={4}>
              <Card>
                <Card.Header>Type</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={typeRef}
                    value={type}
                    isInvalid={!!formErrors.type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setFormErrors({ ...formErrors, type: '' });
                    }}
                  >
                    <option value="">-- select Type --</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                    <option value="OTHER">Other</option>
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {formErrors.type}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card>
                <Card.Header>Officer's Designation</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={designationRef}
                    value={designation}
                    isInvalid={!!formErrors.designation}
                    onChange={handleDesignationChange}
                  >
                    <option value="">-- Select Designation --</option>
                    <option value="DGM">Deputy General Manager</option>
                    <option value="GM">General Manager</option>
                    <option value="CGM">Chief General Manager</option>
                    <option value="DIR">Director</option>
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {formErrors.designation}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4}>
              <Card>
                <Card.Header>Officer's Name</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={officerRef}
                    value={selectedOfficer.empCode}
                    isInvalid={!!formErrors.officerName}
                    disabled={!designation || loadingOfficer}
                    onChange={(e) => {
                      const selectedEmpCode = e.target.value;
                      const officer = officerList.find(
                        (item) =>
                          String(item.empCode) === String(selectedEmpCode),
                      );

                      if (!officer) return;

                      setSelectedOfficer({
                        empCode: officer.empCode,
                        fullName: officer.fullName,
                      });

                      setOfficerName(selectedEmpCode);

                      setFormErrors({ ...formErrors, officerName: '' });
                    }}
                  >
                    <option value="">
                      {loadingOfficer ? 'Loading...' : '-- Select Name --'}
                    </option>

                    {officerList.map((officer, i) => (
                      <option key={i} value={officer.empCode}>
                        {officer.fullName} - {officer.postingLocation}
                      </option>
                    ))}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {formErrors.officerName}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-1 mt-1 mb-2">
            <Col xs={12} md={4}>
              <Card>
                <Card.Header>Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    ref={dateRef}
                    value={newsDate}
                    isInvalid={!!formErrors.date}
                    onChange={(e) => {
                      setNewsDate(e.target.value);
                      setFormErrors({ ...formErrors, date: '' });
                    }}
                  />

                  <Form.Control.Feedback type="invalid">
                    {formErrors.date}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4}>
              <Card>
                <Card.Header>Upload Document</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="file"
                    ref={documentRef}
                    isInvalid={!!formErrors.document}
                    onChange={(e) => {
                      setDocumentFile(e.target.files[0]);
                      setFormErrors({ ...formErrors, document: '' });
                    }}
                  />

                  <Form.Control.Feedback type="invalid">
                    {formErrors.document}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card>
                <Card.Header>Remark</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    placeholder="Enter Remark"
                    ref={remarkRef}
                    value={remark}
                    isInvalid={!!formErrors.remark}
                    onChange={(e) => {
                      setRemark(e.target.value);
                      setFormErrors({ ...formErrors, remark: '' });
                    }}
                  />

                  <Form.Control.Feedback type="invalid">
                    {formErrors.remark}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button className="green-button" onClick={handleSubmit}>
            Submit
          </Button>
        </Card.Footer>
      </Card>

      <Card className="shadow-lg rounded mt-3">
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
            Records after Submitted by Employee
          </Typography>
        </Card.Header>

        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>MD Remark</StyledTableCell>
                  <StyledTableCell>Pro Remark</StyledTableCell>
                  <StyledTableCell>Document</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {employeeList.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.empCode}</StyledTableCell>
                    <StyledTableCell>{row.empName}</StyledTableCell>

                    <StyledTableCell>
                      <Tooltip
                        title={row.mdComment || ''}
                        arrow
                        placement="top"
                      >
                        <Typography variant="body1">
                          {shortText(row.mdComment)}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Tooltip
                        title={row.proRemark || ''}
                        arrow
                        placement="top"
                      >
                        <Typography variant="body1">
                          {shortText(row.proRemark)}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Tooltip title="Download" arrow placement="top">
                        <Button
                          onClick={() => downloadDocument(row.doc)}
                          variant="contained"
                          color="dark"
                        >
                          <CloudDownloadIcon color="success" />
                        </Button>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button className="cancel-button">Cancel</Button>
        </Card.Footer>
      </Card>

      {/* Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ProNews;
