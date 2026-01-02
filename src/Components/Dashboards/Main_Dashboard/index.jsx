import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Backdrop,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';
import { PropagateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import BookIcon from '@mui/icons-material/Book';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { getSsoList } from '../../../Services/Auth';
import NominationDeclarationModal from '../../Regular Employee/Nomination_Declaration/Index';

const cardGradient = 'linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%)';
const iconStyle = { fontSize: 40, color: '#1976d2' };

function MainDashboard() {
  const [ssoList, setSsoList] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();
  const sessionEmpCode = sessionStorage.getItem('empCode');

  // Fetch SSO list on mount
  useEffect(() => {
    if (!sessionEmpCode) {
      window.location.reload();
    }
    const fetchSso = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getSsoList(sessionEmpCode);
        console.log(response);
        setSsoList(response.data.list || []);
      } catch (error) {
        console.error('Error fetching SSO list:', error);
      } finally {
        setOpenBackdrop(false);
      }
    };

    fetchSso();
  }, []);

  // Expand/collapse sublist
  const handleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Map card name to icon
  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('employee')) return <WorkIcon sx={iconStyle} />;
    if (lower.includes('human resource'))
      return <ManageAccountsIcon sx={iconStyle} />;
    if (lower.includes('reporting officer'))
      return <SupervisorAccountIcon sx={iconStyle} />;
    if (lower.includes('operation')) return <BuildCircleIcon sx={iconStyle} />;
    if (lower.includes('scn') || lower.includes('appeal'))
      return <GavelIcon sx={iconStyle} />;
    // if (lower.includes('sanchay'))
    //   return <AccountBalanceWalletIcon sx={iconStyle} />;
    if (lower.includes('e-service') || lower.includes('service book'))
      return <BookIcon sx={iconStyle} />;

    // Default icon
    return <MiscellaneousServicesIcon sx={iconStyle} />;
  };

  const openUrl = (url) => window.open(url, '_blank');
  const scnDePortal = (item) => {
    if (item.applicationName === 'SCN/DE/Appeal Portal') {
      const token = sessionStorage.getItem('token');
      openUrl(
        `https://attendance.mpcz.in:8888/SCN/user/authenticateSSO?authHeader=${token}`,
      );
    } else {
      alert('Data Not Found!!');
    }
  };

  const eServiceBookPortal = () => {
    const token = sessionStorage.getItem('token');
    openUrl(
      `https://attendance.mpcz.in:8084/e-Service%20Portal/Components/e_ServiceBookDashboard.html?token=${token}`,
    );
  };

  // Centralized card click handler
  const handleCardClick = async (item) => {
    switch (item.applicationName) {
      case 'Employee':
        navigate('/employeeDashboard');
        break;
      case 'Human Resource':
        navigate('/humanResourceDashboard');
        break;
      case 'Reporting Officer':
        navigate('/reportingOfficerDashboard');
        break;
      case 'Operation & Maintenance':
        navigate('/operationMaintenanceDashboard');
        break;
      case 'SCN/DE/Appeal Portal':
        scnDePortal(item);
        break;

      case 'E-Service Book':
        eServiceBookPortal(item);
        break;

      default:
        console.warn('No handler defined for:', item.applicationName);
    }
  };

  return (
    <>
      <NominationDeclarationModal />
      <Box p={4} sx={{ minHeight: '100vh' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 6,
            fontFamily: 'Roboto, serif',
            textAlign: 'center',
            color: '#0d47a1',
          }}
        >
          e - Attendance Dashboard
        </Typography>

        <Grid container spacing={4}>
          {ssoList.length > 0 ? (
            ssoList.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: '0px 12px 30px rgba(0,0,0,0.12)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
                      background: cardGradient,
                      color: '#0d47a1',
                      cursor: 'pointer',
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {item.list?.length > 0 && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(index);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: '#0d47a1',
                        }}
                      >
                        {expandedCard === index ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </IconButton>
                    )}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => handleCardClick(item)}
                    >
                      <Box display="flex" justifyContent="center" mb={2}>
                        {getIcon(item.applicationName)}
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          fontFamily: 'Roboto, serif',
                          textAlign: 'center',
                        }}
                      >
                        {item.applicationName || 'Unnamed Service'}
                        <br />
                        <b style={{ color: 'orange' }}>
                          {item?.pendingCount || '0'}
                        </b>
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          fontFamily: 'Roboto, serif',
                          display: 'block',
                          textAlign: 'center',
                        }}
                      >
                        {item.list?.length > 0
                          ? `${item.list.length} modules`
                          : 'No modules'}
                      </Typography>
                    </CardContent>

                    <Collapse in={expandedCard === index} timeout="auto">
                      <List
                        sx={{
                          mt: 2,
                          bgcolor: 'rgba(13,71,161,0.05)',
                          borderRadius: 2,
                          p: 1,
                        }}
                      >
                        {item.list?.map((sub, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              borderBottom: '1px dashed rgba(13,71,161,0.3)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              py: 1,
                            }}
                          >
                            <ListItemText
                              primary={sub.head}
                              primaryTypographyProps={{
                                fontFamily: 'Roboto, serif',
                                fontSize: '0.95rem',
                                color: '#0d47a1',
                              }}
                            />
                            <Chip
                              label={sub.pendingCount}
                              size="small"
                              sx={{
                                background:
                                  sub.pendingCount > 0 ? '#f44336' : '#43a047',
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{ mx: 'auto', mt: 5, color: '#555' }}
            >
              No services available
            </Typography>
          )}
        </Grid>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <PropagateLoader />
        </Backdrop>
      </Box>
    </>
  );
}

export default MainDashboard;
