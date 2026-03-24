import { useRef, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import {
  getAfterEmpSubmitted,
  getCircle,
  getOfficerByDesignation,
  getRegion,
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
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from '@mui/material';

import { Modal, Fade, Box } from '@mui/material';
import { Col, Form, Row } from 'react-bootstrap';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';
import { Link } from 'react-router-dom';
function ProNews() {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [selectedOfficer, setSelectedOfficer] = useState({
    empCode: '',
    fullName: '',
  });

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getRegion();
        setRegions(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchRegions();
  }, []);

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCircle('');
    try {
      const circleResponse = await getCircle(regionId);
      setCircles(circleResponse?.data?.list || []);
    } catch (error) {
      console.error('Error fetching circles:', error);
      setCircles([]);
    }
  };

  const [designation, setDesignation] = useState('');
  const [officerList, setOfficerList] = useState([]);
  const [officerName, setOfficerName] = useState('');
  const [loadingOfficer, setLoadingOfficer] = useState(false);

  const isDGM = designation === 'DGM';

  const fetchOfficers = async (designation, circleId = '') => {
    try {
      setLoadingOfficer(true);

      const res = await getOfficerByDesignation(designation, circleId);

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

  const handleDesignationChange = (e) => {
    const value = e.target.value;

    setDesignation(value);
    setOfficerName('');
    setOfficerList([]);
    setSelectedRegion('');
    setSelectedCircle('');

    if (value && value !== 'DGM') {
      fetchOfficers(value);
    }
  };

  const handleCircleChange = (e) => {
    const circleId = e.target.value;

    setSelectedCircle(circleId);
    setOfficerName('');
    setOfficerList([]);

    if (designation === 'DGM' && circleId) {
      fetchOfficers('DGM', circleId);
    }
  };

  // dropdown & inputs
  const [type, setType] = useState('');
  const [newsDate, setNewsDate] = useState('');

  // file & remark
  const [documentFile, setDocumentFile] = useState(null);
  const [remark, setRemark] = useState('');

  const [formErrors, setFormErrors] = useState({
    type: '',
    designation: '',
    region: '',
    circle: '',
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

    if (designation === 'DGM') {
      if (!selectedRegion) {
        errors.region = '*Region is required';
        valid = false;
      }

      if (!selectedCircle) {
        errors.circle = '*Circle is required';
        valid = false;
      }
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
        alert('Successfully Submitted !!');
        window.location.reload();
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
    text && text.length > len
      ? text.slice(0, len) + '...'
      : text || 'Not Found';

  const downloadDocument = (path) => {
    const downloadPath = `https://attendance.mpcz.in:8888/E-Attendance/api/pro/downloadProDoc/${path}`;
    window.open(downloadPath, '_blank');
  };

  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [remarkContent, setRemarkContent] = useState('');
  const [remarkTitle, setRemarkTitle] = useState('');
  const hoverTimer = useRef(null);

  const handleOpenRemark = (title, content) => {
    clearTimeout(hoverTimer.current);

    hoverTimer.current = setTimeout(() => {
      setRemarkTitle(title);
      setRemarkContent(content || 'Not Found');
      setOpenRemarkModal(true);
    }, 300);
  };

  const handleCloseRemark = () => {
    clearTimeout(hoverTimer.current);
    setOpenRemarkModal(false);
  };

  const [filterStatus, setFilterStatus] = useState('all');
  const filteredList = employeeList.filter((row) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'true') return row.isSubmitted === true;
    if (filterStatus === 'false') return row.isSubmitted === false;
    return true;
  });

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
            News Assign to Employee
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="g-1 mt-1 mb-4">
            <Col xs={12} md={3}>
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
            <Col xs={12} md={3}>
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

            <Col xs={12} md={3}>
              <Card>
                <Card.Header>Region</Card.Header>
                <Card.Body>
                  <Form.Select
                    aria-label="Select Region"
                    value={selectedRegion}
                    disabled={!isDGM}
                    isInvalid={isDGM && !!formErrors.region}
                    onChange={handleRegionChange}
                  >
                    <option disabled value="">
                      -- select Region --
                    </option>
                    {regions.map(({ regionId, name }) => (
                      <option key={regionId} value={regionId}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={3}>
              <Card>
                <Card.Header>Circle</Card.Header>
                <Card.Body>
                  <Form.Select
                    aria-label="Select Circle"
                    value={selectedCircle}
                    disabled={!isDGM || !selectedRegion}
                    isInvalid={isDGM && !!formErrors.circle}
                    onChange={handleCircleChange}
                  >
                    <option value="" disabled>
                      -- select Circle --
                    </option>
                    {circles.map(({ circleId, name }) => (
                      <option key={circleId} value={circleId}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-1 mt-1 mb-2">
            <Col xs={12} md={3}>
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

            <Col xs={12} md={3}>
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

            <Col xs={12} md={3}>
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
            <Col xs={12} md={3}>
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
          <Button className="blue-button" onClick={handleSubmit}>
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
            Assigned Records
          </Typography>

          <div style={{ marginBottom: '15px' }}>
            <FormControl>
              <RadioGroup
                row
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Submitted"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Pendings"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </Card.Header>

        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Employee Location</StyledTableCell>
                  <StyledTableCell>Assigned Date</StyledTableCell>
                  <StyledTableCell>MD Remark</StyledTableCell>
                  <StyledTableCell>Pro Remark</StyledTableCell>
                  <StyledTableCell>Document</StyledTableCell>
                  <StyledTableCell>User Submitted Date</StyledTableCell>
                  <StyledTableCell>User Remark</StyledTableCell>
                  <StyledTableCell>User Document</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              {/* <TableBody>
                {employeeList.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>
                      {row.empCode || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.empName || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.employeeDetail.postingLocation || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.dateOfNews || 'Not Found'}
                    </StyledTableCell>

                    <StyledTableCell>
                      <div
                        onClick={() =>
                          handleOpenRemark('MD Remark', row.mdComment)
                        }
                        style={{
                          maxWidth: 220,
                          cursor: 'default',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText(row.mdComment)}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div
                        onClick={() =>
                          handleOpenRemark('Assigned Remark', row.proRemark)
                        }
                        style={{
                          maxWidth: 220,
                          cursor: 'default',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText(row.proRemark)}
                      </div>
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

                    <StyledTableCell>
                      {row.empUpdatedNo || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div
                        onClick={() =>
                          handleOpenRemark('Employee Remark', row.empRemark)
                        }
                        style={{
                          maxWidth: 220,
                          cursor: 'default',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText(row.empRemark)}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.empDoc ? (
                        <Tooltip
                          title="Download Emp Document"
                          arrow
                          placement="top"
                        >
                          <Button
                            onClick={() => downloadDocument(row.empDoc)}
                            variant="contained"
                            color="dark"
                          >
                            <CloudDownloadIcon color="success" />
                          </Button>
                        </Tooltip>
                      ) : (
                        'Not Found'
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody> */}

              <TableBody>
                {filteredList.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>
                      {row.empCode || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.empName || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.employeeDetail.postingLocation || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.dateOfNews || 'Not Found'}
                    </StyledTableCell>

                    <StyledTableCell>
                      <div
                        onClick={() =>
                          handleOpenRemark('MD Remark', row.mdComment)
                        }
                        style={{
                          maxWidth: 220,
                          cursor: 'default',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText(row.mdComment)}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      <div
                        onClick={() =>
                          handleOpenRemark('Assigned Remark', row.proRemark)
                        }
                        style={{
                          maxWidth: 220,
                          cursor: 'default',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText(row.proRemark)}
                      </div>
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

                    <StyledTableCell>
                      {row.empUpdatedNo || 'Not Found'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div
                        onClick={() =>
                          handleOpenRemark('Employee Remark', row.empRemark)
                        }
                        style={{
                          maxWidth: 220,
                          cursor: 'default',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText(row.empRemark)}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell>
                      {row.empDoc ? (
                        <Tooltip
                          title="Download Emp Document"
                          arrow
                          placement="top"
                        >
                          <Button
                            onClick={() => downloadDocument(row.empDoc)}
                            variant="contained"
                            color="dark"
                          >
                            <CloudDownloadIcon color="success" />
                          </Button>
                        </Tooltip>
                      ) : (
                        'Not Found'
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            className="cancel-button"
            component={Link}
            to="/employeeDashboard"
          >
            Cancel
          </Button>
        </Card.Footer>
      </Card>

      {/* Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>

      <Modal
        open={openRemarkModal}
        onClose={handleCloseRemark}
        closeAfterTransition
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={openRemarkModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '65%',
              maxHeight: '70vh',
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              outline: 'none',
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#0a1f83',
                borderBottom: '1px solid #eee',
                pb: 1,
              }}
            >
              {remarkTitle}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                color: '#444',
                lineHeight: 1.6,
              }}
            >
              {remarkContent}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default ProNews;
