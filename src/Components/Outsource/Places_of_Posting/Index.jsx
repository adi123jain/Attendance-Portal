import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import '../../../Constants/Style/styles.css';
import Form from 'react-bootstrap/Form';

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
  getDepartment,
  getDesignation,
  getEmployeePlaceOfPosting,
  getOutsourcePlaceOfPosting,
  submitOutsourcePlaceOfPosting,
  submitPlaceOfPosting,
} from '../../../Services/Auth';
import SearchUtils from '../../../Constants/Search_Utils/Index';
import SearchForPostings from './Search';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

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
function OutsourcePlaceOfPosting() {
  const location = useLocation();
  const { empCode, fullName } = location.state || {};
  const tableRef = useRef(null);
  const regionRef = useRef(null);
  const [feederList, setFeederList] = useState([]);
  const [dataInTable, setDataInTable] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [searchValues, setSearchValues] = useState({
    region: '',
    circle: '',
    division: '',
    subDivision: '',
    dc: '',
    subStation: '',
    designation: '',
    department: '',
    fromDate: '',
    toDate: '',
    feeder: '',
    focType: '',
    feederName: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPlaceOfPosting = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getOutsourcePlaceOfPosting(empCode);
        console.log(response);
        if (
          response?.data.code == '200' &&
          response?.data.message == 'Success'
        ) {
          setOpenBackdrop(false);
          setDataInTable(response?.data.list);
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

  //  Get designation
  const [designations, setDesignations] = useState([]);

  // Fetch designation data
  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const response = await getDesignation();
        if (
          response?.data.code == '200' &&
          response?.data.message == 'Success'
        ) {
          setDesignations(response?.data.list || []);
        }
      } catch (error) {
        console.error('Error fetching designations', error);
      }
    };

    fetchDesignation();
  }, []);

  // Get Department
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartment();
        if (
          response?.data.code == '200' &&
          response?.data.message == 'Success'
        ) {
          setDepartment(response?.data.list || []);
        }
      } catch (error) {
        console.log('Error', error);
      }
    };

    fetchDepartment();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setSearchValues((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For feeder, also get the text
    if (name === 'feeder') {
      const feederName = e.target.selectedOptions[0].text;

      setSearchValues((prev) => ({
        ...prev,
        [name]: value,
        feederName,
      }));
    } else {
      setSearchValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    // region validation (keep as you already have)
    if (!searchValues.region) {
      newErrors.region = ' *region is required.';
    }

    if (!searchValues.focType) {
      newErrors.focType = ' *Foc Type is required.';
    }
    // designation validation
    if (!searchValues.designation) {
      newErrors.designation = ' *designation is required.';
    }
    // department validation
    if (!searchValues.department) {
      newErrors.department = ' *department is required.';
    }
    // date validations
    if (!searchValues.fromDate) {
      newErrors.fromDate = ' *From Date is required.';
    }

    if (!searchValues.toDate) {
      newErrors.toDate = ' *To Date is required.';
    } else if (
      searchValues.fromDate &&
      searchValues.toDate < searchValues.fromDate
    ) {
      newErrors.toDate = ' *To Date cannot be earlier than From Date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Place of Posting
  const handleSubmit = async () => {
    if (!validate()) {
      if (!searchValues.region && regionRef.current) {
        regionRef.current.focus();
      }
      return;
    }
    setOpenBackdrop(true);
    const payload = {
      empCode: empCode,
      region: searchValues.region,
      circle: searchValues.circle,
      division: searchValues.division,
      subDivision: searchValues.subDivision,
      dc: searchValues.dc,
      subStation: searchValues.subStation,
      department: searchValues.department,
      designation: searchValues.designation,
      fromDate: searchValues.fromDate,
      toDate: searchValues.toDate,
      feederName: searchValues.feederName,
      feeder: searchValues.feeder,
      focType: searchValues.focType,
      createdBy: String(sessionStorage.getItem('empCode')),
    };
    try {
      const response = await submitOutsourcePlaceOfPosting(payload);
      if (
        response?.data.code === '200' &&
        response?.data.message === 'Success'
      ) {
        alert('Employee Posting Successfully !!');
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
      setOpenBackdrop(false);
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card
        className="shadow-lg rounded"
        style={{
          //   textAlign: "center",
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
            View and Update Employee Place of Postings (Outsource)
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
                  color: '#0a1f83',
                }}
                // color="primary"
              >
                {fullName} - ({empCode})
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
                      <StyledTableCell>Region</StyledTableCell>
                      <StyledTableCell>Circle</StyledTableCell>
                      <StyledTableCell>Division</StyledTableCell>
                      <StyledTableCell>SubDivision</StyledTableCell>
                      <StyledTableCell>DC</StyledTableCell>
                      <StyledTableCell>Substation</StyledTableCell>
                      <StyledTableCell>Feeder</StyledTableCell>
                      <StyledTableCell>FOC Type</StyledTableCell>
                      <StyledTableCell>Designation</StyledTableCell>
                      <StyledTableCell>Department</StyledTableCell>
                      <StyledTableCell>From Date</StyledTableCell>
                      <StyledTableCell>To Date</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {dataInTable && dataInTable.length > 0 ? (
                      dataInTable.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.employeeName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>{item.empCode}</StyledTableCell>
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
                            {item.feederName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.focType || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.designation || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.departmentName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.fromDate || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.toDate || '-'}
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
                  color: '#0a1f83',
                }}
              >
                Insert Employee's Place of Posting (Outsource)
              </Typography>
            </Card.Header>

            <Card.Body>
              <SearchForPostings
                values={searchValues}
                setValues={setSearchValues}
                errors={errors}
                refs={{
                  region: regionRef,
                }}
                feederListBySubstation={(list) => setFeederList(list)}
              />

              <div className="row row-cols-1 row-cols-md-3 p-3">
                <div className="col">
                  <Card>
                    <Card.Header>Feeder</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="feeder"
                        value={searchValues.feeder}
                        onChange={handleInputChange}
                        isInvalid={!!errors.feeder}
                      >
                        <option value="" disabled>
                          -- select Feeder --
                        </option>

                        {feederList.length === 0 ? (
                          <option disabled value="">
                            No data found
                          </option>
                        ) : (
                          feederList.map((item, index) => (
                            <option
                              key={item.feederCode || index}
                              value={item.feederCode}
                            >
                              {item.feederName}
                            </option>
                          ))
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.feeder}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col">
                  <Card>
                    <Card.Header> FOC Type</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="focType"
                        value={searchValues.focType}
                        onChange={handleInputChange}
                        isInvalid={!!errors.focType}
                      >
                        <option value="" disabled>
                          -- Select FOC --
                        </option>
                        <option value="HT FOC">HT FOC</option>
                        <option value="LT FOC">LT FOC</option>
                        <option value="TRT Team">TRT Team</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.focType}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </div>

                {/* Designation */}
                <div className="col">
                  <Card>
                    <Card.Header>Designation</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="designation"
                        value={searchValues.designation}
                        onChange={handleInputChange}
                        isInvalid={!!errors.designation}
                      >
                        <option value="" disabled>
                          -- Select Designation --
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
                      <Form.Control.Feedback type="invalid">
                        {errors.designation}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <div className="row row-cols-1 row-cols-md-3 p-3">
                {/* Department */}
                <div className="col">
                  <Card>
                    <Card.Header>Department</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="department"
                        value={searchValues.department}
                        onChange={handleInputChange}
                        isInvalid={!!errors.department}
                      >
                        <option value="" disabled>
                          -- Select Department --
                        </option>
                        {department.map((item) => (
                          <option
                            key={item.departmentId}
                            value={item.departmentId}
                          >
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.department}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </div>

                {/* From Date */}
                <div className="col">
                  <Card>
                    <Card.Header>From Date</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        name="fromDate"
                        value={searchValues.fromDate}
                        onChange={handleInputChange}
                        isInvalid={!!errors.fromDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fromDate}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </div>

                {/* To Date */}
                <div className="col">
                  <Card>
                    <Card.Header>To Date</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        name="toDate"
                        value={searchValues.toDate}
                        onChange={handleInputChange}
                        isInvalid={!!errors.toDate}
                        min={searchValues.fromDate || ''}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.toDate}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* <div className="text-center mt-4 mb-3">
                <Button
                  onClick={handleSubmit}
                  variant="outlined"
                  className="blue-button"
                >
                  Submit
                </Button>
              </div> */}
            </Card.Body>
            <Card.Footer className="text-center mt-4 mb-3">
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

export default OutsourcePlaceOfPosting;
