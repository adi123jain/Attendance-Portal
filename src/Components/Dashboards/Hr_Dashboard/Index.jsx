import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Tooltip,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import InfoIcon from '@mui/icons-material/Info';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { motion } from 'framer-motion';

function HumanResourceDashboard() {
  const hrCards = [
    {
      title: 'HR Panel',
      icon: <PeopleAltIcon fontSize="large" sx={{ color: '#1976d2' }} />,
      links: [
        {
          name: 'Employee Information',
          to: '/employeeInformation',
          icon: <InfoIcon />,
        },
        {
          name: 'View/Edit Attendance Location',
          to: '/editLocation',
          icon: <EditLocationAltIcon />,
        },
        {
          name: 'Create Attendance Location',
          to: '/createLocation',
          icon: <AddLocationAltIcon />,
        },
        {
          name: 'Leave Allocation',
          to: '/leaveAllocation',
          icon: <AssignmentTurnedInIcon />,
        },
        {
          name: 'Employee Attendance View',
          to: '/employeeAttendanceView',
          icon: <VisibilityIcon />,
        },
        {
          name: 'Feeder Management',
          to: '/feederManagement',
          icon: <ManageAccountsIcon />,
        },
        {
          name: 'Medical Reimbursement HR Approval',
          to: '/medicalApprovalByHr',
          icon: <CheckCircleOutlineIcon />,
        },

        {
          name: 'Revenue Realization & Commercial Activity (MIS)',
          to: '/RRACMIS',
          icon: <AssessmentIcon />,
        },
      ],
    },
    {
      title: 'Reports',
      icon: <AssessmentIcon fontSize="large" sx={{ color: '#388e3c' }} />,
      links: [
        {
          name: 'Monthly Attendance Sheet',
          to: '/monthlyAttendance',
          icon: <AssignmentIcon />,
        },
        {
          name: 'Employee Masters',
          to: '/employeeMaster',
          icon: <PeopleAltIcon />,
        },
        {
          name: 'Day-Wise Attendance Sheet',
          to: '/dayWiseAttendance',
          icon: <CalendarMonthIcon />,
        },
        {
          name: 'Leave Reports',
          to: '/leaveReport',
          icon: <AssignmentTurnedInIcon />,
        },
        {
          name: 'Monthly Sheet Officer Wise',
          to: '/monthlyAttendannceOfficerWise',
          icon: <AssignmentIcon />,
        },
        {
          name: 'MMSKY Monthly Attendance',
          to: '/MMSKYattendance',
          icon: <CalendarMonthIcon />,
        },
      ],
    },
    {
      title: 'Outsource (Employee)',
      icon: <BusinessCenterIcon fontSize="large" sx={{ color: '#8e24aa' }} />,
      links: [
        {
          name: 'Employee Information (Outsource)',
          to: '/outsourceEmployeeInfo',
          icon: <InfoIcon />,
        },
        {
          name: 'Pending for HR Verification',
          to: '/HRverification',
          icon: <CheckCircleOutlineIcon />,
        },
        {
          name: 'Blacklist Employee',
          to: '/blacklistEmployee',
          icon: <BlockIcon />,
        },
        {
          name: 'View Blacklisted Employees',
          to: '/viewBlacklistedEmployee',
          icon: <VisibilityOffIcon />,
        },
        {
          name: 'Monthly Attendance Sheet',
          to: '/monthlyAttendaceOutsource',
          icon: <CalendarMonthIcon />,
        },
        {
          name: 'Day-Wise Attendance',
          to: '/outsourceMIS',
          icon: <AssignmentIcon />,
        },
        {
          name: 'Employee Data',
          to: '/outsourceEmployeeData',
          icon: <PeopleAltIcon />,
        },
        {
          name: 'Leave Allocation (Outsource)',
          to: '/outsourceLeaveAllocation',
          icon: <AssignmentTurnedInIcon />,
        },
        {
          name: 'Employee Attendance View',
          to: '/outsourceEmployeeAttendaceView',
          icon: <VisibilityIcon />,
        },
        // {
        //   name: 'Employee Services',
        //   to: '/outsourceEmployeeServices',
        //   icon: <ManageAccountsIcon />,
        // },

        // {
        //   name: 'Wireman Certificate',
        //   to: '/wiremanCertificate',
        //   icon: <AssignmentTurnedInIcon />,
        // },

        // {
        //   name: 'Update Wireman Certificate',
        //   to: '/updateWiremanCertificate',
        //   icon: <InfoIcon />,
        // },
      ],
    },
  ];

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          gutterBottom
          variant="h3"
          sx={{
            textAlign: 'center',
            color: '#0d47a1',
            fontWeight: 'bold',
            mb: 4,
            fontFamily: 'serif',
          }}
        >
          Human Resources (HR) Manager Section
        </Typography>
      </motion.div>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          p: 4,
        }}
      >
        {hrCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              width: 320,
              boxShadow: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%)',
              color: '#0d47a1',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: 8,
                backgroundColor: '#e3f2fd',
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mb: 1,
                }}
              >
                {card.icon}
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    color: '#0d47a1',
                    fontWeight: 'bold',
                    fontFamily: 'serif',
                    textAlign: 'center',
                  }}
                >
                  {card.title}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Box>
                {card.links.map((item, idx) => (
                  <Tooltip key={idx} title={item.name} arrow>
                    <Box
                      component={Link}
                      to={item.to}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1,
                        borderRadius: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: '#bbdefb',
                        },
                      }}
                    >
                      {item.icon}
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', fontFamily: 'serif' }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default HumanResourceDashboard;
