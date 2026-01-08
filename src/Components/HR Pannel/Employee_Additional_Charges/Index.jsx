import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import '../../../Constants/Style/styles.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Row, Col, Card, Form } from 'react-bootstrap';

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
  addAdditionalCharges,
  deleteAdditionalCharges,
  getAdditionalCharges,
  getCircle,
  getDC,
  getDepartment,
  getDesignation,
  getDivision,
  getRegion,
  getSubDivision,
  getSubstation,
} from '../../../Services/Auth';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';

function AdditionalChargesEmployee() {
  const location = useLocation();
  const { empCode, fullName } = location.state || {};
  const tableRef = useRef(null);

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [additionalRecords, setAdditionalRecords] = useState([]);

  useEffect(() => {
    const fetchPlaceOfPosting = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getAdditionalCharges(empCode);
        console.log(response);
        if (
          response?.data.code === '200' &&
          response?.data.message === 'Success'
        ) {
          setOpenBackdrop(false);
          setAdditionalRecords(response?.data.list);
        } else {
          alert(response?.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.error('Error fetching place of posting:', error);
        setOpenBackdrop(false);
      }
    };

    fetchPlaceOfPosting();
  }, [empCode]);

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [dcs, setDCs] = useState([]);
  const [subStations, setSubStations] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubDivision, setSelectedSubDivision] = useState('');
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedSubstation, setSelectedSubstation] = useState('');

  const [errors, setErrors] = useState({});

  const regionRef = useRef(null);
  const designationRef = useRef(null);
  const departmentRef = useRef(null);

  //  Load Regions on Mount
  useEffect(() => {
    (async () => {
      try {
        const response = await getRegion();
        setRegions(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  //  Load Circles on Region change
  useEffect(() => {
    if (!selectedRegion) return;
    (async () => {
      try {
        const response = await getCircle(selectedRegion);
        setCircles(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    })();
  }, [selectedRegion]);

  //  Load Divisions on Circle change
  useEffect(() => {
    if (!selectedCircle) return;
    (async () => {
      try {
        const response = await getDivision(selectedCircle);
        setDivisions(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    })();
  }, [selectedCircle]);

  //  Load Sub Divisions on Division change
  useEffect(() => {
    if (!selectedDivision) return;
    (async () => {
      try {
        const response = await getSubDivision(selectedDivision);
        setSubDivisions(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching sub divisions:', error);
      }
    })();
  }, [selectedDivision]);

  //  Load DCs on Sub Division change
  useEffect(() => {
    if (!selectedSubDivision) return;
    (async () => {
      try {
        const response = await getDC(selectedSubDivision);
        setDCs(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching DCs:', error);
      }
    })();
  }, [selectedSubDivision]);

  //  Load Substations on DC change
  useEffect(() => {
    if (!selectedDC) return;
    (async () => {
      try {
        const response = await getSubstation(selectedDC);
        setSubStations(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching substations:', error);
      }
    })();
  }, [selectedDC]);

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Fetch Designations
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await getDesignation();
        setDesignations(res?.data?.code === '200' ? res.data.list : []);
      } catch (error) {
        console.error('Error fetching designations:', error);
        setDesignations([]);
      } finally {
      }
    };
    fetchDesignations();
  }, []);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartment();
        setDepartments(res?.data?.code === '200' ? res.data.list : []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      } finally {
      }
    };
    fetchDepartments();
  }, []);

  //  Handle submit
  const updateAdditionalCharge = async () => {
    let newErrors = {};
    if (!selectedRegion) newErrors.region = 'Region is required';
    if (!selectedDesignation) newErrors.designation = 'Designation is required';
    if (!selectedDepartment) newErrors.department = 'Department is required';

    setErrors(newErrors);

    // Focus first invalid field
    if (newErrors.region && regionRef.current) regionRef.current.focus();
    else if (newErrors.designation && designationRef.current)
      designationRef.current.focus();
    else if (newErrors.department && departmentRef.current)
      departmentRef.current.focus();

    // Stop if errors exist
    if (Object.keys(newErrors).length > 0) return;
    setOpenBackdrop(true);

    //  Collect form data
    const payload = {
      empCode: empCode,
      region: selectedRegion,
      circle: selectedCircle,
      division: selectedDivision,
      subDivision: selectedSubDivision,
      dc: selectedDC,
      subStation: selectedSubstation,
      department: selectedDepartment,
      designation: selectedDesignation,
      createdBy: sessionStorage.getItem('empCode'),
    };

    try {
      const response = await addAdditionalCharges(payload);
      if (response.data.code === '200') {
        setOpenBackdrop(false);
        alert('Successfully Updated !!');
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const deleteRecords = async (code, id) => {
    try {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this record?',
      );
      if (!confirmDelete) {
        return; // Stop if user cancels
      }

      const payload = {
        empCode: code,
        id: id,
        updatedBy: sessionStorage.getItem('empCode'),
      };

      const response = await deleteAdditionalCharges(payload);

      if (response.data.code === '200') {
        alert('Successfully Deleted!');
        window.location.reload();
      } else {
        alert(response.data.message || 'Failed to delete record.');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('An error occurred while deleting the record.');
    }
  };

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
            Additional Charges
          </Typography>
        </Card.Header>

        <Card.Body>
          <Card
            // className="shadow-lg rounded"
            style={{
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            <Card.Header className="text-center p-3">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  //color: "#0a1f83",
                }}
                color="primary"
              >
                {fullName} ({empCode})
              </Typography>
            </Card.Header>

            <Card.Body>
              <TableContainer component={Paper}>
                <Table ref={tableRef}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Employee Name</StyledTableCell>
                      <StyledTableCell>Emp Code</StyledTableCell>
                      <StyledTableCell>Region</StyledTableCell>
                      <StyledTableCell>Circle</StyledTableCell>
                      <StyledTableCell>Division</StyledTableCell>
                      <StyledTableCell>SubDivision</StyledTableCell>
                      <StyledTableCell>Distribution Center</StyledTableCell>
                      <StyledTableCell>Substation</StyledTableCell>
                      <StyledTableCell>Designation</StyledTableCell>
                      <StyledTableCell>Department</StyledTableCell>
                      <StyledTableCell>Delete</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {additionalRecords && additionalRecords.length > 0 ? (
                      additionalRecords.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.employeeName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.empCode || '-'}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.regionName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.circleName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.divisionName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.subDivisionName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.dcName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.subStation || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.designation || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.departmentName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title="Delete Record" placement="top">
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() =>
                                  deleteRecords(item.empCode, item.id)
                                }
                              >
                                <DeleteIcon color="error" />
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
            // className="shadow-lg rounded"
            style={{
              marginTop: '20px',
            }}
          >
            <Card.Header className="text-center p-3">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  //   color: "#0a1f83",
                }}
                color="primary"
              >
                Assign Additional Charges
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row xs={1} sm={2} md={4} className="mt-2">
                {/* Region */}
                <Col>
                  <Card>
                    <Card.Header>Region</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={regionRef}
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                      >
                        <option disabled value="" selected>
                          -- select Region --
                        </option>
                        {regions.map((item) => (
                          <option key={item.regionId} value={item.regionId}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.region && (
                        <Typography variant="caption" color="error">
                          {' '}
                          *{errors.region}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Circle */}
                <Col>
                  <Card>
                    <Card.Header>Circle</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedCircle}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCircle(value);
                          setSelectedDivision('');
                          setDivisions([]);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                          setSelectedSubstation('');
                          setSubStations([]);
                        }}
                      >
                        <option disabled value="" selected>
                          -- select Circle --
                        </option>
                        {circles.map((item) => (
                          <option key={item.circleId} value={item.circleId}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {/* {errors.circle && (
                        <div className="text-danger">{errors.circle}</div>
                      )} */}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Division */}
                <Col>
                  <Card>
                    <Card.Header>Division</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDivision}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDivision(value);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                          setSelectedSubstation('');
                          setSubStations([]);
                        }}
                      >
                        <option disabled value="">
                          -- select Division --
                        </option>
                        {divisions.map((item) => (
                          <option key={item.divisionId} value={item.divisionId}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {/* {errors.division && (
                        <div className="text-danger">{errors.division}</div>
                      )} */}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Sub Division */}
                <Col>
                  <Card>
                    <Card.Header>Sub Division</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubDivision}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedSubDivision(value);
                          setSelectedDC('');
                          setDCs([]);
                          // setSelectedSubstation("");
                          // setSubStations([]);
                        }}
                      >
                        <option disabled value="">
                          -- select Sub Division --
                        </option>
                        {subDivisions.map((item) => (
                          <option
                            key={item.subdivisionId}
                            value={item.subdivisionId}
                          >
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {/* {errors.subDivision && (
                        <div className="text-danger">{errors.subDivision}</div>
                      )} */}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="mt-2 g-3">
                {/* DC */}
                <Col>
                  <Card>
                    <Card.Header>Distribution Center</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDC}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDC(value);
                        }}
                      >
                        <option disabled value="">
                          -- select DC --
                        </option>
                        {dcs.map((item) => (
                          <option key={item.dcId} value={item.dcId}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {/* {<errors className="dc"></errors> && (
                        <div className="text-danger">{errors.dc}</div>
                      )} */}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Substation */}
                <Col>
                  <Card>
                    <Card.Header>Sub Station</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubstation}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedSubstation(value);
                        }}
                      >
                        <option disabled value="">
                          -- select Substation --
                        </option>
                        {subStations.map((item) => (
                          <option
                            key={item.substationId}
                            value={item.substationId}
                          >
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {/* {errors.subStation && (
                        <div className="text-danger">{errors.subStation}</div>
                      )} */}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Designation */}
                <Col>
                  <Card>
                    <Card.Header>Designation</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={designationRef}
                        value={selectedDesignation}
                        onChange={(e) => setSelectedDesignation(e.target.value)}
                      >
                        <option disabled value="">
                          -- select Designation --
                        </option>
                        {designations.map((item) => (
                          <option
                            key={item.designationId}
                            value={item.designationId}
                          >
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.designation && (
                        <Typography variant="caption" color="error">
                          {' '}
                          *{errors.designation}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Department */}
                <Col>
                  <Card>
                    <Card.Header>Department</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={departmentRef}
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option disabled value="">
                          -- select Department --
                        </option>
                        {departments.map((item) => (
                          <option
                            key={item.departmentId}
                            value={item.departmentId}
                          >
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.department && (
                        <Typography variant="caption" color="error">
                          {' '}
                          *{errors.department}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            variant="contained"
            className="cancel-button"
            component={Link}
            to="/employeeInformation"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            variant="contained"
            onClick={updateAdditionalCharge}
            className="green-button"
          >
            Submit
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
    </>
  );
}

export default AdditionalChargesEmployee;
