import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArticleIcon from '@mui/icons-material/Article';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { motion } from 'framer-motion';

const cards = [
  {
    title: 'Request for Revenue Realization & Commercial Activity',
    link: '/requestForRRAC',
    icon: <DescriptionIcon fontSize="large" color="primary" />,
    key: 'RRAC_REQUEST',
  },
  {
    title: 'Discontinuation of Delegation of Revenue Realisation',
    link: '/RRACdiscontinuation',
    icon: <CancelScheduleSendIcon fontSize="large" color="error" />,
    allowedEmpCodes: ['12345', '160046', '89324824'],
  },
  {
    title: 'Revenue Realization & Commercial Activity (MIS)',
    link: '/RRACMIS',
    icon: <AssessmentIcon fontSize="large" color="secondary" />,
  },
  {
    title: 'SOP for Revenue Realization & Commercial Activity (Download SOP)',
    link: 'https://attendance.mpcz.in:8084/E_Attendance_rebuild/media/SOP%20of%20Revenue%20Realization%20and%20Commercial%20Activity.docx',
    icon: <ArticleIcon fontSize="large" color="action" />,
  },
  {
    title: 'Expenditure Booking Against Revenue Realization',
    link: '/viewExpenditure',
    icon: <PaymentsIcon fontSize="large" color="success" />,
  },
  {
    title: 'Approve Expenditure',
    link: '/viewExpenditureByAuthority',
    icon: <CheckCircleIcon fontSize="large" color="success" />,
  },
  {
    title: 'Evaluation Parameters (Download Excel)',
    link: 'https://attendance.mpcz.in:8888/E-Attendance/api/incentive/getFundDocument',
    icon: <DownloadIcon fontSize="large" color="primary" />,
  },
  {
    title: 'SSO Daily Losses',
    link: '/dailyLosses',
    icon: <TrendingDownIcon fontSize="large" color="error" />,
  },
  {
    title: 'SSO Shutdown',
    link: '/ssoShutDown',
    icon: <PowerOffIcon fontSize="large" color="warning" />,
  },
  {
    title: 'Power Transformer Report',
    link: '/powerTransformerReport',
    icon: <ElectricalServicesIcon fontSize="large" color="secondary" />,
  },
  {
    title: 'SSO Authorization',
    link: '/ssoAuthorization',
    icon: <SecurityIcon fontSize="large" color="info" />,
  },
  {
    title: 'Line Staff Authorization',
    link: '/lineStaffAuthorization',
    icon: <PeopleIcon fontSize="large" color="primary" />,
  },
  {
    title: 'SSO Status by DGM',
    link: '/dgmAuthorizationStatus',
    icon: <ManageAccountsIcon fontSize="large" color="info" />,
  },
  {
    title: 'SSO Status by GM',
    link: '/gmAuthorizationStatus',
    icon: <WorkOutlineIcon fontSize="large" color="success" />,
  },
  {
    title: 'Line Staff Status by DGM',
    link: '/dgmLineStaffStatus',
    icon: <EngineeringIcon fontSize="large" color="error" />,
  },
  {
    title: 'Line Staff Status by GM',
    link: '/gmLineStaffStatus',
    icon: <PeopleIcon fontSize="large" color="secondary" />,
  },
  {
    title: 'Power Transformer Report Status by DGM',
    link: '/dgmPtrStatus',
    icon: <AssessmentIcon fontSize="large" color="warning" />,
  },
];

const sessionEmpcode = sessionStorage.getItem('empCode');
const designationId = Number(sessionStorage.getItem('designationId'));
const departmentId = Number(sessionStorage.getItem('departmentId'));

const isCardVisible = (card) => {
  // RRAC Request condition
  if (card.key === 'RRAC_REQUEST') {
    if (
      (designationId === 98 ||
        designationId === 17 ||
        designationId === 10 ||
        designationId === 8 ||
        designationId === 2 ||
        designationId === 23 ||
        designationId === 99) &&
      departmentId === 36
    ) {
      return true;
    }

    if (sessionEmpcode === '12345') {
      return true;
    }

    return false;
  }

  // existing empCode-based restriction
  if (card.allowedEmpCodes) {
    return card.allowedEmpCodes.includes(sessionEmpcode);
  }

  return true;
};

function OperationmaintenanceDashboard() {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 3,
        minHeight: '100vh',
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
          Operation And Maintenance
        </Typography>
      </motion.div>
      <div style={{ marginBottom: '30px' }}>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 3 }}
        >
          {cards.filter(isCardVisible).map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Link to={card.link} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    height: '100%',
                    p: 2,
                    textAlign: 'center',
                    boxShadow: 3,
                    borderRadius: 3,
                    background:
                      'linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%)',
                    color: '#0d47a1',
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      backgroundColor: '#f1f8ff',
                      transform: 'translateY(-5px)',
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
                    {card.icon}
                  </Box>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        color: '#1a237e',
                        fontFamily: 'Roboto, serif',
                      }}
                    >
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
}

export default OperationmaintenanceDashboard;
