import React, { useEffect, useState } from 'react';
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
  Button,
} from '@mui/material';
import { color, motion } from 'framer-motion';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';
import { PropagateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
// import NominationDeclarationModal from "../Regular Employee/Nomination_Declaration/Index";
import WorkIcon from '@mui/icons-material/Work';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookIcon from '@mui/icons-material/Book';
import SavingsIcon from '@mui/icons-material/Savings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { getSsoList, vigilanceLogin } from '../../../Services/Auth';
import NominationDeclarationModal from '../../Regular Employee/Nomination_Declaration/Index';

const cardGradient = 'linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%)';
const iconStyle = { fontSize: 40, color: '#1976d2' };

function SsoDashboard() {
  const [ssoList, setSsoList] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  // Fetch SSO list on mount
  useEffect(() => {
    const fetchSso = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getSsoList();
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
    if (lower.includes('sanchay'))
      return <AccountBalanceWalletIcon sx={iconStyle} />;
    if (lower.includes('dakshta')) return <SchoolIcon sx={iconStyle} />;
    if (lower.includes('vigilance')) return <VisibilityIcon sx={iconStyle} />;
    if (lower.includes('e-service') || lower.includes('service book'))
      return <BookIcon sx={iconStyle} />;
    if (lower.includes('dsp')) return <SavingsIcon sx={iconStyle} />;
    if (lower.includes('qc')) return <AssessmentIcon sx={iconStyle} />;
    if (lower.includes('grievance')) return <FeedbackIcon sx={iconStyle} />;
    if (lower.includes('bill')) return <ReceiptLongIcon sx={iconStyle} />;
    if (lower.includes('sampark'))
      return <ConnectWithoutContactIcon sx={iconStyle} />;

    // Default icon
    return <MiscellaneousServicesIcon sx={iconStyle} />;
  };

  // Utility: open URL in new tab
  const openUrl = (url) => window.open(url, '_blank');

  // API and SSO functions — receive `item` to access card-specific data

  const scnDePortal = (item) => {
    if (item.applicationName == 'SCN/DE/Appeal Portal') {
      const token = sessionStorage.getItem('token');
      openUrl(
        `https://attendance.mpcz.in:8888/SCN/user/authenticateSSO?authHeader=${token}`,
      );
    } else {
      alert('Data Not Found!!');
    }
  };

  const sanchayPortal = (item) => {
    if (item.applicationName == 'Sanchay Portal') {
      // const sessionEmpCode = sessionStorage.getItem("empCode");
      const sessionEmpCode = '130572';
      const encoded = btoa(sessionEmpCode);
      openUrl(`https://sanchay.mpcz.in/cc/login_sso?emp=${encoded}`);
    } else {
      alert('Data Not Found!!');
    }
  };

  const dakshataPortal = () => {
    // const sessionEmpCode = sessionStorage.getItem("empCode");
    const sessionEmpCode = '260079';
    const base64EmpCode = btoa(sessionEmpCode);
    openUrl(
      `https://dakshata.mpcz.in/action/user_login_manager_sso.php?emp_code=${base64EmpCode}`,
    );
  };

  const vigilancePortal = async (item) => {
    // console.log(item.encryptedEmpCode);
    if (item.applicationName == 'Vigilance Portal') {
      try {
        //260074
        const payload = {
          // user: item.encryptedEmpCode,
          user: 'JtHwOjxe+FUz9sETNGEhw+6vVvbaBqtcCt3VPNK/23zTglJV6Lub/7YTy10hQbPTsk1ibVFa/6GYPR2wXgkCA4zeVHa+boVdSB4T9uP8crn4sNV7r+yWmbG6de+co1Ik0u2BmkE54V+7thXtohsQyMMFzIQMptat12/TiToR+E+TDz2oYYZ27U8JI0ghTsPJiWJUoiQPJQ1aCBpyFTIqDm8z1nTyhjsfKcYG2SjC+WBu9w3Sp4CCiiWNsfp4D4mxjZnYC8DNpewlYRwVaQuRoDDyvXAp8tfC5LxpGKFEDxx6z73LTFpa3YqSz7dU69LDDOuFYcCdbcUIkcpvoByfvw==',
        };
        const response = await vigilanceLogin(payload);
        if (response.data.status == 'success') {
          window.open(response.data.url, '_blank');
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Data Not Found !!');
    }
  };

  const eServiceBookPortal = () => {
    const token = sessionStorage.getItem('token');
    openUrl(
      `https://attendance.mpcz.in:8084/e-Service%20Portal/Components/e_ServiceBookDashboard.html?token=${token}`,
    );
  };

  const dspPortal = (item) => {
    // 112233
    //const encryptedText =
    //  "UcfArx8d/xxKkwgXomfM4jg3YOp65c0EUJEjWi4donhEotQpxl5MvAP1YV8Y61iUI0f4LuTHZiazF9d7faubqhJAHOX84X0zknkpBg5lXncIw41Hp/fQXQg0ZTRQ/rI6f7yIq7sIkP5pvfXSaJZlEhKQMPeO9z2CoMzkNknMw7g4Pk8aO+P+/9thQtxlZJQAPe32RTUY7aW72YXe9hLakps0KL5YmtND26HxLtkhEzc2SEUgA4h8TlALTZIKVKdo+lqhHdB7jby5stjPnYgePwo7vHGkYbWBbZlBtS7Qy+vC/4s5RHM+U1FEYBm3qyFB2UXNKdkKq+fJr+AODsPAOA==";
    if (item.applicationName == 'DSP') {
      const encodedCode = item.encryptedEmpCode.replace(/\+/g, '@');
      openUrl(
        `https://rooftop-uat.mpcz.in:8888/deposit-scheme/#/user/sso-login?encryptedTextB64=${encodedCode}`,
      );
    } else {
      alert('Data Not Found!!');
    }
  };

  const QcPortal = async () => {
    const apiUrl = 'https://qcportal.mpcz.in/api/officer_login/';
    const payload = {
      empCode:
        'UcfArx8d/xxKkwgXomfM4jg3YOp65c0EUJEjWi4donhEotQpxl5MvAP1YV8Y61iUI0f4LuTHZiazF9d7faubqhJAHOX84X0zknkpBg5lXncIw41Hp/fQXQg0ZTRQ/rI6f7yIq7sIkP5pvfXSaJZlEhKQMPeO9z2CoMzkNknMw7g4Pk8aO+P+/8thQtxlZJQAPe32RTUY7aW72YXe9hLakps0KL5YmtND26HxLtkhEzc2SEUgA4h8TlALTZIKVKdo+lqhHdB7jby5stjPnYgePwo7vHGkYbWBbZlBtS7Qy+vC/4s5RHM+U1FEYBm3qyFB2UXNKdkKq+fJr+AODsPAOA==',
      locCode: 'LOC001',
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Officer login API failed! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Officer Login Response:', data);

      if (!data.url || !data.data) {
        throw new Error('Invalid API response structure');
      }

      //  Build POST form dynamically
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;
      form.target = '_blank';

      // Fill payload from response
      const resPayload = {
        employ_id: data.data.employ_id,
        employ_name: data.data.employ_name,
        designation: data.data.designation,
        mobile: data.data.mobile,
        user_zone: data.data.user_zone,
        Posted: data.data.Posted,
        new_emp_id: data.data.new_emp_id,
      };

      Object.entries(resPayload).forEach(([key, value]) => {
        console.log(key, value);
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error calling Officer Login API:', error.message);
    }
  };

  const grievanceRedressalPortal = (item) => {
    const token = sessionStorage.getItem('token');
    openUrl(`http://egrs.mpcz.in:8085/user-login/grvPortal?authparam=${token}`);
  };

  const billCorrectionPortal = async (item) => {
    try {
      const payload = {
        role: '1',
        query1:
          'EomkLjmYDv35Czw9Ip3OLKbFbcILILoO7M1Z/4xCZQCid1HxxaT+w0aEWi1GVX6aLTxiP/cv+DDrnmY0sKb0b08WD7Km6ZedW6y5EBgX/vdSdMUhz1vghGdwnEFoVLYE1BmdLtwLadqR/ovNOujumbnWPvWbqfG7OFh9du7EVjzadnl/tmjmAX5GBpIrC37EjauUQ8kk1Ov8h7JVg0RhQPbpJzvqjpj9Zm1C0uhpj+5mP/MPVysfamU7/+Kp9EDEFUttX66wIqtmGRx5Vsk5lkLqaeKsvOpSJcIL25lYQcEKCrne2J71VZL51mfLXNSaG4+uFuuTSHw9JngaTs6T+g==',
        query2: '',
        query3: '',
      };
      //const payload = { role: "1", query1: item.query || "" };
      const URL = 'https://billcorrection.mpcz.in:8087/main/officer_login_api';
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log('Bill Correction API Response:', data);
      if (data.token)
        openUrl(
          `https://billcorrection.mpcz.in:8087/main/Officer_Dashboard_Page_View?token=${data.token}`,
        );
      return data;
    } catch (error) {
      console.error('Bill Correction API Error:', error);
      return null;
    }
  };

  const ishamparkPortal = (item) => {
    // const encoded = btoa(item.empCode || "160046");
    const emp = '160046';
    const encoded = btoa(emp);
    openUrl(
      `http://isampark.mpcz.in/login_sso.aspx?emp_code=${encodeURIComponent(
        encoded,
      )}`,
    );
  };

  // const DFIS = (item) => {
  //   // const encoded = btoa(item.empCode || "160046");
  //   const emp = "131012";
  //   const encoded = btoa(emp);
  //   openUrl(
  //     `http://dfis.mpcz.in:8888/login_sso.aspx?emp_code=${encodeURIComponent(
  //       encoded
  //     )}`
  //   );
  // };

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
      case 'Sanchay Portal':
        sanchayPortal(item);
        break;
      case 'Dakshta Portal':
        dakshataPortal(item);
        break;
      case 'Vigilance Portal':
        await vigilancePortal(item);
        break;
      case 'E-Service Book':
        eServiceBookPortal(item);
        break;
      case 'DSP':
        dspPortal(item);
        break;
      case 'QC Portal':
        await QcPortal(item);
        break;
      case 'Grievance Redressal':
        await grievanceRedressalPortal(item);
        break;
      case 'Bill Correction':
        await billCorrectionPortal(item);
        break;
      case 'I-Sampark':
        ishamparkPortal(item);
        break;

      // case "DFIS":
      //   DFIS(item);
      //   break;
      default:
        console.warn('No handler defined for:', item.applicationName);
    }
  };

  return (
    // <Box p={4} sx={{ background: "#f5f5f5", minHeight: "100vh" }}>
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

        {/* <Grid container spacing={2.5}>
          {ssoList.length > 0 ? (
            ssoList.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 280 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: "0px 4px 18px rgba(0,0,0,0.08)",
                      background:
                        "linear-gradient(160deg, #f7f9fc 0%, #eef2f7 100%)",
                      cursor: "pointer",
                      p: 2,
                      height: 190,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(160deg, #f4f7fb 0%, #e9eef6 100%)",
                      },
                    }}
                  >
                    {item.list?.length > 0 && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(index);
                        }}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          color: "#0d47a1",
                          "&:hover": {
                            backgroundColor: "rgba(13,71,161,0.08)",
                          },
                        }}
                      >
                        {expandedCard === index ? (
                          <ArrowDropUpIcon fontSize="small" />
                        ) : (
                          <ArrowDropDownIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}

                    <CardContent
                      sx={{
                        p: 1.2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flexGrow: 1,
                        width: "100%",
                      }}
                      onClick={() => handleCardClick(item)}
                    >
                      <Box display="flex" justifyContent="center" mb={1.2}>
                        {getIcon(item.applicationName)}
                      </Box>

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "Inter, Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          textAlign: "center",
                          color: "#0d47a1",
                        }}
                      >
                        {item.applicationName || "Unnamed"}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#ff9800",
                          mt: 0.5,
                        }}
                      >
                        {item?.pendingCount || "0"}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.6,
                          fontFamily: "Inter, sans-serif",
                          color: "#666",
                          letterSpacing: 0.3,
                        }}
                      >
                        {item.list?.length > 0
                          ? `${item.list.length} Modules`
                          : "No Modules"}
                      </Typography>
                    </CardContent>

                    <Collapse in={expandedCard === index} timeout="auto">
                      <List
                        sx={{
                          mt: 1,
                          bgcolor: "rgba(13,71,161,0.04)",
                          borderRadius: 2,
                          p: 0.5,
                          width: "100%",
                          maxHeight: 120,
                          overflowY: "auto",
                        }}
                      >
                        {item.list?.map((sub, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              borderBottom: "1px dashed rgba(13,71,161,0.15)",
                              display: "flex",
                              justifyContent: "space-between",
                              py: 0.4,
                            }}
                          >
                            <ListItemText
                              primary={sub.head}
                              primaryTypographyProps={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.8rem",
                                color: "#0d47a1",
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              label={sub.pendingCount}
                              size="small"
                              sx={{
                                background:
                                  sub.pendingCount > 0 ? "#e53935" : "#43a047",
                                color: "#fff",
                                fontWeight: 600,
                                height: 20,
                                fontSize: "0.7rem",
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
              sx={{
                mx: "auto",
                mt: 5,
                color: "#555",
                fontFamily: "Inter, sans-serif",
              }}
            >
              No services available
            </Typography>
          )}
        </Grid> */}

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

export default SsoDashboard;
