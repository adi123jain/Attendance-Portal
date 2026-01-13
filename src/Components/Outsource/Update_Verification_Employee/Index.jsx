import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Tooltip from '@mui/material/Tooltip';
import { Typography, Button, Backdrop } from '@mui/material';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PropagateLoader } from 'react-spinners';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import {
  getAttendanceLocation,
  getCircle,
  getDC,
  getDepartment,
  getDivision,
  getHolidays,
  getHrManager,
  getOutDesignations,
  getOutsourceEmployee,
  getRegion,
  getRoDesignation,
  getRoNameByRoId,
  getShifts,
  getSubDivision,
  getSubstation,
  updateVerifyOutEmployee,
} from '../../../Services/Auth';

function UpdateVerifyEmployee() {
  const location = useLocation();
  const empName = location.state?.empName || '';
  const empCode = location.state?.empCode || '';

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [cityName, setCityName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [doj, setDoj] = useState('');
  const [gender, setGender] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [physicallyHandicapped, setPhysicallyHandicapped] = useState('');
  const [disablementPercent, setDisablementPercent] = useState('');
  const [status, setStatus] = useState('');
  const [employeeCategory, setEmployeeCategory] = useState('');
  const [skillType, setSkillType] = useState('');
  const [defaultShift, setDefaultShift] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [education, setEducation] = useState('');

  const [defaultDepartment, setDefaultDepartment] = useState('');
  const [defaultDesignation, setDefaultDesignation] = useState('');
  const [defaultHolidays, setDefaultHolidays] = useState('');

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubDivision, setSelectedSubDivision] = useState('');
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedSubStation, setSelectedSubStation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedRoName, setSelectedRoName] = useState('');
  const [selectedHr, setSelectedHr] = useState('');

  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [pfNumber, setPfNumber] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  // const [hrEmpCode, setHrEmpCode] = useState("");
  // const [hrAction, setHrAction] = useState("");
  const [deviceId, setDeviceId] = useState('');

  // Concate First Middle and Last name into Full Name
  useEffect(() => {
    const name = [firstName, middleName, lastName].filter(Boolean).join(' ');
    setFullName(name);
  }, [firstName, middleName, lastName]);

  // Get Employee Details By Code
  useEffect(() => {
    const fetchDetails = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getOutsourceEmployee(empCode);
        // console.log(response);
        if (
          response.data.code === '200' &&
          response.data.message === 'Success'
        ) {
          setOpenBackdrop(false);
          setFirstName(response.data.list[0].firstName || '');
          setMiddleName(response.data.list[0].middleName || '');
          setLastName(response.data.list[0].lastName || '');
          setFullName(response.data.list[0].fullName || '');
          setCityName(response.data.list[0].city || '');
          setMobileNumber(response.data.list[0].mobileNo || '');
          setAadhaarNumber(response.data.list[0].adhaarNumber || '');
          setAddress(response.data.list[0].address || '');
          setDob(response.data.list[0].dateOfBirth || '');
          setDoj(response.data.list[0].dateOfJoining || '');
          setGender(response.data.list[0].gender || '');
          setFatherName(response.data.list[0].fatherName || '');

          setMotherName(response.data.list[0].motherName || '');
          setMaritalStatus(response.data.list[0].maritalStatus || '');
          setPhysicallyHandicapped(
            response.data.list[0].physicallyHandicaped || '',
          );
          setDisablementPercent(
            response.data.list[0].percentageOfDisablement || '',
          );
          setStatus(response.data.list[0].status || '');
          setEmployeeCategory(response.data.list[0].category || '');
          setSkillType(response.data.list[0].skillType || '');
          setDefaultShift(response.data.list[0]?.defaultShift?.shiftId || '');
          setWorkExperience(response.data.list[0].noOfWorkExp || '0');
          setEducation(response.data.list[0].education || '');

          setDefaultDepartment(response.data.list[0]?.department?.id || '');
          setDefaultDesignation(
            response.data.list[0]?.designation?.designationId || '',
          );
          setDefaultHolidays(response.data.list[0]?.holidayList?.id || '');

          setSelectedRegion(response.data.list[0]?.region?.regionId || '');
          setSelectedCircle(response.data.list[0]?.circle?.circleId || '');
          setSelectedDivision(
            response.data.list[0]?.division?.divisionId || '',
          );
          setSelectedSubDivision(
            response.data.list[0]?.subDivision?.subdivisionId || '',
          );
          setSelectedDC(response.data.list[0]?.dc?.dcId || '');
          setSelectedSubStation(
            response.data.list[0]?.substation?.substationId || '',
          );

          setSelectedLocation(
            response.data.list[0]?.attendanceLocationId?.id || '',
          );

          setSelectedOfficer(
            response.data.list[0]?.reportingOfficerDesignation?.id || '',
          );

          setSelectedRoName(response.data.list[0]?.reportingOfficer?.id || '');
          setSelectedHr(response.data.list[0]?.managerHr?.id || '');

          setBankName(response.data.list[0].bankName || '');
          setBankAccount(response.data.list[0].bankAccount || '');
          setBankIfsc(response.data.list[0].bankIfsc || '');
          setPanNumber(response.data.list[0].panNo || '');
          setPfNumber(response.data.list[0].pfNumber || '');
          setContractStartDate(response.data.list[0].contractStartDate || '');
          setContractEndDate(response.data.list[0].contractEndDate || '');
          setVendorId(response.data.list[0].vendorId || '');
          setVendorName(response.data.list[0].vendorName || '');
          setDeviceId(response.data.list[0].deviceId || '');
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setOpenBackdrop(false);
      }
    };

    fetchDetails();
  }, [empCode]);

  // Get Shifts
  const [shifts, setShifts] = useState([]);
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await getShifts();
        setShifts(response.data.list || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchShifts();
  }, []);

  // get Designation
  const [designation, setDesignation] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getOutDesignations();
        //  console.log("designation", response);
        setDesignation(response.data.list || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Get Department
  const [department, setDepartment] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment();
        // console.log("Department", response);
        setDepartment(response.data.list || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Get Holidays
  const [holidays, setHolidays] = useState([]);
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await getHolidays();
        // console.log("holiday", response);
        setHolidays(response.data.list || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchHolidays();
  }, []);

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [dcs, setDCs] = useState([]);
  const [subStations, setSubStations] = useState([]);

  // Load Regions
  useEffect(() => {
    (async () => {
      try {
        const response = await getRegion();
        setRegions(response.data.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  // Fetch Circles when Region changes
  useEffect(() => {
    if (!selectedRegion) return;
    (async () => {
      try {
        const res = await getCircle(selectedRegion);
        setCircles(res.data.list || []);
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    })();
  }, [selectedRegion]);

  // Fetch Divisions when Circle changes
  useEffect(() => {
    if (!selectedCircle) return;
    (async () => {
      try {
        const res = await getDivision(selectedCircle);
        setDivisions(res.data.list || []);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    })();
  }, [selectedCircle]);

  // Fetch SubDivisions when Division changes
  useEffect(() => {
    if (!selectedDivision) return;
    (async () => {
      try {
        const res = await getSubDivision(selectedDivision);
        setSubDivisions(res.data.list || []);
      } catch (error) {
        console.error('Error fetching sub divisions:', error);
      }
    })();
  }, [selectedDivision]);

  // Fetch DCs when SubDivision changes
  useEffect(() => {
    if (!selectedSubDivision) return;
    (async () => {
      try {
        const res = await getDC(selectedSubDivision);
        setDCs(res.data.list || []);
      } catch (error) {
        console.error('Error fetching DCs:', error);
      }
    })();
  }, [selectedSubDivision]);

  // Fetch SubStations when DC changes
  useEffect(() => {
    if (!selectedDC) return;
    (async () => {
      try {
        const res = await getSubstation(selectedDC);
        setSubStations(res.data.list || []);
      } catch (error) {
        console.error('Error fetching sub stations:', error);
      }
    })();
  }, [selectedDC]);

  const [attendanceLocations, setAttendanceLocations] = useState([]);

  const fetchAttendanceLocation = async () => {
    const payload = {
      regionId: selectedRegion,
      circleId: selectedCircle || null,
      divisionId: selectedDivision || null,
      subDivisionId: selectedSubDivision || null,
      dcId: selectedDC || null,
      substationId: selectedSubStation || null,
    };
    try {
      const response = await getAttendanceLocation(payload);
      const list = response?.data?.value ?? response?.data?.list ?? [];
      setAttendanceLocations(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      setAttendanceLocations([]);
    }
  };

  useEffect(() => {
    if (selectedRegion) {
      // setSelectedLocation("");
      fetchAttendanceLocation();
    } else {
      setAttendanceLocations([]);
      // setSelectedLocation("");
    }
  }, [
    selectedRegion,
    selectedCircle,
    selectedDivision,
    selectedSubDivision,
    selectedDC,
    selectedSubStation,
  ]);

  // Get Reporting Officer Designation
  const [roDesignation, setRoDesignation] = useState([]);
  useEffect(() => {
    const fetchtRoDesignation = async () => {
      try {
        const response = await getRoDesignation();
        // console.log("roDesignation", response);
        setRoDesignation(response.data.list || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchtRoDesignation();
  }, []);

  // Ro Name on Ro Designation Change
  const [roName, setRoName] = useState([]);
  useEffect(() => {
    if (!selectedOfficer) return;
    const fetchOfficerName = async () => {
      try {
        const res = await getRoNameByRoId(selectedOfficer);
        setRoName(res.data.list || []);
      } catch (err) {
        console.error('Error fetching officer names:', err);
      }
    };

    fetchOfficerName();
  }, [selectedOfficer]);

  // HR Manager List
  const [hrManager, setHrManager] = useState([]);
  useEffect(() => {
    const fetchtHrDetails = async () => {
      try {
        const response = await getHrManager();
        // console.log("HR name", response);
        setHrManager(response.data.list || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchtHrDetails();
  }, []);

  const [errors, setErrors] = useState({});

  // update Employee details
  const handleSubmit = async () => {
    const newErrors = {};
    let firstInvalid = null;

    // Required field validations
    const requiredFields = [
      { value: firstName, name: 'First Name', id: 'firstName' },
      { value: lastName, name: 'Last Name', id: 'lastName' },
      { value: mobileNumber, name: 'Mobile Number', id: 'mobileNumber' },
      { value: aadhaarNumber, name: 'Aadhaar Number', id: 'aadhaarNumber' },
      { value: address, name: 'Address', id: 'address' },
      { value: doj, name: 'Date of Joining', id: 'doj' },
      { value: gender, name: 'Gender', id: 'gender' },
      { value: fatherName, name: 'Father Name', id: 'fatherName' },
      {
        value: physicallyHandicapped,
        name: 'Physically Handicapped',
        id: 'physicallyHandicapped',
      },
      { value: status, name: 'Status', id: 'status' },
      { value: employeeCategory, name: 'Category', id: 'employeeCategory' },
      { value: skillType, name: 'Skill Type', id: 'skillType' },
      { value: defaultShift, name: 'Default Shift', id: 'defaultShift' },
      { value: defaultDesignation, name: 'Designation', id: 'designation' },
      { value: defaultDepartment, name: 'Department', id: 'department' },
      { value: defaultHolidays, name: 'Holiday List', id: 'holidayList' },

      { value: selectedRegion, name: 'Region', id: 'selectedRegion' },
      {
        value: selectedLocation,
        name: 'Attendance Location',
        id: 'attendanceLocation',
      },
      {
        value: selectedOfficer,
        name: "Officer's Designation",
        id: 'selectedOfficer',
      },
      {
        value: selectedRoName,
        name: 'Reporting Officer',
        id: 'reportingOfficer',
      },
      { value: selectedHr, name: 'HR Manager', id: 'hrManager' },
      { value: bankName, name: 'Bank Name', id: 'bankName' },
      { value: panNumber, name: 'PAN Number', id: 'panNumber' },
      {
        value: contractStartDate,
        name: 'Contract Start Date',
        id: 'contractStartDate',
      },
      {
        value: contractEndDate,
        name: 'Contract End Date',
        id: 'contractEndDate',
      },
    ];

    // Check each required field
    requiredFields.forEach((field) => {
      if (!field.value || String(field.value).trim() === '') {
        newErrors[field.id] = `${field.name} is required`;
        if (!firstInvalid) firstInvalid = field.id;
      }
    });

    setErrors(newErrors);

    // Extra validations
    if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
      if (!firstInvalid) firstInvalid = 'mobileNumber';
    }

    if (aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Aadhaar number must be exactly 12 digits';
      if (!firstInvalid) firstInvalid = 'aadhaarNumber';
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      newErrors.panNumber = 'Enter PAN number in this format (e.g. ABCDE1234F)';
      if (!firstInvalid) firstInvalid = 'panNumber';
    }

    const nameRegex = /^[A-Za-z ]+$/;
    ['firstName', 'middleName', 'lastName', 'motherName', 'fatherName'].forEach(
      (field) => {
        const value = eval(field);
        if (value && !nameRegex.test(value)) {
          newErrors[field] = `${field.replace(
            /([A-Z])/g,
            ' $1',
          )} must contain only letters`;
          if (!firstInvalid) firstInvalid = field;
        }
      },
    );

    // Focus the first invalid field
    if (firstInvalid) {
      const element = document.getElementById(firstInvalid);
      if (element) element.focus();
      return;
    }

    setOpenBackdrop(true);

    const payload = {
      empCode: empCode || '',
      firstName: firstName || '',
      middleName: middleName || '',
      lastName: lastName || '',
      fullName: fullName || '',
      mobileNo: mobileNumber || '',
      adhaarNumber: aadhaarNumber || '',
      dateOfBirth: dob || '',
      dateOfJoining: doj || '',
      gender: gender || '',
      fatherName: fatherName || '',
      motherName: motherName || '',
      maritalStatus: maritalStatus || '',
      physicallyHandicaped: physicallyHandicapped || '',
      percentageOfDisablement: disablementPercent || '',
      status: status || '',
      category: employeeCategory || '',
      address: address || '',
      city: cityName || '',
      region: selectedRegion || '',
      circle: selectedCircle || '',
      division: selectedDivision || '',
      subDivision: selectedSubDivision || '',
      dc: selectedDC || '',
      substationId: selectedSubStation || '',
      defaultShift: defaultShift || '',
      designation: defaultDesignation || '',
      reportingOfficer: selectedRoName || '',
      bankName: bankName || '',
      bankAccount: bankAccount || '',
      bankIfsc: bankIfsc || '',
      managerHr: selectedHr || '',
      panNo: panNumber || '',
      attendanceLocationId: selectedLocation || '',
      departmentId: defaultDepartment || '',
      pfNumber: pfNumber || '',
      holidayListId: defaultHolidays || '',
      skillType: skillType || '',
      contractStartDate: contractStartDate || '',
      contractEndDate: contractEndDate || '',
      vendorId: vendorId || '',
      vendorName: vendorName || '',
      hrEmpCode: sessionStorage.getItem('empCode'),
      hrAction: 'Approved',
      deviceId: deviceId || '',
      noOfWorkExp: workExperience || '',
      education: education || '',
    };

    // Call API
    try {
      const response = await updateVerifyOutEmployee(payload);
      // console.log(response);
      if (response.data.code === '200') {
        alert('Updated Successfully !!');
        setOpenBackdrop(false);
        // window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error(error);
      setOpenBackdrop(false);
    }
  };
  return (
    <>
      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between  p-3">
          <Tooltip title="Back" arrow placement="top">
            <Button className="position-absolute start-2">
              <Link to="/outsourceEmployeeInfo">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>

          <div className="flex-grow-1 text-center text-primary">
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
                color: '#0a1f83',
              }}
            >
              Verify and Update Outsource Employee
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
                //color: "#0a1f83",
              }}
            >
              {empName} :- ({empCode})
            </Typography>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Basic Information */}
          <Card>
            <Card.Header className="text-center">
              <h4
                style={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Basic Information
              </h4>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}

              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>
                      First Name{' '}
                      <span className="text-danger text-bold text-large">
                        *
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        id="firstName"
                        placeholder="Enter First Name"
                        value={firstName}
                        // onChange={(e) => setFirstName(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z ]*$/.test(val)) setFirstName(val);
                        }}
                      />
                      {errors.firstName && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.firstName}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Middle Name </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Middle Name"
                        value={middleName}
                        // onChange={(e) => setMiddleName(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z ]*$/.test(val)) setMiddleName(val);
                        }}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Last Name{' '}
                      <span className="text-danger text-bold text-large">
                        *
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        id="lastName"
                        placeholder="Enter Last Name"
                        value={lastName}
                        // onChange={(e) => setLastName(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z ]*$/.test(val)) setLastName(val);
                        }}
                      />
                      {errors.lastName && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.lastName}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Full Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        readOnly
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 2 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>City Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter City Name"
                        value={cityName}
                        // onChange={(e) => setCityName(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z ]*$/.test(val)) setCityName(val);
                        }}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Mobile Number{' '}
                      <span className="text-danger text-bold text-large">
                        *
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        id="mobileNumber"
                        placeholder="Enter Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) setMobileNumber(val); // allow only digits
                        }}
                        // onChange={(e) => setMobileNumber(e.target.value)}
                      />
                      {errors.mobileNumber && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.mobileNumber}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Adhaar Number{' '}
                      <span className="text-danger text-bold text-large">
                        *
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        id="aadhaarNumber"
                        placeholder="Enter Aadhaar Number"
                        value={aadhaarNumber}
                        // onChange={(e) => setAadhaarNumber(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) setAadhaarNumber(val);
                        }}
                      />
                      {errors.aadhaarNumber && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.aadhaarNumber}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Address</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        id="address"
                        placeholder="Enter Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      {errors.address && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.address}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 3 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Date of Birth</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Date of Joining</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        id="doj"
                        value={doj}
                        onChange={(e) => setDoj(e.target.value)}
                      />
                      {errors.doj && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.doj}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Gender</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={gender}
                        id="gender"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="" disabled>
                          -- select Gender --
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>

                      {errors.gender && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.gender}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Father's Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        id="fatherName"
                        placeholder="Enter Father's Name"
                        value={fatherName}
                        // onChange={(e) => setFatherName(e.target.value)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z ]*$/.test(val)) setFatherName(val);
                        }}
                      />
                      {errors.fatherName && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.fatherName}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 4 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                {/* Mother's Name */}
                <Col>
                  <Card>
                    <Card.Header>Mother's Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Mother's Name"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Marital Status</Card.Header>
                    <Card.Body>
                      {/* Marital Status */}
                      <Form.Select
                        value={maritalStatus} // controlled
                        onChange={(e) => setMaritalStatus(e.target.value)}
                      >
                        <option value="" disabled>
                          -- Select Status --
                        </option>
                        <option value="Married">Married</option>
                        <option value="Unmarried">Unmarried</option>
                        <option value="Divorcee">Divorcee</option>
                        <option value="Widow">Widow</option>
                        <option value="Widower">Widower</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Physically Handicapped</Card.Header>
                    <Card.Body>
                      {/* Physically Handicapped */}
                      <Form.Select
                        value={physicallyHandicapped}
                        id="physicallyHandicapped"
                        onChange={(e) =>
                          setPhysicallyHandicapped(e.target.value)
                        }
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Form.Select>

                      {errors.physicallyHandicapped && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.physicallyHandicapped}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Percentage of Disablement (%)</Card.Header>
                    <Card.Body>
                      {/* Percentage of Disablement */}
                      <Form.Control
                        type="number"
                        placeholder="Enter Here ....."
                        value={disablementPercent}
                        onChange={(e) => setDisablementPercent(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 5 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Status</Card.Header>
                    <Card.Body>
                      {/* Status */}
                      <Form.Select
                        value={status}
                        id="status"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="" disabled>
                          -- Select --
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Leftout">Leftout</option>
                      </Form.Select>

                      {errors.status && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.status}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Category of Employee</Card.Header>
                    <Card.Body>
                      {/* Category of Employee */}
                      <Form.Select
                        value={employeeCategory}
                        id="employeeCategory"
                        onChange={(e) => setEmployeeCategory(e.target.value)}
                      >
                        <option value="" disabled>
                          -- Select Category --
                        </option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </Form.Select>
                      {errors.employeeCategory && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.employeeCategory}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Skill Type</Card.Header>
                    <Card.Body>
                      {/* Skill Type */}
                      <Form.Select
                        value={skillType}
                        id="skillType"
                        onChange={(e) => setSkillType(e.target.value)}
                      >
                        <option value="" disabled>
                          -- select skill--
                        </option>
                        <option value="Skilled">Skilled</option>
                        <option value="Semi-Skilled">Semi-Skilled</option>
                        <option value="Un-Skilled">Un-Skilled</option>
                        <option value="Highly-Skilled">Highly-Skilled</option>
                      </Form.Select>

                      {errors.skillType && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.skillType}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Default Shift</Card.Header>
                    <Card.Body>
                      {/* Default Shift */}
                      <Form.Select
                        value={defaultShift}
                        id="defaultShift"
                        onChange={(e) => setDefaultShift(e.target.value)}
                      >
                        <option value="" disabled>
                          -- select shift --
                        </option>

                        {shifts.map((shift) => (
                          <option key={shift.shiftId} value={shift.shiftId}>
                            {shift.name}
                          </option>
                        ))}
                      </Form.Select>

                      {errors.defaultShift && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.defaultShift}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 6 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Work Experience (in Years)</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Experience"
                        value={workExperience}
                        onChange={(e) => setWorkExperience(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Designation </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={defaultDesignation}
                        id="designation"
                        onChange={(e) => setDefaultDesignation(e.target.value)}
                      >
                        <option disabled value="">
                          -- select Designation --
                        </option>
                        {designation.map((item) => (
                          <option
                            key={item.designationId}
                            value={item.designationId}
                          >
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.designation && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.designation}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Department </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={defaultDepartment}
                        id="department"
                        onChange={(e) => setDefaultDepartment(e.target.value)}
                      >
                        <option disabled value="selected">
                          -- select Department --
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
                      {errors.department && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.department}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Holiday List</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={defaultHolidays}
                        id="holidayList"
                        onChange={(e) => setDefaultHolidays(e.target.value)}
                      >
                        <option disabled value="selected">
                          -- select List --
                        </option>

                        {holidays.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.holidayList && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.holidayList}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Education Details</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Education"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Department and Grade */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h4
                style={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                {' '}
                Department and Grade
              </h4>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={3} md={3} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>
                      Region{' '}
                      <span className="text-danger text-bold text-large">
                        *
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedRegion}
                        id="selectedRegion"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedRegion(value);
                          // Clear dependent fields
                          setSelectedCircle('');
                          setCircles([]);
                          setSelectedDivision('');
                          setDivisions([]);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                          setSelectedSubStation('');
                          setSubStations([]);
                        }}
                      >
                        <option disabled value="">
                          -- select Region --
                        </option>
                        {regions.map((r) => (
                          <option key={r.regionId} value={r.regionId}>
                            {r.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.selectedRegion && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.selectedRegion}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Circle </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedCircle}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCircle(value);
                          // Clear dependent fields
                          setSelectedDivision('');
                          setDivisions([]);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                          setSelectedSubStation('');
                          setSubStations([]);
                        }}
                        disabled={!selectedRegion}
                      >
                        <option disabled value="">
                          -- select Circle --
                        </option>
                        {circles.map((c) => (
                          <option key={c.circleId} value={c.circleId}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Division </Card.Header>
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
                          setSelectedSubStation('');
                          setSubStations([]);
                        }}
                        disabled={!selectedCircle}
                      >
                        <option disabled value="">
                          -- select Division --
                        </option>
                        {divisions.map((d) => (
                          <option key={d.divisionId} value={d.divisionId}>
                            {d.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 2 */}

              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
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
                          setSelectedSubStation('');
                          setSubStations([]);
                        }}
                        disabled={!selectedDivision}
                      >
                        <option disabled value="">
                          -- select Sub Division --
                        </option>
                        {subDivisions.map((s) => (
                          <option key={s.subdivisionId} value={s.subdivisionId}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Distribution Center </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDC}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDC(value);
                          setSelectedSubStation('');
                          setSubStations([]);
                        }}
                        disabled={!selectedSubDivision}
                      >
                        <option disabled value="">
                          -- select DC --
                        </option>
                        {dcs.map((dc) => (
                          <option key={dc.dcId} value={dc.dcId}>
                            {dc.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Sub Station </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubStation}
                        onChange={(e) => setSelectedSubStation(e.target.value)}
                        disabled={!selectedDC}
                      >
                        <option disabled value="">
                          -- select SubStation --
                        </option>
                        {subStations.map((s) => (
                          <option key={s.substationId} value={s.substationId}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Reporting and Approvers */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h4
                style={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                {' '}
                Reporting and Approvers
              </h4>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Attendance Location Name </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedLocation}
                        id="attendanceLocation"
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      >
                        <option value="" disabled>
                          -- select Name --
                        </option>

                        {attendanceLocations &&
                        attendanceLocations.length > 0 ? (
                          attendanceLocations.map((item) => (
                            <option
                              key={item.locationId}
                              value={item.locationId}
                            >
                              {item.locationName}
                            </option>
                          ))
                        ) : (
                          <option disabled>No data found</option>
                        )}
                      </Form.Select>
                      {errors.attendanceLocation && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.attendanceLocation}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Reporting Officer Designation </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedOfficer}
                        id="selectedOfficer"
                        onChange={(e) => setSelectedOfficer(e.target.value)}
                      >
                        <option disabled value="">
                          -- select Designation --
                        </option>
                        {roDesignation.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.selectedOfficer && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.selectedOfficer}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Reporting Officer Name</Card.Header>
                    <Card.Body>
                      <Form.Select
                        id="reportingOfficer"
                        value={selectedRoName}
                        onChange={(e) => setSelectedRoName(e.target.value)}
                      >
                        <option disabled value="">
                          -- select Officer --
                        </option>

                        {roName && roName.length > 0 ? (
                          roName.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No data found</option>
                        )}
                      </Form.Select>
                      {errors.reportingOfficer && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.reportingOfficer}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> HR Manager Name </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedHr}
                        id="hrManager"
                        onChange={(e) => setSelectedHr(e.target.value)}
                      >
                        <option disabled value="">
                          -- select HR Name --
                        </option>
                        {hrManager.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.hrManager && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.hrManager}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Attendance and Leave Details */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h4
                style={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                {' '}
                Salary Details
              </h4>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Bank Name </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={bankName}
                        id="bankName"
                        onChange={(e) => setBankName(e.target.value)}
                      >
                        <option selected value="" disabled>
                          -- select Bank --
                        </option>
                        <option value="AKOLA JANATA COMMERCIAL COOPERATIVE BANK">
                          AKOLA JANATA COMMERCIAL COOPERATIVE BANK
                        </option>
                        <option value="ALLAHABAD BANK">ALLAHABAD BANK</option>
                        <option value="ANDHRA BANK">ANDHRA BANK</option>
                        <option value="ANDHRA BANK">ANDHRA BANK</option>
                        <option value="BANDHAN BANK LIMITED">
                          BANDHAN BANK LIMITED
                        </option>
                        <option value="BANK OF BARODA">BANK OF BARODA</option>
                        <option value="BANK OF INDIA">BANK OF INDIA</option>
                        <option value="BANK OF MAHARASHTRA">
                          BANK OF MAHARASHTRA
                        </option>
                        <option value="BHARATIYA MAHILA BANK LIMITED">
                          BHARATIYA MAHILA BANK LIMITED
                        </option>
                        <option value="CANARA BANK">CANARA BANK</option>
                        <option value="CATHOLIC SYRIAN BANK LIMITED">
                          CATHOLIC SYRIAN BANK LIMITED
                        </option>
                        <option value="CENTRAL BANK OF INDIA">
                          CENTRAL BANK OF INDIA
                        </option>
                        <option value="CITI BANK">CITI BANK</option>
                        <option value="CITY UNION BANK LIMITED">
                          CITY UNION BANK LIMITED
                        </option>
                        <option value="CORPORATION BANK">
                          CORPORATION BANK
                        </option>
                        <option value="DCB BANK LIMITED">
                          DCB BANK LIMITED
                        </option>
                        <option value="DENA BANK">DENA BANK</option>
                        <option value="DHANALAKSHMI BANK">
                          DHANALAKSHMI BANK
                        </option>
                        <option value="FEDERAL BANK">FEDERAL BANK</option>
                        <option value="HDFC BANK">HDFC BANK</option>
                        <option value="HSBC BANK">HSBC BANK</option>
                        <option value="ICICI BANK LIMITED">
                          ICICI BANK LIMITED
                        </option>
                        <option value="IDBI BANK">IDBI BANK</option>
                        <option value="INDIAN BANK">INDIAN BANK</option>
                        <option value="INDIAN OVERSEAS BANK">
                          INDIAN OVERSEAS BANK
                        </option>
                        <option value="INDUSIND BANK">INDUSIND BANK</option>
                        <option value="ING VYSYA BANK">ING VYSYA BANK</option>
                        <option value="JAMMU AND KASHMIR BANK LIMITED">
                          JAMMU AND KASHMIR BANK LIMITED
                        </option>
                        <option value="KARNATAKA BANK LIMITED">
                          KARNATAKA BANK LIMITED
                        </option>
                        <option value="KARUR VYSYA BANK">
                          KARUR VYSYA BANK
                        </option>
                        <option value="KOTAK MAHINDRA BANK LIMITED">
                          KOTAK MAHINDRA BANK LIMITED
                        </option>
                        <option value="LAXMI VILAS BANK">
                          LAXMI VILAS BANK
                        </option>
                        <option value="NAGPUR NAGARIK SAHAKARI BANK LIMITED">
                          NAGPUR NAGARIK SAHAKARI BANK LIMITED
                        </option>
                        <option value="NAGPUR NAGRIK SAHAKARI BANK LTD">
                          NAGPUR NAGRIK SAHAKARI BANK LTD
                        </option>
                        <option value="ORIENTAL BANK OF COMMERCE">
                          ORIENTAL BANK OF COMMERCE
                        </option>
                        <option value="PUNJAB AND SIND BANK">
                          PUNJAB AND SIND BANK
                        </option>
                        <option value="PUNJAB NATIONAL BANK">
                          PUNJAB NATIONAL BANK
                        </option>
                        <option value="RATNAKAR BANK LIMITED">
                          RATNAKAR BANK LIMITED
                        </option>
                        <option value="RESERVE BANK OF INDIA">
                          RESERVE BANK OF INDIA
                        </option>
                        <option value="SARASWAT COOPERATIVE BANK LIMITED">
                          SARASWAT COOPERATIVE BANK LIMITED
                        </option>
                        <option value="SOUTH INDIAN BANK">
                          SOUTH INDIAN BANK
                        </option>
                        <option value="STANDARD CHARTERED BANK">
                          STANDARD CHARTERED BANK
                        </option>
                        <option value="STATE BANK OF BIKANER AND JAIPUR">
                          STATE BANK OF BIKANER AND JAIPUR
                        </option>
                        <option value="STATE BANK OF HYDERABAD">
                          STATE BANK OF HYDERABAD
                        </option>
                        <option value="STATE BANK OF INDIA">
                          STATE BANK OF INDIA
                        </option>
                        <option value="STATE BANK OF MYSORE">
                          STATE BANK OF MYSORE
                        </option>
                        <option value="STATE BANK OF PATIALA">
                          STATE BANK OF PATIALA
                        </option>
                        <option value="STATE BANK OF TRAVANCORE">
                          STATE BANK OF TRAVANCORE
                        </option>
                        <option value="SYNDICATE BANK">SYNDICATE BANK</option>
                        <option value="TAMILNAD MERCANTILE BANK LIMITED">
                          TAMILNAD MERCANTILE BANK LIMITED
                        </option>
                        <option value="THE COSMOS CO OPERATIVE BANK LIMITED">
                          THE COSMOS CO OPERATIVE BANK LIMITED
                        </option>
                        <option value="THE SHAMRAO VITHAL COOPERATIVE BANK">
                          THE SHAMRAO VITHAL COOPERATIVE BANK
                        </option>
                        <option value="UCO BANK">UCO BANK</option>
                        <option value="UNION BANK OF INDIA">
                          UNION BANK OF INDIA
                        </option>
                        <option value="UNITED BANK OF INDIA">
                          UNITED BANK OF INDIA
                        </option>
                        <option value="VIJAYA BANK">VIJAYA BANK</option>
                        <option value="YES BANK">YES BANK</option>
                      </Form.Select>

                      {errors.bankName && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.bankName}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Bank Account</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Account Number"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Bank IFSC </Card.Header>
                    <Card.Body>
                      <Form.Control
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value)}
                        type="text"
                        placeholder="Enter IFSC"
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header> PAN Number </Card.Header>
                    <Card.Body>
                      <Form.Control
                        value={panNumber}
                        id="panNumber"
                        // onChange={(e) => setPanNumber(e.target.value)}
                        onChange={(e) =>
                          setPanNumber(e.target.value.toUpperCase())
                        }
                        type="text"
                        placeholder="Enter PAN"
                      />
                      {errors.panNumber && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.panNumber}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>PF Number </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Account Number"
                        value={pfNumber}
                        onChange={(e) => setPfNumber(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Device Id</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Vendor's Details */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <h4
                style={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                {' '}
                Vendor's Details
              </h4>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Contract Start Date </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        id="contractStartDate"
                        value={contractStartDate}
                        onChange={(e) => setContractStartDate(e.target.value)}
                        disabled
                      />
                      {errors.contractStartDate && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.contractStartDate}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Contract End Date </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        value={contractEndDate}
                        id="contractEndDate"
                        onChange={(e) => setContractEndDate(e.target.value)}
                        disabled
                      />
                      {errors.contractEndDate && (
                        <Typography
                          variant="caption"
                          style={{ color: 'red', marginTop: '3px' }}
                        >
                          {' '}
                          &nbsp;*{errors.contractEndDate}
                        </Typography>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Vendor Name </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Card.Body>

        <Card.Footer className="text-center">
          <Button to="/" className="cancel-button" component={Link}>
            Cancel
          </Button>
          &nbsp; &nbsp;
          <Button className="green-button" onClick={handleSubmit}>
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

export default UpdateVerifyEmployee;
