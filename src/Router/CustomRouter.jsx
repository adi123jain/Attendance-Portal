import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../Constants/Navbar/Index';

import Login from '../Components/User/Login';
// import Signup from '../Components/User/Signup';
import PrivateRoute from '../Router/PrivateRoute';
import PublicRoute from '../Router/PublicRoute';
import { AuthProvider } from '../Authentication/Context/AuthContext';
import Dashboard from '../Components/Dashboard/Index';
import ApplyAttendanceCorrection from '../Components/Regular Employee/Apply_Attendance_Correction/Index';
import CorrectionApplication from '../Components/Regular Employee/Correction_Application/Index';
import ShiftChange from '../Components/Regular Employee/Shift_Change/Index';
import PaySlip from '../Components/Regular Employee/Pay_Slip/Index';
import RRAC_Scheme from '../Components/Regular Employee/Request_For_RRAC_Scheme/Index';
import RRAC_MIS from '../Components/Regular Employee/RRAC_Scheme_MIS/Index';
import ViewExpenditure from '../Components/Regular Employee/Expenditure/View_Expenditure/Index';
import UploadExpenditureDocuments from '../Components/Regular Employee/Expenditure/Upload_Documents/Index';
import EditLocation from '../Components/HR Pannel/Attendance Location/Edit_Location/Index';
import CreateAttendanceLocation from '../Components/HR Pannel/Attendance Location/Create_Location/Index';
import UpdateLocation from '../Components/HR Pannel/Attendance Location/Update_Location/Index';
import LeaveAllocation from '../Components/HR Pannel/Leave_Allocation/Index';
import AttendanceView from '../Components/HR Pannel/Employee_Attendance_View/Index';
import MonthlyAttendanceView from '../Components/Reports/Monthly_Attendance_Sheet/Index';
import EmployeeMaster from '../Components/Reports/Employee_Master/Index';
import DayWiseAttendace from '../Components/Reports/Day_Wise_Attendance/Index';
import LeaveReports from '../Components/Reports/Leave_Reports/Index';
import MonthlyAttendannceOfficer from '../Components/Reports/Monthly_Attendance_Officers_Wise/Index';
import MMSKYattendance from '../Components/Reports/MMSKY_Attendance_Sheet/Index';
import OutsourceEmployeeInformation from '../Components/Outsource/Employee_Information/Index';
import HRverification from '../Components/Outsource/HR_Verification/Index';
import BlacklistEmployee from '../Components/Outsource/Blacklist_Employee/Index';
import ViewBlacklistedEmployee from '../Components/Outsource/View_Blacklisted_Employee/Index';
import MonthlyAttendaceOutsource from '../Components/Outsource/Monthly_Attendance/Index';
import OutsourceEmployeeData from '../Components/Outsource/Emloyee_Data/Index';
import OutsourceLeaveAllocation from '../Components/Outsource/Leave_Allocation/Index';
import OutsourceEmpAttendaceView from '../Components/Outsource/Employee_Attendance_View/Index';
import EmployeeInformation from '../Components/HR Pannel/Employee_Information/Index';
import EmployeePlaceOfPosting from '../Components/HR Pannel/Employee_Place_of_Postings/Index';
import FeederManagement from '../Components/HR Pannel/Feeder_Management/Index';
import DayWiseAttendanceOutsource from '../Components/Outsource/Day_Wise_Attendance/Index';
import UpdateVerifyEmployee from '../Components/Outsource/Update_Verification_Employee/Index';
import OutsourceEmployeeServices from '../Components/Outsource/Outsource_Employee_Services/Index';
import OutsourceEmployeeTraining from '../Components/Outsource/Employee_Training/Index';
import OutsourcePlaceOfPosting from '../Components/Outsource/Places_of_Posting/Index';
import CorrectionApproval from '../Components/Regular Employee/Correction_Approval/Index';
import CorrectionUpdateByRO from '../Components/Regular Employee/Correction_Approval_RO/Index';
import OutsourceEmpWeeklyRest from '../Components/Regular Employee/Weekly_Rest/Index';
import EmployeeForm16 from '../Components/Regular Employee/Form_16/Index';
import RRAC_Discontinuation from '../Components/Regular Employee/RRAC_Discontinuation/Index';
import ViewExpenditureByAuthority from '../Components/Regular Employee/Expenditure Approval By Authority/View_Expenditure_By_Authority/Index';
import ApproveExpenditureByAuthority from '../Components/Regular Employee/Expenditure Approval By Authority/Approve_Download_Docs/Index';
import MedicalReimbirsement from '../Components/Regular Employee/Medical_Reimbursement/Index';
import ImmovableProperty from '../Components/Regular Employee/Immovable_Property/Index';
import ImmovablePropertyView from '../Components/Regular Employee/View_Immovable_Property/Index';
import SsoDailyLosses from '../Components/Regular Employee/Sso_Daily_Losses/Index';
import SsoShutDown from '../Components/Regular Employee/Sso_Shutdown/Index';
import PowerTransformerReport from '../Components/Regular Employee/PTR_Failure/Index';
import SsoAuthorization from '../Components/Regular Employee/Sso_Authorization/Index';
import LineStaffAuthorization from '../Components/Regular Employee/LineStaff_Authorization/Index';
import MedicalApprovalByHr from '../Components/Regular Employee/Medical_Approvers/Hr_Approval/Index';
import MedicalApprovalByCmo from '../Components/Regular Employee/Medical_Approvers/Cmo_Approval/Index';
import MedicalApprovalByAo from '../Components/Regular Employee/Medical_Approvers/Ao_Approval/Index';
import MedicalFormView from '../Components/Regular Employee/Medical_Update_and_View/MedicalView';
import MedicalFormUpdate from '../Components/Regular Employee/Medical_Update_and_View/MedicalUpdate';
import MedicalHealthInsurance from '../Components/Regular Employee/Medical_Health_Insurance/Index';
import DataProvider from '../Components/HR Pannel/Add_New_Employee/DataProvider';
import UpdateDataContainer from '../Components/HR Pannel/Update_Employee_Information/UpdateDataContainer';
import HumanResourceDashboard from '../Components/Dashboards/Hr_Dashboard/Index';
import OperationmaintenanceDashboard from '../Components/Dashboards/O&M_Dashboard/Index';
import EmployeeDashboard from '../Components/Dashboards/Employee_Dashboard/Index';
import ReportingOfficerDashboard from '../Components/Dashboards/Reporting_Dashboard/Index';
// import SsoDashboard from '../Components/Dashboards/Sso_Dashboard/Index';
import DgmAuthorizationStatus from '../Components/Regular Employee/Sso_Authorization_Status/dgmStatus';
import GmAuthorizationStatus from '../Components/Regular Employee/Sso_Authorization_Status/gmStatus';
import DgmLineStaffStatus from '../Components/Regular Employee/LineStaff_Authorization_Status/dgmStatus';
import GmLineStaffStatus from '../Components/Regular Employee/LineStaff_Authorization_Status/gmStatus';
import DgmPtrStatus from '../Components/Regular Employee/PTR_Failure_Status/dgmStatus';
import AdditionalChargesEmployee from '../Components/HR Pannel/Employee_Additional_Charges/Index';
import ForgetPassword from '../Components/User/ForgetPassword';
import MedicalHealthInsuranceView from '../Components/Regular Employee/Medical_Health_Insurance_View/Index';
import HigherPayScale from '../Components/Regular Employee/Higher_Pay_Scale/Index';
import WiremanCertificateByHr from '../Components/HR Pannel/Wireman_Certificate/Index';
import UpdateWiremanCertificateStatus from '../Components/HR Pannel/View_Update_Wireman_Certificate/Index';
import MainDashboard from '../Components/Dashboards/Main_Dashboard';
import ProNews from '../Components/Regular Employee/Pro_News/Index';
import ProNewsEmployee from '../Components/Regular Employee/Pro_News_Employee/Index';
import ProNewsMD from '../Components/Regular Employee/Pro_News_MD/Index';
import ImmovablePropertyHr from '../Components/HR Pannel/Immovable_Proverty_Hr/Index';
import ImmovablePropertyInformation from '../Components/HR Pannel/Immovable_Property_Info/Index';
import CmHelplineExp from '../Components/Regular Employee/Cm_Compaint_Explaination/Index';
import CmHelplineExpDocument from '../Components/HR Pannel/Cm_Complaint_Exp_Document/Index';
function CustomRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          /> */}

          <Route
            path="/forgetPassword"
            element={
              <PublicRoute>
                <ForgetPassword />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navbar>
                  <Outlet />
                </Navbar>
              </PrivateRoute>
            }
          >
            {/* <Route path="/" element={<SsoDashboard />} /> */}
            <Route path="/" element={<MainDashboard />} />

            <Route path="ssoDashboard" element={<Dashboard />} />
            <Route path="employeeDashboard" element={<EmployeeDashboard />} />
            <Route
              path="reportingOfficerDashboard"
              element={<ReportingOfficerDashboard />}
            />
            <Route
              path="humanResourceDashboard"
              element={<HumanResourceDashboard />}
            />
            <Route
              path="operationMaintenanceDashboard"
              element={<OperationmaintenanceDashboard />}
            />

            {/* Employee Section */}
            <Route
              path="employeeInformation"
              element={<EmployeeInformation />}
            />
            <Route path="addNewEmployee" element={<DataProvider />} />
            <Route
              path="updateEmployeeInformation"
              element={<UpdateDataContainer />}
            />

            <Route
              path="attendanceCorrection"
              element={<ApplyAttendanceCorrection />}
            />
            <Route
              path="correctionApplication"
              element={<CorrectionApplication />}
            />
            <Route path="correctionApproval" element={<CorrectionApproval />} />
            <Route
              path="correctionApprovalRO"
              element={<CorrectionUpdateByRO />}
            />

            <Route path="proNews" element={<ProNews />} />
            <Route path="proNewsEmployee" element={<ProNewsEmployee />} />
            <Route path="proNewsMD" element={<ProNewsMD />} />

            <Route path="shiftChange" element={<ShiftChange />} />
            <Route path="paySlip" element={<PaySlip />} />
            <Route
              path="outsourceWeeklyRest"
              element={<OutsourceEmpWeeklyRest />}
            />
            <Route path="employeeForm16" element={<EmployeeForm16 />} />

            <Route path="requestForRRAC" element={<RRAC_Scheme />} />
            <Route
              path="RRACdiscontinuation"
              element={<RRAC_Discontinuation />}
            />

            <Route path="RRACMIS" element={<RRAC_MIS />} />
            <Route path="viewExpenditure" element={<ViewExpenditure />} />
            <Route
              path="uploadExpenditureDocs"
              element={<UploadExpenditureDocuments />}
            />
            <Route
              path="viewExpenditureByAuthority"
              element={<ViewExpenditureByAuthority />}
            />
            <Route
              path="approveExpenditureByAuthority"
              element={<ApproveExpenditureByAuthority />}
            />
            <Route
              path="medicalReimbursement"
              element={<MedicalReimbirsement />}
            />
            <Route
              path="medicalReimbursementView"
              element={<MedicalFormView />}
            />

            <Route
              path="medicalHealthInsurance"
              element={<MedicalHealthInsurance />}
            />
            <Route
              path="medicalHealthInsuranceView"
              element={<MedicalHealthInsuranceView />}
            />

            <Route
              path="medicalReimbursementUpdate"
              element={<MedicalFormUpdate />}
            />

            <Route path="immovableProperty" element={<ImmovableProperty />} />
            <Route
              path="immovablePropertyInfo"
              element={<ImmovablePropertyInformation />}
            />
            <Route
              path="immovablePropertyView"
              element={<ImmovablePropertyView />}
            />

            <Route path="dailyLosses" element={<SsoDailyLosses />} />
            <Route path="ssoShutDown" element={<SsoShutDown />} />
            <Route
              path="powerTransformerReport"
              element={<PowerTransformerReport />}
            />
            <Route path="ssoAuthorization" element={<SsoAuthorization />} />
            <Route
              path="lineStaffAuthorization"
              element={<LineStaffAuthorization />}
            />

            <Route
              path="dgmAuthorizationStatus"
              element={<DgmAuthorizationStatus />}
            />

            <Route
              path="gmAuthorizationStatus"
              element={<GmAuthorizationStatus />}
            />

            <Route path="dgmLineStaffStatus" element={<DgmLineStaffStatus />} />

            <Route path="gmLineStaffStatus" element={<GmLineStaffStatus />} />
            <Route path="dgmPtrStatus" element={<DgmPtrStatus />} />
            <Route path="higherPayScale" element={<HigherPayScale />} />
            <Route path="cmHelplineExp" element={<CmHelplineExp />} />
            <Route
              path="cmHelplineExpDoc"
              element={<CmHelplineExpDocument />}
            />

            {/* HR Section */}
            <Route path="editLocation" element={<EditLocation />} />
            <Route
              path="createLocation"
              element={<CreateAttendanceLocation />}
            />
            <Route path="updateLocation" element={<UpdateLocation />} />
            <Route path="leaveAllocation" element={<LeaveAllocation />} />
            <Route path="employeeAttendanceView" element={<AttendanceView />} />
            <Route
              path="employeePosting"
              element={<EmployeePlaceOfPosting />}
            />
            <Route
              path="additionalCharges"
              element={<AdditionalChargesEmployee />}
            />

            <Route path="feederManagement" element={<FeederManagement />} />
            <Route
              path="medicalApprovalByHr"
              element={<MedicalApprovalByHr />}
            />
            <Route
              path="medicalApprovalByCmo"
              element={<MedicalApprovalByCmo />}
            />
            <Route
              path="medicalApprovalByAo"
              element={<MedicalApprovalByAo />}
            />

            <Route
              path="wiremanCertificate"
              element={<WiremanCertificateByHr />}
            />

            <Route
              path="updateWiremanCertificate"
              element={<UpdateWiremanCertificateStatus />}
            />

            <Route
              path="immovablePropertyHr"
              element={<ImmovablePropertyHr />}
            />

            {/* Report Section */}
            <Route
              path="monthlyAttendance"
              element={<MonthlyAttendanceView />}
            />
            <Route path="employeeMaster" element={<EmployeeMaster />} />
            <Route path="dayWiseAttendance" element={<DayWiseAttendace />} />
            <Route path="leaveReport" element={<LeaveReports />} />
            <Route
              path="monthlyAttendannceOfficerWise"
              element={<MonthlyAttendannceOfficer />}
            />
            <Route path="MMSKYattendance" element={<MMSKYattendance />} />
            {/* Outsource Employee */}
            <Route
              path="outsourceEmployeeInfo"
              element={<OutsourceEmployeeInformation />}
            />
            <Route path="hrVerification" element={<HRverification />} />
            <Route
              path="updateVerifyEmployee"
              element={<UpdateVerifyEmployee />}
            />

            <Route path="blacklistEmployee" element={<BlacklistEmployee />} />
            <Route
              path="viewBlacklistedEmployee"
              element={<ViewBlacklistedEmployee />}
            />

            <Route
              path="monthlyAttendaceOutsource"
              element={<MonthlyAttendaceOutsource />}
            />

            <Route
              path="outsourceMIS"
              element={<DayWiseAttendanceOutsource />}
            />
            <Route
              path="outsourceEmployeeData"
              element={<OutsourceEmployeeData />}
            />

            <Route
              path="outsourceLeaveAllocation"
              element={<OutsourceLeaveAllocation />}
            />

            <Route
              path="outsourceEmployeeAttendaceView"
              element={<OutsourceEmpAttendaceView />}
            />

            <Route
              path="outsourceEmployeeServices"
              element={<OutsourceEmployeeServices />}
            />

            <Route
              path="outsourceEmployeeTraining"
              element={<OutsourceEmployeeTraining />}
            />

            <Route
              path="outsourceEmployeePosting"
              element={<OutsourcePlaceOfPosting />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default CustomRouter;
