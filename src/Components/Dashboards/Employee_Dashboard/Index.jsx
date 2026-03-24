import { useState, useEffect } from 'react';
import { Card, Typography, Grid, Box } from '@mui/material';
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
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import SavedSearchOutlinedIcon from '@mui/icons-material/SavedSearchOutlined';

function EmployeeDashboard() {
  const [empCode, setEmpCode] = useState(null);
  const [designationId, setDesignationId] = useState(null);
  const [isManagerHr, setIsManagerHr] = useState(false);

  const token = sessionStorage.getItem('token');

  let showPropertyMenus = false;
  let regionId = '';

  if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = JSON.parse(atob(base64));
    const designationClass = decodedData?.designation?.designationClass;
    // console.log(decodedData?.region?.regionId);
    regionId = decodedData?.region?.regionId;
    // console.log(isManagerHr);

    // Condition
    if ([1, 2, 3].includes(Number(designationClass))) {
      showPropertyMenus = true;
    }
  }

  useEffect(() => {
    setEmpCode(sessionStorage.getItem('empCode'));
    setDesignationId(Number(sessionStorage.getItem('designationId')));
    setIsManagerHr(sessionStorage.getItem('isManagerHr') === 'true');
  }, []);

  const menuItems = [
    {
      label: 'Apply Attendance Correction',
      path: '/attendanceCorrection',
      icon: <EditCalendarIcon color="action" />,
    },
    { label: 'Pay Slip', path: '/paySlip', icon: <ReceiptLongIcon /> },
    {
      label: 'Employee Form-16',
      path: '/employeeForm16',
      icon: <DescriptionIcon color="primary" />,
    },
    {
      label: 'Informer Scheme',
      path: `https://webapps.mpcz.in/vigilance/informer_hr_dashboard?empID=${empCode}`,
      external: true,
      icon: <SecurityIcon color="secondary" />,
    },
    {
      label: 'Revenue Realization & Commercial Activity (MIS)',
      path: '/RRACMIS',
      icon: <AssessmentIcon color="success" />,
    },
    {
      label: 'Medical Reimbursement',
      path: '/medicalReimbursement',
      icon: <LocalHospitalIcon color="info" />,
    },
    {
      label: 'Medical Reimbursement View',
      path: '/medicalReimbursementView',
      icon: <VisibilityIcon color="warning" />,
    },
    // {
    //   label: 'MP Power Company Cashless Health Scheme',
    //   path: '/medicalHealthInsurance',
    //   icon: <HealthAndSafetyIcon color="error" />,
    // },
    {
      label: 'MP Power Company Cashless Health Scheme View',
      path: '/medicalHealthInsuranceView',
      icon: <HealthAndSafetyIcon color="primary" />,
    },
    {
      label: 'Immovable Property Return',
      path: '/immovableProperty',
      icon: <HomeWorkIcon color="secondary" />,
    },
    {
      label: 'Immovable Property Return View',
      path: '/immovablePropertyView',
      icon: <VisibilityIcon color="success" />,
    },
    {
      label: 'Medical Reimbursement CMO Approval',
      path: '/medicalApprovalByCmo',
      icon: <VerifiedUserIcon color="action" />,
    },
    {
      label: 'Medical Reimbursement AO Approval',
      path: '/medicalApprovalByAo',
      icon: <AssignmentTurnedInIcon color="info" />,
    },

    {
      label: 'News Entries',
      path: '/proNews',
      icon: <LibraryAddIcon color="error" />,
    },

    {
      label: 'News Reply',
      path: '/proNewsEmployee',
      icon: <ReplyAllIcon color="warning" />,
    },

    {
      label: 'News Comment (MD)',
      path: '/proNewsMD',
      icon: <HealthAndSafetyIcon color="secondary" />,
    },

    // {
    //   label: 'CM Helpline',
    //   path: '/cmHelplineExp',
    //   icon: <HealthAndSafetyIcon color="error" />,
    // },

    {
      label: 'Employee Search',
      path: '/employeeSearch',
      icon: <SavedSearchOutlinedIcon color="info" />,
    },

    // {
    //   label: 'Higher Pay Scale',
    //   path: '/higherPayScale',
    //   icon: <AssignmentTurnedInIcon color='primary' />,
    // },
  ];

  // Conditions (now reliable)
  const showInformerScheme =
    designationId === 13 || empCode === '12345' || isManagerHr;

  const showCmoApproval = designationId === 18 || empCode === '12345';
  const showAoApproval = designationId === 13 || empCode === '12345';

  const NewsEntries = ['220315', '12345', '94320833', '160046'].includes(
    String(empCode),
  );
  const NewsMd =
    designationId === 1 || ['12345', '160046'].includes(String(empCode));

  const empSearch =
    regionId === 1 ||
    ['12345', '160046'].includes(String(empCode)) ||
    isManagerHr;

  //  Don’t render until session is ready
  if (!empCode || designationId === null) return null;
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
          Employee Section
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

          if (item.label === 'News Entries' && !NewsEntries) {
            return null;
          }

          if (item.label === 'News Comment (MD)' && !NewsMd) {
            return null;
          }
          if (
            (item.label === 'Immovable Property Return' ||
              item.label === 'Immovable Property Return View') &&
            !showPropertyMenus
          ) {
            return null;
          }

          if (item.label === 'Employee Search' && !empSearch) {
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
