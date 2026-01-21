import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { PropagateLoader } from 'react-spinners';
import { Typography, Tooltip, Button, Box, Backdrop } from '@mui/material';
import { createNewEmployee } from '../../../Services/Auth';

function UpdateEmployeeInformation({
  employmentList,
  selectedEmployment,
  onEmploymentChange,
  regionsList,
  circlesList,
  divisionsList,
  subDivisionsList,
  dcsList,
  substationsList,
  selectedRegion,
  selectedCircle,
  selectedDivision,
  selectedSubDivision,
  selectedDC,
  selectedSubstation,
  onRegionChange,
  onCircleChange,
  onDivisionChange,
  onSubDivisionChange,
  onDCChange,
  onSubstationChange,

  designationList,
  onDesignationChange,
  selectedDesignation,
  departmentList,
  onDepartmentChange,
  selectedDepartment,

  roDesignationsList,
  officersList,
  selectedRoDesignation,
  selectedOfficer,
  onRoDesignationChange,
  onOfficerChange,

  hrManagersList,
  selectedHrManager,
  onHrManagerChange,

  attendanceLocations,
  selectedLocation,
  onLocationChange,

  holidayList,
  selectedHoliday,
  onHolidayChange,

  shifts,
  selectedShift,
  onShiftChange,

  updateEmpCode,
  userName,
  userInformation,
}) {
  // console.log(userInformation);

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    status: '',
    gender: '',
    dob: '',
    stateOfBirth: '',
    cityName: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    height: '',
    identificationMark: '',
    category: '',
    physicallyHandicapped: '',
    disablementPercent: '',
    isRegisteredHandicapped: '',
    handicappedDescription: '',
    joiningDate: '',
    trainingDate: '',
    regularisationDate: '',

    isHRManager: false,
    isReportingOfficer: false,
    isAEIT: false,
    isTransferApprover: false,
    isSCNIssuer: false,
    isDisciplinaryAuthority: false,
    isExemptAttendance: false,

    //  Salary Details
    basicPay: '',
    panNumber: '',
    providentFundType: '',
    gpfCpfNumber: '',
    bankName: '',
    bankAccount: '',
    bankIfsc: '',
    pfNumber: '',

    //  Personal Details
    aadhaar: '',
    officialEmail: '',
    gsliNumber: '',
    permanentAddress: '',
    mobile: '',
    personalEmail: '',
    bloodGroup: '',
    correspondenceAddress: '',

    deviceId: '',
  });

  const shiftId = parseInt(userInformation?.defaultShift?.shiftId);
  const regionId = parseInt(userInformation?.region?.regionId);
  const designationId = String(userInformation?.designation?.designationId);
  const designationClass = parseInt(
    userInformation?.designation?.designationClass,
  );
  const departmentId = String(userInformation?.department?.id);

  const allowedShiftIds = [2, 20, 22, 21, 170];
  const isShiftMatch = allowedShiftIds.includes(shiftId);
  const isValidDesignation =
    ['23', '99'].includes(designationId) || designationClass <= 2;
  const isRegionAllowed = regionId !== 1;
  const isValidDepartment = [
    '17',
    '18',
    '19',
    '22',
    '36',
    '44',
    '29',
    '33',
    '57',
  ].includes(departmentId);

  const shouldShowExemptRow =
    isShiftMatch && isValidDesignation && isRegionAllowed && isValidDepartment;

  useEffect(() => {
    if (userInformation) {
      console.log(userInformation);
      //  Update all text/number fields in formData
      const mappedData = {
        employeeCode: userInformation.empCode || '',
        firstName: userInformation.firstName,
        middleName: userInformation.middleName,
        lastName: userInformation.lastName,
        fullName: userInformation.fullName,
        status: userInformation.status,
        gender: userInformation.gender,
        dob: userInformation.dateOfBirth,
        stateOfBirth: userInformation.stateOfBirth,
        cityName: userInformation.city,
        fatherName: userInformation.fatherName,
        motherName: userInformation.motherName,
        maritalStatus: userInformation.maritalStatus,
        height: userInformation.heightOfEmployee,
        identificationMark: userInformation.personalIdentificationMark,
        category: userInformation.category,
        physicallyHandicapped: userInformation.physicallyHandicaped,
        disablementPercent: userInformation.percentageOfDisablement,
        isRegisteredHandicapped: userInformation.isRegisteredHandicapped,
        handicappedDescription: userInformation.discriptionOfHandicapped,
        joiningDate: userInformation.dateOfJoining,
        trainingDate: userInformation.dateOfTraining,
        regularisationDate: userInformation.dateOfRegularisation,

        isHRManager: userInformation.isManagerHr,
        isReportingOfficer: userInformation.isReportingOfficer,
        isAEIT: userInformation.isAeIt,
        isTransferApprover: userInformation.isTransferOrderApprover,
        isSCNIssuer: userInformation.isScnIssuer,
        isDisciplinaryAuthority: userInformation.isDa,
        isExemptAttendance: userInformation.exemptAttendance,
        deviceId: userInformation.deviceId,
        //  Salary Details
        basicPay: userInformation.basicPay,
        panNumber: userInformation.panNo,
        providentFundType: userInformation.providentFundType,
        gpfCpfNumber: userInformation.pranNumber,
        // bankName: userInformation.bankName,
        bankName: userInformation.bankName ?? '',
        bankAccount: userInformation.bankAccount,
        bankIfsc: userInformation.bankIfsc,
        pfNumber: userInformation.pfNumber,

        //  Personal Details
        aadhaar: userInformation.adhaarNumber,
        officialEmail: userInformation.officialEmail,
        gsliNumber: userInformation.gsliNumber,
        permanentAddress: userInformation.address,
        mobile: userInformation.mobileNo,
        personalEmail: userInformation.email,
        bloodGroup: userInformation.bloodGroup,
        correspondenceAddress: userInformation.correspondenceAddress,
      };
      setFormData((prev) => ({
        ...prev,
        ...mappedData,
      }));

      //  Update dropdown-controlled selections using parent handlers
      if (userInformation?.employementType?.empTypeId) {
        onEmploymentChange(userInformation.employementType.empTypeId);
      }

      if (userInformation?.region?.regionId) {
        onRegionChange(userInformation.region.regionId);
      }

      if (userInformation?.circle?.circleId) {
        onCircleChange(userInformation.circle.circleId);
      }

      if (userInformation?.division?.divisionId) {
        onDivisionChange(userInformation.division.divisionId);
      }

      if (userInformation?.subDivision?.subdivisionId) {
        onSubDivisionChange(userInformation.subDivision.subdivisionId);
      }

      if (userInformation?.dc?.dcId) {
        onDCChange(userInformation.dc.dcId);
      }

      if (userInformation?.substation?.substationId) {
        onSubstationChange(userInformation.substation.substationId);
      }

      if (userInformation?.designation?.designationId) {
        onDesignationChange(userInformation?.designation?.designationId);
      }
      if (userInformation?.department?.id) {
        onDepartmentChange(userInformation?.department?.id);
      }
      if (userInformation?.reportingOfficerDesignation?.id) {
        onRoDesignationChange(userInformation?.reportingOfficerDesignation?.id);
      }
      if (userInformation?.reportingOfficer?.id) {
        onOfficerChange(userInformation?.reportingOfficer?.id);
      }

      if (userInformation?.managerHr?.id) {
        onHrManagerChange(userInformation?.managerHr?.id);
      }

      if (userInformation?.attendanceLocationId?.id) {
        onLocationChange(userInformation?.attendanceLocationId?.id);
      }

      if (userInformation?.holidayList?.id) {
        onHolidayChange(userInformation?.holidayList?.id);
      }

      if (userInformation?.defaultShift?.shiftId) {
        onShiftChange(userInformation?.defaultShift?.shiftId);
      }
    }
  }, [userInformation]);

  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => {
      let updatedData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (
        name === 'firstName' ||
        name === 'middleName' ||
        name === 'lastName'
      ) {
        updatedData.fullName = [
          updatedData.firstName,
          updatedData.middleName,
          updatedData.lastName,
        ]
          .filter(Boolean)
          .join(' ');
      }

      return updatedData;
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.employeeCode)
      newErrors.employeeCode = ' *Employee Code is required';
    if (!formData.firstName) newErrors.firstName = ' *First Name is required';
    if (!formData.lastName) newErrors.lastName = ' *Last Name is required';
    if (!formData.status) newErrors.status = ' *Status is required';
    if (!formData.gender) newErrors.gender = '*Gender is required';
    if (!formData.dob) newErrors.dob = '*Date of Birth is required';
    // if (!formData.fatherName)
    //   newErrors.fatherName = "*Father's Name is required";

    if (!selectedEmployment)
      newErrors.selectedEmployment = '*Employment Type is required';
    if (!selectedRegion) newErrors.selectedRegion = '*Region is required';
    if (!selectedDesignation)
      newErrors.selectedDesignation = '*Designation is required';
    if (!selectedDepartment)
      newErrors.selectedDepartment = '*Department is required';
    if (!selectedRoDesignation)
      newErrors.selectedRoDesignation = '*RO Designation is required';
    if (!selectedOfficer)
      newErrors.selectedOfficer = 'Officer Name is required';
    if (!selectedHrManager)
      newErrors.selectedHrManager = '*HR Manager is required';
    if (!selectedLocation)
      newErrors.selectedLocation = '*Attendance Location is required';
    if (!selectedHoliday)
      newErrors.selectedHoliday = '*Holiday List is required';
    if (!selectedShift) newErrors.selectedShift = '*Shift is required';

    if (!formData.aadhaar) newErrors.aadhaar = 'Aadhaar is required';
    else if (!/^\d{12}$/.test(formData.aadhaar))
      newErrors.aadhaar = 'Aadhaar must be 12 digits';

    if (!formData.mobile) newErrors.mobile = '*Mobile is required';
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = '*Mobile must be 10 digits';

    if (!formData.officialEmail) newErrors.officialEmail = '*Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail))
      newErrors.officialEmail = '*Invalid Email';

    if (!formData.panNumber) newErrors.panNumber = '*PAN is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber))
      newErrors.panNumber = '*Invalid PAN';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstField = Object.keys(newErrors)[0];
      if (inputRefs.current[firstField]) {
        inputRefs.current[firstField].focus();
      }
      return false;
    }
    return true;
  };

  const UpdateEmpInfo = async () => {
    if (!validateForm()) return;
    setOpenBackdrop(true);
    const payload = {
      empCode: formData.employeeCode,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      fullName: formData.fullName,
      mobileNo: formData.mobile,
      adhaarNumber: formData.aadhaar,
      dateOfBirth: formData.dob,
      dateOfJoining: formData.joiningDate,
      dateOfTraining: formData.trainingDate,
      gender: formData.gender,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      maritalStatus: formData.maritalStatus,
      heightOfEmployee: formData.height,
      personalIdentificationMark: formData.identificationMark,
      physicallyHandicaped: formData.physicallyHandicapped,
      percentageOfDisablement: formData.disablementPercent,
      employementType: selectedEmployment,
      status: formData.status,
      category: formData.category,
      email: formData.personalEmail,
      address: formData.permanentAddress,
      city: formData.cityName,
      deviceId: formData.deviceId,

      region: selectedRegion,
      circle: selectedCircle,
      division: selectedDivision,
      subDivision: selectedSubDivision,
      dc: selectedDC,
      substationId: selectedSubstation,

      defaultShift: selectedShift,
      designation: selectedDesignation,
      reportingOfficer: selectedOfficer,

      bankName: formData.bankName,
      bankAccount: formData.bankAccount,
      bankIfsc: formData.bankIfsc,
      isReportingOfficer: formData.isReportingOfficer,
      isManagerHr: formData.isHRManager,
      isAeIt: formData.isAEIT,
      isScnIssuer: formData.isSCNIssuer,
      isDa: formData.isDisciplinaryAuthority,
      isTransferOrderApprover: formData.isTransferApprover,
      exemptAttendance: formData.isExemptAttendance,

      isCurrentCharge: false,
      currentChargeDesignation: null,
      dateOfCurrentCharge: '',

      managerHr: selectedHrManager,
      dateOfRegularisation: formData.regularisationDate,
      panNo: formData.panNumber,
      attendanceLocationId: selectedLocation,

      departmentId: selectedDepartment,
      stateOfBirth: formData.stateOfBirth,
      townOrCityOfBirth: '',
      isRegisteredHandicapped: formData.isRegisteredHandicapped,
      discriptionOfHandicapped: formData.handicappedDescription,
      officialEmail: formData.officialEmail,
      gsliNumber: formData.gsliNumber,
      bloodGroup: formData.bloodGroup,
      correspondenceAddress: formData.correspondenceAddress,
      basicPay: formData.basicPay,
      providentFundType: formData.providentFundType,
      pranNumber: formData.gpfCpfNumber,
      pfNumber: formData.pfNumber,
      holidayList: selectedHoliday,
      // exemptAttendance: false,
      updatedBy: sessionStorage.getItem('empCode'),
    };

    console.log(' Final Payload:', payload);

    try {
      const response = await createNewEmployee(payload);
      //console.log(response);
      if (response.data.code === '200') {
        alert('Employee Information Successfully Updated !!');
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('Error', error);
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          {/* Back button */}
          <Tooltip title="Back" arrow placement="top">
            <Button className="position-absolute start-2">
              <Link to="/employeeInformation">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>

          {/* Title Section */}
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#0a1f83',
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              Update Employee Information
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'gray',
                fontFamily: 'serif',
                fontWeight: 'bold',
                mt: 0.5,
              }}
            >
              {userName} - {updateEmpCode}
            </Typography>
          </Box>
        </Card.Header>

        <Card.Body>
          {/* Basic Information */}
          <Card>
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Basic Information
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>
                      Employee Code <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        name="employeeCode"
                        value={formData.employeeCode}
                        onChange={handleChange}
                        isInvalid={!!errors.employeeCode}
                        ref={(el) => (inputRefs.current.employeeCode = el)}
                        placeholder="Enter New Employee Code"
                        readOnly
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.employeeCode}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      First Name <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                        ref={(el) => (inputRefs.current.firstName = el)}
                        placeholder="Enter First Name"
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.firstName}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Middle Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        placeholder="Enter Middle Name"
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      Last Name <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        isInvalid={!!errors.lastName}
                        ref={(el) => (inputRefs.current.lastName = el)}
                        placeholder="Enter Last Name"
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.lastName}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 2 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Full Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter Full Name"
                        readOnly
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Status <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        isInvalid={!!errors.status}
                        ref={(el) => (inputRefs.current.status = el)}
                      >
                        <option value="" disabled selected>
                          -- select Status --
                        </option>
                        <option value="Active">Active</option>
                        <option value="In Active">In Active</option>
                        <option value="Retired">Retired</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Resigned">Left Out (Resigned)</option>
                        <option value="Deputed Out">Deputed Out </option>
                        <option value="VRS">VRS </option>
                        <option value="Suspension">Suspension </option>
                        <option value="Death">Death</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.status}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Gender <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        isInvalid={!!errors.gender}
                        ref={(el) => (inputRefs.current.gender = el)}
                      >
                        <option value="" disabled selected>
                          -- select Gender --
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.gender}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Date of Birth <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        isInvalid={!!errors.dob}
                        ref={(el) => (inputRefs.current.dob = el)}
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption"> {errors.dob}</Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 3 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>State of Birth</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="stateOfBirth"
                        value={formData.stateOfBirth}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          -- select State --
                        </option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">
                          Arunachal Pradesh
                        </option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujrat">Gujrat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">
                          Himachal Pradesh
                        </option>
                        <option value="Jammu and Kashmir">
                          Jammu and Kashmir
                        </option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharastra">Maharastra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>City Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="cityName"
                        value={formData.cityName}
                        onChange={handleChange}
                        placeholder="Enter City Name"
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Father's Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        // isInvalid={!!errors.fatherName}
                        // ref={(el) => (inputRefs.current.fatherName = el)}
                        placeholder="Enter Father's Name"
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.fatherName}
                        </Typography>
                      </Form.Control.Feedback> */}
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Mother's Name</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        placeholder="Enter Mother's Name"
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 4 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Marital Status</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          -- select Status --
                        </option>
                        <option value="Married">Married</option>
                        <option value="Unmarried">Unmarried</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widow">Widow</option>
                        <option value="Widower">Widower</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Height (In Centimeter)</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Enter Height (CM)"
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Personal Identification mark (If Any)
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="identificationMark"
                        value={formData.identificationMark}
                        onChange={handleChange}
                        placeholder="Enter Here ....."
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Category of Employee</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          -- select Category --
                        </option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 5 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Physically Handicapped</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="physicallyHandicapped"
                        value={formData.physicallyHandicapped}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          -- select --
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>% of Disablement (If Handicapped)</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="disablementPercent"
                        value={formData.disablementPercent}
                        onChange={handleChange}
                        placeholder="Enter Percentage"
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Is Registered Handicapped ?</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="isRegisteredHandicapped"
                        value={formData.isRegisteredHandicapped}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          -- select --
                        </option>
                        <option value="True">Yes</option>
                        <option value="False">No</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Description of Handicapped (If Any)
                    </Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        name="handicappedDescription"
                        value={formData.handicappedDescription}
                        onChange={handleChange}
                        placeholder="Enter Description"
                        style={{ height: '35px' }}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 6 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Date of Joining</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Training Appointment Date</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        name="trainingDate"
                        value={formData.trainingDate}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Date Of Regularisation</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="date"
                        name="regularisationDate"
                        value={formData.regularisationDate}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Type of Employment <span className="text-danger">*</span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedEmployment}
                        onChange={(e) => onEmploymentChange(e.target.value)}
                        isInvalid={!!errors.selectedEmployment}
                        ref={(el) =>
                          (inputRefs.current.selectedEmployment = el)
                        }
                      >
                        <option value="" disabled selected>
                          -- select Type --
                        </option>
                        {employmentList && employmentList.length > 0 ? (
                          employmentList.map((item) => (
                            <option key={item.empTypeId} value={item.empTypeId}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedEmployment}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Department and Grade */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Department and Grade
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={2} md={4} className="g-3">
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
                        onChange={(e) => onRegionChange(e.target.value)}
                        isInvalid={!!errors.selectedRegion} // validation key matches
                        ref={(el) => (inputRefs.current.selectedRegion = el)} // ref for focusing
                      >
                        <option value="" disabled selected>
                          -- select Region --
                        </option>
                        {regionsList && regionsList.length > 0 ? (
                          regionsList.map((item) => (
                            <option key={item.regionId} value={item.regionId}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedRegion}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Circle </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedCircle}
                        onChange={(e) => onCircleChange(e.target.value)}
                      >
                        <option value="" disabled selected>
                          -- select Circle --
                        </option>
                        {circlesList && circlesList.length > 0 ? (
                          circlesList.map((item) => (
                            <option key={item.circleId} value={item.circleId}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
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
                        onChange={(e) => onDivisionChange(e.target.value)}
                      >
                        <option value="" disabled selected>
                          -- select Division --
                        </option>
                        {divisionsList && divisionsList.length > 0 ? (
                          divisionsList.map((item) => (
                            <option
                              key={item.divisionId}
                              value={item.divisionId}
                            >
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>
                      Sub Division{' '}
                      <span className="text-danger text-bold text-large">
                        *
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubDivision}
                        onChange={(e) => onSubDivisionChange(e.target.value)}
                      >
                        <option value="" disabled selected>
                          -- select Sub Division --
                        </option>
                        {subDivisionsList && subDivisionsList.length > 0 ? (
                          subDivisionsList.map((item) => (
                            <option
                              key={item.subdivisionId}
                              value={item.subdivisionId}
                            >
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 2 */}
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Distribution Center </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDC}
                        onChange={(e) => onDCChange(e.target.value)}
                      >
                        <option value="" disabled selected>
                          -- select DC --
                        </option>
                        {dcsList && dcsList.length > 0 ? (
                          dcsList.map((item) => (
                            <option key={item.dcId} value={item.dcId}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Sub Station </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubstation}
                        onChange={(e) => onSubstationChange(e.target.value)}
                      >
                        <option value="" disabled selected>
                          -- select Substation --
                        </option>
                        {substationsList && substationsList.length > 0 ? (
                          substationsList.map((item) => (
                            <option
                              key={item.substationId}
                              value={item.substationId}
                            >
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Designation </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDesignation}
                        onChange={(e) => onDesignationChange(e.target.value)}
                        isInvalid={!!errors.selectedDesignation}
                        ref={(el) =>
                          (inputRefs.current.selectedDesignation = el)
                        }
                      >
                        <option value="" disabled selected>
                          -- select Designation --
                        </option>
                        {designationList && designationList.length > 0 ? (
                          designationList.map((item) => (
                            <option
                              key={item.designationId}
                              value={item.designationId}
                            >
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedDesignation}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Department</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDepartment}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        isInvalid={!!errors.selectedDepartment} // show red border
                        ref={(el) =>
                          (inputRefs.current.selectedDepartment = el)
                        } // focus target
                      >
                        <option value="" disabled selected>
                          -- select Department --
                        </option>
                        {departmentList && departmentList.length > 0 ? (
                          departmentList.map((item) => (
                            <option
                              key={item.departmentId}
                              value={item.departmentId}
                            >
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedDepartment}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Reporting and Approvers */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Reporting and Approvers
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Reporting Officer Designation</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedRoDesignation}
                        onChange={(e) => onRoDesignationChange(e.target.value)}
                        isInvalid={!!errors.selectedRoDesignation}
                        ref={(el) =>
                          (inputRefs.current.selectedRoDesignation = el)
                        }
                      >
                        <option value="" disabled selected>
                          -- select Designation --
                        </option>
                        {roDesignationsList.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedRoDesignation}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Reporting Officer Name</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedOfficer}
                        onChange={(e) => onOfficerChange(e.target.value)}
                        isInvalid={!!errors.selectedOfficer}
                        ref={(el) => (inputRefs.current.selectedOfficer = el)}
                      >
                        <option value="" disabled>
                          -- select Officer Name --
                        </option>
                        {officersList && officersList.length > 0 ? (
                          officersList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.selectedOfficer}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>HR Manager Name</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedHrManager}
                        onChange={(e) => onHrManagerChange(e.target.value)}
                        isInvalid={!!errors.selectedHrManager}
                        ref={(el) => (inputRefs.current.selectedHrManager = el)}
                      >
                        <option value="" disabled selected>
                          -- select HR Name --
                        </option>
                        {hrManagersList && hrManagersList.length > 0 ? (
                          hrManagersList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedHrManager}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Attendance and Leave Details */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Attendance and Leave Details
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Attendance Location Name</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        isInvalid={!!errors.selectedLocation}
                        ref={(el) => (inputRefs.current.selectedLocation = el)}
                      >
                        <option value="" disabled>
                          -- select Location --
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
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedLocation}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Holiday List</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedHoliday}
                        onChange={(e) => onHolidayChange(e.target.value)}
                        isInvalid={!!errors.selectedHoliday}
                        ref={(el) => (inputRefs.current.selectedHoliday = el)}
                      >
                        <option value="" disabled selected>
                          -- select List --
                        </option>
                        {holidayList && holidayList.length > 0 ? (
                          holidayList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedHoliday}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Default Shift */}
                <Col>
                  <Card>
                    <Card.Header>Default Shift</Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedShift}
                        onChange={(e) => onShiftChange(e.target.value)}
                        isInvalid={!!errors.selectedShift}
                        ref={(el) => (inputRefs.current.selectedShift = el)}
                      >
                        <option value="" disabled selected>
                          -- select Shift --
                        </option>
                        {shifts && shifts.length > 0 ? (
                          shifts.map((item) => (
                            <option key={item.shiftId} value={item.shiftId}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            -- Data Not Found --
                          </option>
                        )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.selectedShift}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Device Id</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        name="deviceId"
                        value={formData.deviceId}
                        onChange={handleChange}
                        placeholder="Enter DeviceId"
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Roles & Responsibilies */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Roles & Responsibilies
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>HR Manager </Card.Header>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="HR Manager"
                        type="checkbox"
                        name="isHRManager"
                        checked={formData.isHRManager}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Reporting Officer</Card.Header>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="Reporting Officer"
                        type="checkbox"
                        name="isReportingOfficer"
                        checked={formData.isReportingOfficer}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>AE (IT) </Card.Header>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="AE (IT)"
                        type="checkbox"
                        name="isAEIT"
                        checked={formData.isAEIT}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 2 */}
              <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Transfer Order Approver </Card.Header>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="Transfer Order Approver"
                        type="checkbox"
                        name="isTransferApprover"
                        checked={formData.isTransferApprover}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> SCN Issuer</Card.Header>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="SCN Issuer"
                        type="checkbox"
                        name="isSCNIssuer"
                        checked={formData.isSCNIssuer}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Disciplinary Authority </Card.Header>
                    <Card.Body>
                      <Form.Check
                        inline
                        label="Disciplinary Authority"
                        type="checkbox"
                        name="isDisciplinaryAuthority"
                        checked={formData.isDisciplinaryAuthority}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {shouldShowExemptRow && (
                <Row xs={1} sm={3} md={3} className="g-3 mt-2">
                  <Col>
                    <Card>
                      <Card.Header>Exempt Attendance</Card.Header>
                      <Card.Body>
                        <Form.Check
                          inline
                          label="Exempt Attendance"
                          type="checkbox"
                          name="isExemptAttendance"
                          checked={formData.isExemptAttendance}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Salary Details */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Salary Details
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>Basic Pay</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Basic Pay"
                        name="basicPay"
                        value={formData.basicPay}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>PAN Number</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter PAN Number"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        isInvalid={!!errors.panNumber}
                        ref={(el) => (inputRefs.current.panNumber = el)}
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.panNumber}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Provident Fund Type</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="providentFundType"
                        value={formData.providentFundType}
                        onChange={handleChange}
                      >
                        <option value="" disabled selected>
                          -- select Type --
                        </option>
                        <option value="EPF">EPF</option>
                        <option value="PPF">PPF</option>
                        <option value="GPF">GPF</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>GPF/CPF/ EPF/PRAN No.</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Number"
                        name="gpfCpfNumber"
                        value={formData.gpfCpfNumber}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Bank Name</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                      >
                        <option value="">-- select Bank --</option>
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
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Bank A/C Number</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Account Number"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> IFSC Code</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter IFSC Code"
                        name="bankIfsc"
                        value={formData.bankIfsc}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>PF Number</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter PF Number"
                        name="pfNumber"
                        value={formData.pfNumber}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Personal Details */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Personal Details
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>Aadhaar Number</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Aadhaar Number"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        isInvalid={!!errors.aadhaar}
                        ref={(el) => (inputRefs.current.aadhaar = el)}
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.aadhaar}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Official Email</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="email"
                        placeholder="Enter Official Email"
                        name="officialEmail"
                        value={formData.officialEmail}
                        onChange={handleChange}
                        isInvalid={!!errors.officialEmail}
                        ref={(el) => (inputRefs.current.officialEmail = el)}
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.officialEmail}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>GSLI Number</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter GSLI Number"
                        name="gsliNumber"
                        value={formData.gsliNumber}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Permanent Address</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Permanent Address"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Mobile Number</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        isInvalid={!!errors.mobile}
                        ref={(el) => (inputRefs.current.mobile = el)}
                      />
                      <Form.Control.Feedback type="invalid">
                        <Typography variant="caption">
                          {' '}
                          {errors.mobile}
                        </Typography>
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Personal Email</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="email"
                        placeholder="Enter Personal Email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Blood Group</Card.Header>
                    <Card.Body>
                      <Form.Select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          -- select Blood Group --
                        </option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Correspondence Address</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter Correspondence Address"
                        style={{ height: '35px' }}
                        name="correspondenceAddress"
                        value={formData.correspondenceAddress}
                        onChange={handleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button className="cancel-button" component={Link} to="/">
            Cancel
          </Button>
          &nbsp;
          <Button
            variant="contained"
            className="green-button"
            onClick={UpdateEmpInfo}
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

export default UpdateEmployeeInformation;
