import axios from 'axios';
// Base API URL
const base_url = 'https://attendance.mpcz.in:8888/E-Attendance/api';
// const base_url = 'http://172.16.17.79:8084/e-Attendance/api';
const sessionEmpCode = sessionStorage.getItem('empCode');

// 1.Get Daily Attendance Records
export const attendanceRecords = (punchDate) => {
  return axios.get(`${base_url}/attendance/getAttendanceSummary`, {
    params: { punchDate },
  });
};

// 2.User Authentication API
export const userAuthentication = (payload) => {
  return axios.post(base_url + '/user-login/authenticate', payload);
};

// 3.Get User OTP API
export const getOtp = (payload) => {
  return axios.post(base_url + '/otp/getOtp', payload);
};

// 4.Verify User OTP API
export const verifyOtp = (payload) => {
  return axios.post(base_url + '/otp/verifyOtp', payload);
};

// 5.Get Regions
export const getRegion = () => {
  return axios.get(`${base_url}/location/getAllRegions`);
};

// 6.Get Circles
export const getCircle = (regionId) => {
  return axios.get(`${base_url}/location/getAllCirclesByRegionId/${regionId}`);
};

// 7.Get Division
export const getDivision = (circleId) => {
  return axios.get(
    `${base_url}/location/getAllDivisionsByCircleId/${circleId}`
  );
};

// 8.Get Sub-Division
export const getSubDivision = (divisionId) => {
  return axios.get(
    `${base_url}/location/getAllSubDivisionsByDivisionId/${divisionId}`
  );
};

// 9.Get DC
export const getDC = (subDivisionId) => {
  return axios.get(
    `${base_url}/location/getAllDcsBySubDivisionId/${subDivisionId}`
  );
};

// 10.Get Sub-Station
export const getSubstation = (dcId) => {
  return axios.get(`${base_url}/location/getAllSubstationsByDcId/${dcId}`);
};

// 11.Get Employee by Level (Region,Circle,Division, etc.....)
export const getEmployeeByLevel = (payload) => {
  return axios.post(base_url + '/employee/getEmployeesByLevel', payload);
};

// 12.Get Employee by Employee Code
export const getEmployeeByEmpCode = (empCode) => {
  return axios.get(`${base_url}/employee/getEmployeeByEmpCode/${empCode}`);
};

// 13.Get All District
export const getDistrict = () => {
  return axios.get(`${base_url}/master/getAllDistricts`);
};

// 14.Create Attendance Location
export const createAttendanceLocation = (payload) => {
  return axios.post(base_url + '/location/addNewAttendanceLocation', payload);
};

// 15.View Attendance Location
export const viewAttendanceLocation = (payload) => {
  return axios.post(base_url + '/location/getLocationByLevel', payload);
};

// 16.Update Attendance Location
export const updateLocationCordinate = (payload) => {
  return axios.post(base_url + '/location/addNewAttendanceLocation', payload);
};

// 17.Get Leave Allocation by Levek (Region,Circle,Division, etc.....)
export const getLeaveAllocation = (payload) => {
  return axios.post(base_url + '/leave/getLeaveBalanceByLevel', payload);
};

// 18.Update Employee Leaves
export const updateEmployeeLeaves = (payload) => {
  return axios.post(base_url + '/leave/updateLeaveBalancesEmp', payload);
};

// 19.Get Employee Ateendance for Month/Year
export const employeeAttendaceView = (empCode, month, year) => {
  return axios.get(
    base_url +
      `/attendance/getMonthWiseAttendanceEmp?empCode=${empCode}&month=${month}&year=${year}`
  );
};

// 20.Get Employee Impressions
export const getImpressionImage = (empCode, punchDate) => {
  return axios.get(
    base_url +
      `/attendance/getAttendanceCheckInByDate?empCode=${empCode}&punchDate=${punchDate}`
  );
};

// 21. Get Employee Places Of Postings Records
export const getEmployeePlaceOfPosting = (empCode) => {
  return axios.get(
    base_url + `/employee/getEmployeePostingApi?empCode=${empCode}`
  );
};

// 22. Get Designation API
export const getDesignation = () => {
  return axios.get(base_url + '/master/getAllDesignations');
};

// 23. Get Department API
export const getDepartment = () => {
  return axios.get(base_url + '/master/getAllDepartments');
};

// 24. Submit Employee's Place of Postings
export const submitPlaceOfPosting = (payload) => {
  return axios.post(base_url + '/employee/employeePostingApi', [payload]);
};

// 25. Get Substation By Division
export const getSubstationByDivision = (divisionId) => {
  return axios.get(
    `${base_url}/location/getAllSubstationsByDivId/${divisionId}`
  );
};

// 26. Get Substation By Division
export const getFeederBySubstation = (substationId) => {
  return axios.get(
    `https://htsanyojanuat.mpcz.in:8088/api/FeederDetails/by-ss/${substationId}`
  );
};

// 27. Get Officer User Details on DC Change
export const getFeederManagerByDc = (dcId) => {
  return axios.get(
    `${base_url}/employee/getOfficerEmployeeDetailApi?dc=${dcId}`
  );
};

// 28. Get Feeder Incharge by DC
export const getFeederInchargeByDc = (dcId) => {
  return axios.get(
    `${base_url}/employee/getLinestaffEmployeeDetailApi?dc=${dcId}`
  );
};

// 29. Get Posted Feeder Manager and Feeder Inchange
export const getPostedOfficerByFeeder = (feederId) => {
  return axios.get(
    `${base_url}/location/getFeederManagementApi?feederCode=${feederId}`
  );
};

//  30. Get Employee Master Data
export const getEmpMasterData = (regionId, circleId) => {
  return axios.get(
    `${base_url}/employee/getEmployeeMisJson?regionId=${regionId}&circleId=${circleId}`
  );
};

// 31. Day Wise Attendance Regular
export const getDayWiseAttendance = (regionId, circleId, punchDate) => {
  return axios.get(
    `${base_url}/attendance/getAttendanceSingleDateMisJson?regionId=${regionId}&circleId=${circleId}&punchDate=${punchDate}`
  );
};

// 32. Employee Leave Reports
export const getLeaveReports = ({ regionId, circleId, fromDate, toDate }) => {
  return axios.get(
    `${base_url}/leave/getLeaveReport?regionId=${regionId}&circleId=${circleId}&fromDate=${fromDate}&toDate=${toDate}`
  );
};

// 33. Officer's Wise Attendance
export const getAttendanceOfficerWise = ({ month, year }) => {
  return axios.get(
    `${base_url}/attendance/getAttendanceMisHrWise?hrEmpCode=${sessionEmpCode}&month=${month}&year=${year}`
  );
};

// 34. Get Outsource Emp Details By Level
export const getOutsourceEmpByLevel = (payload) => {
  return axios.post(base_url + '/outsource/getEmployeesByLevel', payload);
};

// 35. Get Outsource Emp Details By Level
export const getOutsourceEmpByEmpCode = (payload) => {
  return axios.post(base_url + '/outsource/getEmployeesByLevel', payload);
};

// 36. Get Outsource Employee Details for Update
export const getOutsourceEmployee = (empCode) => {
  return axios.get(base_url + `/outsource/getEmployeeByEmpCode/${empCode}`);
};

// 37. Verify Employee By HR
export const getEmpForVerification = () => {
  return axios.get(
    base_url + `/outsource/findEmpPendingAtHr?empCode=${sessionEmpCode}`
  );
};

// 38. Black list Outsource Emp
export const employeeBlacklist = (payload) => {
  return axios.post(base_url + '/outsource/saveOutsourceBlacklisted', payload);
};

// 39. Blacklisted Employee Records
export const getBlackListedEmp = (regionId, circleId) => {
  return axios.get(
    `${base_url}/outsource/getBlacklistedList?regionId=${regionId}&circleId=${circleId}`
  );
};

// 40. Day Wise Attendance MIS Outsource
export const getDayWiseAttendanceOutsource = (
  regionId,
  circleId,
  punchDate
) => {
  return axios.get(
    `${base_url}/outsource/getOutsourceSingleDateMis?regionId=${regionId}&circleId=${circleId}&punchDate=${punchDate}`
  );
};

// 41. Employee Master Outsource
export const getEmpMasterOutsource = (regionId, circleId) => {
  return axios.get(
    `${base_url}/outsource/getOutsourceEmployeeMis?regionId=${regionId}&circleId=${circleId}`
  );
};

// 42. Leave Allocation Outsource
export const leaveAllocationOutsource = (payload) => {
  return axios.post(base_url + '/outsource/getLeaveBalanceByLevel', payload);
};

// 43. Get Employee Shifts
export const getShifts = () => {
  return axios.get(`${base_url}/master/getAllShifts`);
};

// 44. Get Outsource Designations
export const getOutDesignations = () => {
  return axios.get(`${base_url}/master/getOutDesignations`);
};

// 45. Get Holidays List
export const getHolidays = () => {
  return axios.get(`${base_url}/master/getAllHolidayTypes`);
};

// 46. Get Attendance Locations by Regions-Substations
export const getAttendanceLocation = (payload) => {
  return axios.post(base_url + '/location/getLocationByLevel', payload);
};

// 47. Get Reporting Officer's Designation
export const getRoDesignation = () => {
  return axios.get(base_url + '/employee/getRoDesignation');
};

// 48. Get Reporting Officer's Name by Designation
export const getRoNameByRoId = (roId) => {
  return axios.get(base_url + `/employee/getRoByDesignationId/${roId}`);
};

// 49. Get HR Manager's
export const getHrManager = () => {
  return axios.get(base_url + `/employee/getAllHrManager`);
};

// 50. Update Employee Details for Outsource
export const updateVerifyOutEmployee = (payload) => {
  return axios.post(base_url + '/outsource/updateEmployee  ', payload);
};

// Employee Services Outsource
// 51. Get Punishment Types
export const getPunishmentType = () => {
  return axios.get(base_url + `/master/findAllPunishmentTypes`);
};

// 52. Assign Punishment to Employee
export const updatePunishment = (payload) => {
  return axios.post(base_url + '/outsource/savePunishment', payload);
};

// 53. Get Employee Punishments Records by EmpCode
export const getEmpPunishments = (empCode) => {
  return axios.get(
    base_url + `/outsource/getPunishmentDetailsByEmpCode?empCode=${empCode}`
  );
};

// 54. Get Complaint Types
export const getComplaintType = () => {
  return axios.get(
    base_url +
      `/master/getAllComplaints
  `
  );
};

// 55. Register Complaint to Employee outsource
export const updateComplaint = (payload) => {
  return axios.post(base_url + '/outsource/saveComplaint', payload);
};

// 56. View Complaint Details by Empcode
export const getEmpComplaints = (empCode) => {
  return axios.get(
    base_url + `/outsource/getComplaintDetailByEmpCode?empCode=${empCode}`
  );
};

// 57. Upload Wireman Certificate for Outsource Employee
export const uploadWiremanCertificate = (payload) => {
  return axios.post(base_url + '/outsource/uploadWiremanCertificate', payload);
};

// 58. Download Wireman Certificate for Outsource Employee
export const downloadWiremanCertificate = (empCode) => {
  return axios.get(
    base_url + `/outsource/getWirmanCertificateByEmpCode?empCode=${empCode}`
  );
};

// 59. Detele Wireman Certificate for Outsource Employee
export const deleteWiremanCertificate = (payload) => {
  return axios.post(base_url + '/outsource/cancelWiremanCertificate', payload);
};

// 60. Training for Outsource Employee
export const outsourceEmpTraning = (payload) => {
  return axios.post(base_url + '/outsource/saveNewTrainingDetails', payload);
};

// 61. View Outsource Employee Training by Empcode
export const getEmployeeTrainings = (empCode) => {
  return axios.get(
    base_url + `/outsource/getTrainingDetailsByEmp?empCode=${empCode}`
  );
};

// 62. Get Employee Places Of Postings Records
export const getOutsourcePlaceOfPosting = (empCode) => {
  return axios.get(
    base_url + `/outsource/getOutsourcePostingApi?empCode=${empCode}`
  );
};

// 63. Update Places of Postings Outsource
export const submitOutsourcePlaceOfPosting = (payload) => {
  return axios.post(base_url + '/outsource/outsourcePostingApi', [payload]);
};

// Employee Sections
// 64. Regular Employee Leave Balance
export const getEmployeeLeaveBalance = () => {
  return axios.get(
    base_url + `/leave/getLeaveBalancesByEmpCode/${sessionEmpCode}`
  );
};

// 65. Employee Leave's
export const viewEmpAttendanceBySessionCode = (month, year) => {
  return axios.get(
    base_url +
      `/attendance/getMonthWiseAttendanceEmp?empCode=${sessionEmpCode}&month=${month}&year=${year}`
  );
};

// 65. Apply Corrections
export const applyCorrections = (payload) => {
  return axios.post(base_url + '/attendance/applyCorrection', payload);
};

// 66. Apply Employee Leave's
export const applyLeaves = (payload) => {
  return axios.post(base_url + '/leave/applyLeave', payload);
};

// 67. See Correction and Leave For Reporting Officer
export const getCorrectionsByRoId = (month, year) => {
  return axios.get(
    base_url +
      `/employee/getEmpApplicationsByRoId?roEmpCode=${sessionEmpCode}&month=${month}&year=${year}`
  );
};

// 68. get Employee Attendance Summary
export const getEmpAttSummary = (empCode, month, year) => {
  return axios.get(
    base_url +
      `/attendance/getAttendanceSummaryEmp?empCode=${empCode}&month=${month}&year=${year}`
  );
};

// 69. Get Correction By Empcode for Approval
export const getEmpCorrectionsDetails = (empCode, month, year) => {
  return axios.get(
    base_url +
      `/attendance/getPendingCorrections?empCode=${empCode}&month=${month}&year=${year}`
  );
};

// 70. Approve Leave
export const approveLeave = (payload) => {
  return axios.post(base_url + '/leave/approveLeave', payload);
};

// 71. Approve Corrections
export const approveCorrections = (payload) => {
  return axios.post(base_url + '/attendance/approveCorrection', payload);
};

// 72. Get Employee Tagged to RO for Shift Change
export const getEmpShiftByRo = () => {
  return axios.get(
    base_url + `/employee/getEmployeesByRoId?roEmpCode=${sessionEmpCode}`
  );
};

// 73. Employee Shift by Code
export const getEmpShiftByCode = (empCode) => {
  return axios.get(base_url + `/employee/getShiftByEmpCode?empCode=${empCode}`);
};

// 74. Update Employee Shift
export const updateEmpShift = (payload) => {
  return axios.post(base_url + '/employee/changeShiftByEmpCode', payload);
};

// 75. Get Tagged Outsource Employee For Weekly Rest
export const getOutWeeklyRestEmp = () => {
  return axios.get(
    base_url + `/employee/getOutsourceEmpsByRoId?roEmpCode=${sessionEmpCode}`
  );
};

// 76. get Weekly Rest Assigned
export const getEmpWeeklyRest = (empCode) => {
  return axios.get(base_url + `/outsource/getWeeklyRest?empCode=${empCode}`);
};

// 77. Change Weekly Rest
export const updateWeeklyRestByRO = (payload) => {
  return axios.post(base_url + '/outsource/addWeeklyRest', payload);
};

// 78. Amount check by Designation Revenue
export const maxAmountByDesignation = (designationId, dcId) => {
  return axios.get(
    base_url +
      `/incentive/findMaxAmountDesg?designationId=${designationId}&dcId=${dcId}`
  );
};

// 79. get Emp Wallet Amount
export const empWalletAmount = () => {
  const currentMonthYear = new Date().toISOString().slice(0, 7);
  console.log(currentMonthYear);
  return axios.get(
    base_url +
      `/incentive/findMaxAmountLimit?empCode=${sessionEmpCode}&monthYear=${currentMonthYear}`
  );
};

// 80. get Heads
export const getIncentiveHeads = () => {
  return axios.get(base_url + `/incentive/findAllIncentiveHeads`);
};

// 81. get Vendors Armed Force
export const getVendorArmedForce = () => {
  return axios.get(base_url + `/incentive/vendorArmedForce`);
};

// 82.  Get All Vendors
export const getAllVendors = () => {
  return axios.get(base_url + `/master/findAllVendors`);
};

// 83. Request for RRAC
export const requestRRAC = (payload) => {
  return axios.post(base_url + '/incentive/saveIncentive', payload);
};

// 84. get Discontinuation Records
export const getDiscontinuationRecords = () => {
  return axios.get(base_url + `/incentive/getAllIncLocNotQualified`);
};

//  85. Remove Discontinuation Records
export const deleteDiscontinuationRecords = (id) => {
  return axios.put(`${base_url}/incentive/removeDisqualification`, null, {
    params: {
      id: id,
      updatedBy: sessionEmpCode,
    },
  });
};

// 86. add Discontinuation Records
export const updateDiscontinuationRecords = (payload) => {
  return axios.post(base_url + '/incentive/saveIncLocNotQualified', payload);
};

// 87. get Incentive Records
export const getIncentiveMisHostory = (monthYear) => {
  return axios.get(
    base_url + `/incentive/findIncentiveByLevel?monthYear=${monthYear}`
  );
};

// 88. get Incentive Records by Code
export const getIncentiveByCode = (monthYear) => {
  return axios.get(
    base_url +
      `/incentive/findIncentiveByEmpCode?empCode=${sessionEmpCode}&monthYear=${monthYear}`
  );
};

// 89. get Incentive by Ref no
export const getIncentiveByrefNo = (refNo) => {
  return axios.get(base_url + `/incentive/findIncentiveByRefNo?refNo=${refNo}`);
};

// 90. submit Incentive
export const submitExpenditure = (formData) => {
  return axios.post(base_url + '/incentive/saveExpenditure', formData);
};

// 91. get Incentive by RO
export const getExpenditureByRo = (monthYear) => {
  return axios.get(
    base_url +
      `/incentive/findIncentiveByRoEmpCode?roEmpCode=${sessionEmpCode}&monthYear=${monthYear}`
  );
};

// 92. Update Incentive Status  by RO
export const submitExpByRo = (payload) => {
  return axios.post(base_url + '/incentive/updateExpenditureRo', payload);
};

// 93. Feeder Management Update
export const submitFeederManagement = (payload) => {
  return axios.post(base_url + '/location/feederManagementApi', payload);
};

// 94. OPD/IPD Medical Submit
export const submitMedicalReimbursement = (formData) => {
  return axios.post(base_url + '/medical/saveMRDetail', formData);
  // return axios.post(
  //   "http://172.16.17.79:8084/e-Attendance/api/medical/saveMRDetail",
  //   formData
  // );
};

// 95. Get Current Grade Pay
export const currentGradePay = () => {
  return axios.get(base_url + `/hps/getGradePay`);
};

// 96. Immovable Property Submit
export const submitImmovableProperty = (payload) => {
  return axios.post(base_url + '/employee/immovablePropertyReturn', payload);
};

// 97. Immovable Property View
export const viewImmProperty = (year) => {
  return axios.get(
    base_url +
      `/employee/getPropertyReturn?empCode=${sessionEmpCode}&year=${year}`
  );
};

// 98. Get Daily Losses
export const getDailyLosses = (empCode, dcId) => {
  return axios.get(
    base_url + `/OnM/getSsoDailyLosses?empCode=${empCode}&dcId=${dcId}`
  );
};

// 98. Submit Daily Losses
export const submitDailyLosses = (payload) => {
  return axios.post(base_url + '/OnM/saveSsoDailyLosses', payload);
};

// 99. Get Shut down Details
export const getShutDown = (empCode, dcId) => {
  return axios.get(
    base_url + `/OnM/getSsoShutdown?empCode=${empCode}&dcId=${dcId}`
  );
};

// 100. Submit Shut down Details
export const submitShutDown = (payload) => {
  return axios.post(base_url + '/OnM/saveSsoShutdown', payload);
};

// 101. Get PTR Failure Details
export const getPtrFailure = (empCode) => {
  return axios.get(base_url + `/OnM/getPtrFailureByJe?empCode= ${empCode}`);
};

// 102. Submit PTR Failure Details
export const submitPtrFailure = (formData) => {
  return axios.post(base_url + '/OnM/savePtrFailure', formData);
};

// 103. Get SSO Authorization
export const getAuthorizationSso = (dcId) => {
  return axios.get(base_url + `/OnM/getAuthorizationSsoByDcId?dcId=${dcId}`);
};

// 104. Get SSO Details by DcId
export const getSsoByDCId = (dcId) => {
  return axios.get(base_url + `/OnM/getSsoByDc?dcId=302020102`);
};

// 105. Get Dgm By JE
export const getDgmByJe = (empCode) => {
  return axios.get(base_url + `/OnM/getDGMByJE?jeEmpCode=34520691`);
};

// 106. Submit Sso Authorization
export const submitSsoAuthorization = (payload) => {
  return axios.post(base_url + '/OnM/saveAutorizationSSO', payload);
};

// 107. Get Line Staff Authorization
export const getLineStaffAuth = (dcId) => {
  return axios.get(base_url + `/OnM/getAuthorizationLineByDcID?dcId=${dcId}`);
};

// 108. Get Line Staff By DcId
export const getLineByDcId = (dcId) => {
  return axios.get(base_url + `/OnM/getLineByDc?dcId=302020102`);
};

// 109. Submit Line staff Authorization
export const submitLineAuthorization = (payload) => {
  return axios.post(base_url + '/OnM/saveAutorizationLine', payload);
};

// 110. Get Medical for HR
export const getMedicalByHr = () => {
  return axios.get(
    // base_url + `/medical/getHrPending?hrEmpCode=${sessionEmpCode}`
    base_url + `/medical/getHrPending?hrEmpCode=150049`
  );
};

// 111. Medicine Details By Ref No
export const getMedicineDetailByRefNo = (refNo) => {
  return axios.get(
    base_url + `/medical/getMedicineDetailByRefNo?refNo=${refNo}`
  );
};

// 112. Submit Medical Hr Status
export const submitMedicalHrStatus = (payload) => {
  return axios.post(base_url + '/medical/updateHRStatus', payload);
};

// 113. Get Medical for Cmo
export const getMedicalByCmo = () => {
  return axios.get(base_url + `/medical/getCmoPending?cmoEmpCode=273471`);
};

// 114. Submit Medical Hr Status
export const submitMedicalCmoStatus = (payload) => {
  return axios.post(base_url + '/medical/updateCMOStatus', payload);
};

// 115. Get Medical For AO
export const getMedicalByAo = () => {
  return axios.get(
    // base_url + `/medical/getAoPending?aoEmpCode=${sessionEmpCode}`
    base_url + `/medical/getAoPending?aoEmpCode=12345`
  );
};

// 116. Submit Medical AO Status
export const submitMedicalAoStatus = (payload) => {
  return axios.post(base_url + '/medical/updateAOStatus', payload);
};

// 117. Get Medical Form by EmpCode
export const getMedicalFormByEmpCode = () => {
  return axios.get(
    base_url + `/medical/getEmpAppliByEmpCode?empCode=${sessionEmpCode}`
  );
};

// 118. Get Drug Details By Ref No.
export const getDrugDetails = (refNo) => {
  return axios.get(
    base_url + `/medical/getMedicineDetailByRefNo?refNo=${refNo}`
  );
};

// 119. Delete Drug Entries
export const deteleDrugDetails = (payload) => {
  return axios.post(base_url + '/medical/removeMedicineDetailApi', payload);
};

// 120. Update Medical by Employee
export const updateMedicalForm = (payload) => {
  return axios.put(base_url + '/medical/updateMRDetail', payload);
};

// 121. Submit Mediclaim for Employee
export const submitMediclaim = (payload) => {
  return axios.post(base_url + '/medical/saveMediClaim', payload);
};

// 122. get Employment Types
export const getEmploymentType = () => {
  return axios.get(base_url + `/master/getAllEmploymentTypes`);
};

// 123. Create New Employee
export const createNewEmployee = (payload) => {
  return axios.post(base_url + '/employee/saveNewEmployee', payload);
};
// https://attendance.mpcz.in:8888/E-Attendance/api/employee/saveNewEmployee

// 124. View Employee Information
export const getEmployeeInfo = (empCode) => {
  return axios.get(base_url + `/employee/getEmployeeByEmpCode/${empCode}`);
};

// 125. Get SSO List By Empcode
export const getSsoList = () => {
  return axios.get(base_url + `/master/ssoDashboard?empCode=290033`);
};

// 126. Employee Nomination
export const nominationSubmit = () => {
  return axios.put(
    base_url +
      `/employee/updateNominationSub?empCode=${sessionEmpCode}&isNominationSubmitted=true`
  );
};

// 127. Vigilance Login API
export const vigilanceLogin = (payload) => {
  return axios.post(
    'https://webapps.mpcz.in/vigilance/digi_webapis/vigilance_login_auth_api.php',
    payload
  );
};

// 128. Get Sso Authorization status for DGM
export const getSsoSatusByDgm = () => {
  return axios.get(
    base_url + `/OnM/getDGMPendingAuthorizationSSO?dgmEmpCode=9590217`
  );
};

// 129. Update Sso Authorization status for DGM
export const updateSsoSatusByDgm = (value, id, remark) => {
  return axios.put(
    base_url +
      `/OnM/updateDgmAuthorizationStatusSSO?status=${encodeURIComponent(
        value
      )}&authorizationId=${encodeURIComponent(id)}&remark=${encodeURIComponent(
        remark
      )}`
  );
};

// 130. Get Sso Authorization status for GM
export const getSsoSatusByGm = () => {
  return axios.get(
    base_url + `/OnM/getGMPendingAuthorizationSSO?gmEmpCode=85390317`
  );
};

// 131. Update Sso Authorization status for GM
export const updateSsoSatusByGm = (value, id, remark) => {
  return axios.put(
    base_url +
      `/OnM/updateGmAuthorizationStatusSSO?status=${encodeURIComponent(
        value
      )}&authorizationId=${encodeURIComponent(id)}&remark=${encodeURIComponent(
        remark
      )}
      `
  );
};

// 132. Get Line Staff status for DGM
export const getLineSatusByDgm = () => {
  return axios.get(
    base_url + `/OnM/getDGMPendingAuthorizationLine?dgmEmpCode=9590217`
  );
};

// 133. Update Line Staff status for DGM
export const updateLineSatusByDgm = (value, id, remark) => {
  return axios.put(
    base_url +
      `/OnM/updateDgmAuthorizationStatusLine?status=${encodeURIComponent(
        value
      )}&authorizationId=${encodeURIComponent(id)}&remark=${encodeURIComponent(
        remark
      )}`
  );
};

// 134. Get Line Staff status for GM
export const getLineSatusByGm = () => {
  return axios.get(
    base_url + `/OnM/getGMPendingAuthorizationLine?gmEmpCode=85390317`
  );
};

// 135. Update Line Staff status for GM
export const updateLineSatusByGm = (value, id, remark) => {
  return axios.put(
    base_url +
      `/OnM/updateGmAuthorizationStatusLine?status=${encodeURIComponent(
        value
      )}&authorizationId=${encodeURIComponent(id)}&remark=${encodeURIComponent(
        remark
      )}`
  );
};

// 136. Get PTR status for DGM
export const getPtrSatusByDgm = () => {
  return axios.get(base_url + `/OnM/getPtrFailureByDgm?dgmEmpCode=9300013`);
};

// 137. Update PTR status for DGM
export const updatePtrSatusByDgm = (payload) => {
  return axios.post(base_url + `/OnM/updatePtrFailureByDgm`, payload);
};

// 138. Get Additional Charges for Employee
export const getAdditionalCharges = (empCode) => {
  return axios.get(
    base_url + `/employee/getAdditionalChargesApi?empCode=${empCode}`
  );
};

// 139. Additional Charges for Employee
export const addAdditionalCharges = (payload) => {
  return axios.post(base_url + `/employee/additionalChargesApi`, payload);
};

// 140. Delete Additional Charges
export const deleteAdditionalCharges = (payload) => {
  return axios.post(base_url + `/employee/removeAdditionalChargesApi`, payload);
};

// 141. Update Employee Password
export const updatePassword = (payload) => {
  return axios.post(base_url + `/user-login/updatePassword`, payload);
};

// 142. Find Medical Claimed by Emp Code
export const getEmpMedicalClaim = () => {
  return axios.get(
    base_url + `/medical/findMediclaimByEmpCode?empCode=${sessionEmpCode}`
  );
};

// 143. Update Family Details in Medical Claim
export const updateFamilyInfoMedical = (payload) => {
  return axios.post(base_url + `/medical/updateMediClaimMember`, payload);
};

// https://attendance.mpcz.in:8888/E-Attendance/api/medical/updateMediClaimMember
