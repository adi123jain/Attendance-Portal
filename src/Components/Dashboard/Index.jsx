import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/Folder';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../App.css';
import { Tooltip } from '@mui/material';
import NominationDeclarationModal from '../Regular Employee/Nomination_Declaration/Index';

function Dashboard() {
  return (
    <div style={{ marginBottom: '30px' }}>
      <Grid
        container
        justifyContent="center"
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: 3,
          fontFamily: 'serif',
        }}
      >
        <NominationDeclarationModal />
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{
              maxWidth: 345,
              mx: 'auto',
              boxShadow: 3,
            }}
          >
            <CardMedia
              sx={{ height: 250 }}
              image="/assets/Employee.jpg"
              title="Employee"
            />

            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  textAlign: 'center',
                  color: '#1a237e',
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px #000000',
                }}
                color="primary"
              >
                Employee
              </Typography>
              <Divider />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="attendanceCorrection">
                    <b>Apply Attendance Correction</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="correctionApplication">
                    <b>Correction Application</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="shiftChange">
                    <b>Shift Change</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceWeeklyRest">
                    <b>Weekly Rest (Outsource)</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="paySlip">
                    <b>Pay Slip</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="employeeForm16">
                    <b>Employee Form-16</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="requestForRRAC">
                    <b>Request for Revenue Realization & Commercial Activity</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="RRACdiscontinuation">
                    <b> Discontinuation of Delegation of Revenue Realisation</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="RRACMIS">
                    <b>Revenue Realization & Commercial Activity (MIS)</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="https://attendance.mpcz.in:8084/E_Attendance_rebuild/media/SOP%20of%20Revenue%20Realization%20and%20Commercial%20Activity.docx">
                    <b>SOP for Revenue Realization & Commercial Activity</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="viewExpenditure">
                    <b>
                      Expenditure Booking Against Revenue Realization and
                      Commercial Activity
                    </b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="viewExpenditureByAuthority">
                    <b>Approve Expenditure</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="https://attendance.mpcz.in:8888/E-Attendance/api/incentive/getFundDocument">
                    <Tooltip
                      title="click to Download In Excel Sheet"
                      placement="top"
                      arrow
                    >
                      <b>
                        {' '}
                        Evaluation Parameters against Revenue Realization and
                        Commercial parameters
                      </b>
                    </Tooltip>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalReimbursement">
                    <b>Medical Reimbursement</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalReimbursementView">
                    <b>Medical Reimbursement View</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalHealthInsurance">
                    <b>MP Power Company Cashless Health Scheme</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalHealthInsuranceView">
                    <b>MP Power Company Cashless Health Scheme View</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="immovableProperty">
                    <b> Immovable Property</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="immovablePropertyView">
                    <b> Immovable Property View</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="dailyLosses">
                    <b> SSO Daily Losses</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="ssoShutDown">
                    <b> SSO Shutdown</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="powerTransformerReport">
                    <b> Power Transformer Report</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="ssoAuthorization">
                    <b> SSO Authorization</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="lineStaffAuthorization">
                    <b> Line Staff Authorization</b>
                  </Link>
                </ListItem>
                <Divider />
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ maxWidth: 345, mx: 'auto', boxShadow: 3 }}>
            <CardMedia
              sx={{ height: 250 }}
              image="/assets/HR.jpg"
              title="HR Pannel"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  textAlign: 'center',
                  color: '#1a237e',
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px #000000',
                }}
                color="primary"
              >
                HR Panel
              </Typography>
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="employeeInformation">
                    <b>Employee Information</b>
                  </Link>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="editLocation">
                    <b>View/Edit Attendance Location</b>
                  </Link>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="createLocation">
                    <b>Create Attendance Location</b>
                  </Link>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="leaveAllocation">
                    <b>Leave Allocation</b>
                  </Link>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="employeeAttendanceView">
                    <b>Employee Attendance View</b>
                  </Link>
                </ListItem>

                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="feederManagement">
                    <b>Feeder Management</b>
                  </Link>
                </ListItem>

                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalApprovalByHr">
                    <b>Medical Hr Approval</b>
                  </Link>
                </ListItem>

                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalApprovalByCmo">
                    <b>Medical CMO Approval</b>
                  </Link>
                </ListItem>

                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="medicalApprovalByAo">
                    <b>Medical AO Approval</b>
                  </Link>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ maxWidth: 345, mx: 'auto', boxShadow: 3 }}>
            <CardMedia
              sx={{ height: 250 }}
              image="/assets/Reports.jpg"
              title="Reports"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  textAlign: 'center',
                  color: '#1a237e',
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px #000000',
                }}
                color="primary"
              >
                Reports
              </Typography>
              <Divider />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="monthlyAttendance">
                    <b>Monthly Attendance Sheet</b>
                  </Link>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="employeeMaster">
                    <b>Employee Masters</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="dayWiseAttendance">
                    <b>Day-Wise Attendance Sheet</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="leaveReport">
                    <b>Leave Reports</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="monthlyAttendannceOfficerWise">
                    <b>Monthly Sheet Attendance Officer Wise</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="MMSKYattendance">
                    <b>MMSKY Monthly Attendance Sheet</b>
                  </Link>
                </ListItem>
                <Divider />
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ maxWidth: 345, mx: 'auto', boxShadow: 3 }}>
            <CardMedia
              sx={{ height: 250 }}
              image="/assets/Outsource.jpg"
              title="Outsource(Employee)"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  textAlign: 'center',
                  color: '#1a237e',
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px #000000',
                }}
              >
                Outsource (Employee)
              </Typography>
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceEmployeeInfo">
                    <b> Employee Information (Outsource)</b>
                  </Link>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="HRverification">
                    <b>Pending for HR Verification</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="blacklistEmployee">
                    <b>Blacklist Employee</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="viewBlacklistedEmployee">
                    <b>View Blacklisted Employee's</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="monthlyAttendaceOutsource">
                    <b>Monthly Attendance Sheet</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceMIS">
                    <b>Day-Wise Attendance</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceEmployeeData">
                    <b>Employee Data</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceLeaveAllocation">
                    <b>Leave Allocation (Outsource)</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceEmployeeAttendaceView">
                    <b>Employee Attendance View (Outsource)</b>
                  </Link>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <Link to="outsourceEmployeeServices">
                    <b>Employee Services</b>
                  </Link>
                </ListItem>

                <Divider />
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
