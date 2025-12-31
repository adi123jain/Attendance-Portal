import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Material Icons
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function EmployeeDashboard() {
  const menuItems = [
    {
      label: 'Apply Attendance Correction',
      path: '/attendanceCorrection',
      icon: <EditCalendarIcon />,
    },
    { label: 'Pay Slip', path: '/paySlip', icon: <ReceiptLongIcon /> },
    {
      label: 'Employee Form-16',
      path: '/employeeForm16',
      icon: <DescriptionIcon />,
    },
    {
      label: 'Informer Scheme',
      path: `https://webapps.mpcz.in/vigilance/informer_hr_dashboard?empID=${sessionStorage.getItem(
        'empCode',
      )}`,
      external: true,
      icon: <SecurityIcon />,
    },
    {
      label: 'Medical Reimbursement',
      path: '/medicalReimbursement',
      icon: <LocalHospitalIcon />,
    },
    {
      label: 'Medical Reimbursement View',
      path: '/medicalReimbursementView',
      icon: <VisibilityIcon />,
    },
    {
      label: 'MP Power Company Cashless Health Scheme',
      path: '/medicalHealthInsurance',
      icon: <HealthAndSafetyIcon />,
    },

    {
      label: 'MP Power Company Cashless Health Scheme View',
      path: '/medicalHealthInsuranceView',
      icon: <HealthAndSafetyIcon />,
    },
    {
      label: 'Immovable Property',
      path: '/immovableProperty',
      icon: <HomeWorkIcon />,
    },
    {
      label: 'Immovable Property View',
      path: '/immovablePropertyView',
      icon: <VisibilityIcon />,
    },
    {
      label: 'Medical CMO Approval',
      path: '/medicalApprovalByCmo',
      icon: <VerifiedUserIcon />,
    },
    {
      label: 'Medical AO Approval',
      path: '/medicalApprovalByAo',
      icon: <AssignmentTurnedInIcon />,
    },

    {
      label: 'Higher Pay Scale',
      path: '/higherPayScale',
      icon: <AssignmentTurnedInIcon />,
    },
  ];

  const empCode = sessionStorage.getItem('empCode');
  const designationId = Number(sessionStorage.getItem('designationId'));
  const isManagerHr = sessionStorage.getItem('isManagerHr');

  const showInformerScheme =
    designationId === 13 || empCode === '12345' || isManagerHr === true;
  const showCmoApproval = designationId === 13 || empCode === '12345';
  const showAoApproval = designationId === 18 || empCode === '12345';

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
          Employee Dashboard
        </Typography>
      </motion.div>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: 1100, mx: 'auto' }}
      >
        {menuItems.map((item, index) => {
          // Informer Scheme condition
          if (item.label === 'Informer Scheme' && !showInformerScheme) {
            return null;
          }

          // CMO Approval condition
          if (item.label === 'Medical CMO Approval' && !showCmoApproval) {
            return null;
          }

          // AO Approval condition
          if (item.label === 'Medical AO Approval' && !showAoApproval) {
            return null;
          }

          const linkProps = item.external
            ? { component: 'a', href: item.path, target: '_blank' }
            : { component: Link, to: item.path };

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  {...linkProps}
                  sx={{
                    height: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 3,
                    textDecoration: 'none',
                    boxShadow: 2,
                    background:
                      'linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%)',
                    color: '#0d47a1',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e8f0fe',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 48,
                      color: '#1a237e',
                      mb: 1,
                      '& svg': { fontSize: 48 },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      px: 2,
                      color: '#333',
                      fontFamily: 'Roboto, serif',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default EmployeeDashboard;
