import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  InputAdornment,
  IconButton,
  Stack,
  Backdrop,
  Paper,
  Modal,
  Fade,
} from '@mui/material';
import { PropagateLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  attendanceRecords,
  getOtp,
  userAuthentication,
  verifyOtp,
} from '../../Services/Auth';
import { useAuth } from '../../Authentication/Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BackgroundContainer = styled('div')(({ theme }) => ({
  backgroundImage: 'url("/assets/backgroundImg.avif")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}));

const Login = () => {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');

    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const punchDate = getCurrentDate();
    const fetchData = async () => {
      try {
        const response = await attendanceRecords(punchDate);
        setAttendanceSummary(response.data.list[0]);
      } catch (error) {
        console.log('Error While Get Attendace Summary', error);
      }
    };
    fetchData();
  }, []);

  const cardData = [
    {
      title: 'Registered Employees',
      value: attendanceSummary.totalRegisteredEmps,
      color: 'primary',
      progress: 50,
    },
    {
      title: 'Active Employees',
      value: attendanceSummary.totalActiveEmps,
      color: 'warning',
      progress: 50,
    },
    {
      title: 'Today Present',
      value: attendanceSummary.present,
      color: 'secondary',
      progress: 50,
    },
    {
      title: 'Not Closed',
      value: attendanceSummary.notClosed,
      color: 'info',
      progress: 50,
    },
    {
      title: 'LC/BO',
      value: attendanceSummary.lcBo,
      color: 'error',
      progress: 50,
    },
    {
      title: 'Today Leave',
      value: attendanceSummary.leave,
      color: 'primary',
      progress: 50,
    },
    {
      title: 'Today Absent',
      value: attendanceSummary.absent,
      color: 'success',
      progress: 50,
    },
  ];

  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sendReq = {
      username: userId,
      password,
      deviceId: '',
      requestMode: '',
    };
    setOpenBackdrop(true);

    try {
      const response = await userAuthentication(sendReq);
      if (response.data.code === '200' && response.data.message === 'Success') {
        const otpReq = { username: userId, source: 'E-Attendance Portal' };
        const otpResponse = await getOtp(otpReq);
        if (
          otpResponse.data.code === '200' &&
          otpResponse.data.message === 'Success'
        ) {
          alert('OTP Sent Successfully');
          handleModalOpen();

          setTimer(30);
          setIsResendDisabled(true);
        } else {
          alert(otpResponse.data.message);
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOtpChange = (event, index) => {
    const value = event.target.value;
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // if (value && index < 3) {
    //   inputRefs.current[index + 1].focus();
    // }
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      if (otp[index]) {
        // If current has value, clear it first
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus to previous input
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Verifying OTP
  const OtpVerification = async () => {
    if (otp.includes('')) {
      alert('Please Enter Correct OTP');
      return;
    }
    const enteredOtp = otp.join('');
    const sendReq = {
      username: userId,
      source: 'E-Attendance Portal',
      otp: enteredOtp,
    };
    setOpenBackdrop(true);
    try {
      const response = await verifyOtp(sendReq);
      if (response.data.code === '200' && response.data.message === 'Success') {
        doubleAuthentication();
        alert('Otp Verified');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Verify Otp Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const otpReq = { username: userId, source: 'E-Attendance Portal' };
      const otpResponse = await getOtp(otpReq);
      if (
        otpResponse.data.code === '200' &&
        otpResponse.data.message === 'Success'
      ) {
        alert('OTP Resend Successfully');
        setOtp(['', '', '', '']);
        inputRefs.current[0].focus();
        setTimer(30);
        setIsResendDisabled(true);
      } else {
        alert(otpResponse.data.message);
      }
    } catch (error) {
      console.error('OTP Error:', error);
    }
  };

  const doubleAuthentication = async () => {
    const sendReq = {
      username: userId,
      password,
      deviceId: '',
      requestMode: '',
    };
    setOpenBackdrop(false);

    try {
      const response = await userAuthentication(sendReq);
      if (response.data.code === '200' && response.data.message === 'Success') {
        // console.log("Double Auth", response);
        // console.log("Double Auth", response.headers.authorization);
        const token = response.headers.authorization;

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
        sessionStorage.setItem(
          'isNominationSubmitted',
          decodedData.isNominationSubmitted,
        );
        // console.log("Decoded Token Data:", decodedData.isNominationSubmitted);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('empCode', response.data.list[0].empCode);
        sessionStorage.setItem('fullName', response.data.list[0].fullName);
        sessionStorage.setItem('id', response.data.list[0].id);
        sessionStorage.setItem(
          'isManagerHr',
          response.data.list[0].isManagerHr,
        );
        sessionStorage.setItem(
          'isReportingOfficer',
          response.data.list[0].isReportingOfficer,
        );
        // sessionStorage.setItem('designation', response.data.list[0].designation);
        sessionStorage.setItem(
          'designationId',
          response.data.list[0].designationId,
        );
        sessionStorage.setItem(
          'isOutsourceInvoiceApprover',
          response.data.list[0].isOutsourceInvoiceApprover,
        );
        sessionStorage.setItem('isRaoApprover', response.data.list[0].isRao);

        sessionStorage.setItem(
          'departmentId',
          response.data.list[0].departmentId,
        );
        sessionStorage.setItem(
          'departmentName',
          response.data.list[0].department,
        );
        sessionStorage.setItem(
          'designationName',
          response.data.list[0].designation,
        );

        sessionStorage.setItem(
          'regionId',
          response.data.list[0].region.regionId,
        );
        sessionStorage.setItem('regionName', response.data.list[0].region.name);

        if (response.data.list[0].circle == null) {
          sessionStorage.setItem('circleId', response.data.list[0].circle);
        } else {
          sessionStorage.setItem(
            'circleId',
            response.data.list[0].circle.circleId,
          );
          sessionStorage.setItem(
            'circleName',
            response.data.list[0].circle.name,
          );
        }

        if (response.data.list[0].division == null) {
          sessionStorage.setItem('divisionId', response.data.list[0].division);
        } else {
          sessionStorage.setItem(
            'divisionId',
            response.data.list[0].division.divisionId,
          );
          sessionStorage.setItem(
            'divisionName',
            response.data.list[0].division.name,
          );
        }

        if (response.data.list[0].subDivision == null) {
          sessionStorage.setItem(
            'subdivisionId',
            response.data.list[0].subDivision,
          );
        } else {
          sessionStorage.setItem(
            'subdivisionId',
            response.data.list[0].subDivision.subdivisionId,
          );
          sessionStorage.setItem(
            'subdivisionName',
            response.data.list[0].subDivision.name,
          );
        }

        if (response.data.list[0].dc == null) {
          sessionStorage.setItem('dcId', response.data.list[0].dc);
        } else {
          sessionStorage.setItem('dcId', response.data.list[0].dc.dcId);
          sessionStorage.setItem('dcName', response.data.list[0].dc.name);
        }

        sessionStorage.setItem(
          'adhaarNumber',
          response.data.list[0].adhaarNumber,
        );
        sessionStorage.setItem(
          'dateOfBirth',
          response.data.list[0].dateOfBirth,
        );
        sessionStorage.setItem('gender', response.data.list[0].gender);
        sessionStorage.setItem(
          'employementType',
          response.data.list[0].employementType,
        );
        sessionStorage.setItem('email', response.data.list[0].email);
        sessionStorage.setItem('address', response.data.list[0].address);
        sessionStorage.setItem('mobileNo', response.data.list[0].mobileNo);
        login();
        navigate('/');
        window.location.reload();
      } else {
        alert(response.response.data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const clearValues = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0].focus();
  };

  const handleModalOpen = () => {
    setShowOtpInput(true);
  };

  useEffect(() => {
    if (showOtpInput) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [showOtpInput]);

  const handleModalClose = () => {
    setShowOtpInput(false);
    setOtp(['', '', '', '']);
    // setTimer(0);
  };

  return (
    <BackgroundContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Left Side: Stats Cards */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {cardData.map((data, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ height: '8rem' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color={data.color}>
                        {data.title}
                      </Typography>
                      <Typography variant="h4" gutterBottom>
                        {data.value}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={data.progress}
                        sx={{ height: 10, borderRadius: 5 }}
                        color={data.color}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Side: Login Form */}
          <Grid item xs={12} md={6}>
            <Card style={{ padding: '40px' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/assets/mpebLogo.jpg"
                    alt="Logo"
                    style={{
                      height: '130px',
                      width: '130px',
                      marginBottom: '20px',
                      borderRadius: '50%',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    }}
                  />

                  <Typography
                    variant="h4"
                    gutterBottom
                    fontFamily={'serif'}
                    // color="primary"
                    sx={{
                      color: '#0a1f83',
                      // mb: 0,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    e - Attendance Login
                  </Typography>
                  {!showOtpInput && (
                    <form onSubmit={handleSubmit}>
                      <TextField
                        label="Enter Employee Number"
                        variant="outlined"
                        margin="normal"
                        type="number"
                        fullWidth
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        label="Enter Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, mb: 2 }}
                      >
                        Login
                      </Button>
                      <Link to="/forgetPassword" className="LinkButton">
                        Forgot Password?
                      </Link>
                    </form>
                  )}

                  {showOtpInput && (
                    <Modal
                      open={showOtpInput}
                      onClose={() => {}}
                      disableEscapeKeyDown
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                          sx: {
                            backdropFilter: 'blur(8px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                          },
                        },
                      }}
                      aria-labelledby="otp-modal-title"
                      aria-describedby="otp-modal-description"
                    >
                      <Fade in={showOtpInput}>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            maxWidth: 420,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 5,
                            boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                            p: 5,
                            textAlign: 'center',
                            outline: 'none',
                          }}
                        >
                          <Typography
                            id="otp-modal-title"
                            variant="h5"
                            fontWeight={800}
                            color="primary"
                            gutterBottom
                            sx={{
                              letterSpacing: 0.5,
                              textTransform: 'uppercase',
                            }}
                          >
                            OTP Verification
                          </Typography>

                          <Typography
                            id="otp-modal-description"
                            variant="body1"
                            color="text.secondary"
                            mb={3}
                          >
                            Enter the 4-digit code sent to your registered
                            mobile number
                          </Typography>

                          {/* OTP Input Fields */}
                          <Stack
                            direction="row"
                            justifyContent="center"
                            spacing={2}
                            mb={4}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: '#f5f7fa',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)',
                                transition: 'all 0.2s ease',
                                '&.Mui-focused': {
                                  boxShadow: '0 0 10px rgba(25,118,210,0.4)',
                                  backgroundColor: '#fff',
                                  transform: 'scale(1.05)',
                                },
                              },
                              '& input': {
                                fontWeight: 700,
                                fontSize: '1.8rem',
                                textAlign: 'center',
                                color: '#0d1b2a',
                              },
                            }}
                          >
                            {otp.map((val, index) => (
                              <TextField
                                key={index}
                                type="text"
                                inputProps={{
                                  maxLength: 1,
                                }}
                                value={val}
                                onChange={(e) => handleOtpChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputRef={(el) =>
                                  (inputRefs.current[index] = el)
                                }
                                sx={{
                                  width: 65,
                                  '& .MuiInputBase-root': { height: 65 },
                                }}
                              />
                            ))}
                          </Stack>

                          {/* Buttons */}
                          <Stack spacing={1.6}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={OtpVerification}
                              sx={{
                                fontSize: '1rem',
                                py: 1.4,
                                borderRadius: 3,
                                fontWeight: 700,
                                textTransform: 'none',
                                letterSpacing: 0.5,
                                background:
                                  'linear-gradient(135deg, #1976d2, #1565c0)',
                                boxShadow: '0 4px 15px rgba(25,118,210,0.4)',
                                '&:hover': {
                                  background:
                                    'linear-gradient(135deg, #1565c0, #0d47a1)',
                                  boxShadow: '0 6px 20px rgba(25,118,210,0.5)',
                                },
                              }}
                            >
                              Submit OTP
                            </Button>

                            <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              onClick={clearValues}
                              sx={{
                                fontSize: '1rem',
                                py: 1.3,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: '#90a4ae',
                                '&:hover': {
                                  borderColor: '#1976d2',
                                  backgroundColor: 'rgba(25,118,210,0.05)',
                                },
                              }}
                            >
                              Clear
                            </Button>

                            <Button
                              variant="text"
                              color="primary"
                              fullWidth
                              onClick={handleResendOtp}
                              disabled={isResendDisabled}
                              sx={{
                                fontSize: '0.95rem',
                                py: 1.1,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:disabled': {
                                  color: '#999',
                                },
                              }}
                            >
                              {isResendDisabled
                                ? `Resend OTP in ${timer}s`
                                : 'Resend OTP'}
                            </Button>

                            <Button
                              variant="text"
                              color="error"
                              fullWidth
                              onClick={handleModalClose}
                              sx={{
                                fontSize: '0.95rem',
                                py: 1.1,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                  color: '#d32f2f',
                                  backgroundColor: 'rgba(211,47,47,0.1)',
                                },
                              }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Box>
                      </Fade>
                    </Modal>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </BackgroundContainer>
  );
};

export default Login;

{
  /* <>
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  }}
>
  {otp.map((_, index) => (
    <TextField
      key={index}
      type="text"
      inputProps={{ maxLength: 1 }}
      value={otp[index]}
      onChange={(e) => handleOtpChange(e, index)}
      inputRef={(el) => (inputRefs.current[index] = el)}
      style={{ width: "50px", textAlign: "center" }}
    />
  ))}
</Box>
<Button
  variant="contained"
  color="primary"
  onClick={OtpVerification}
  fullWidth
  sx={{ mt: 2 }}
>
  Submit OTP
</Button>
<Button
  variant="outlined"
  color="secondary"
  onClick={clearValues}
  fullWidth
  sx={{ mt: 2 }}
>
  Clear
</Button>

<Button
  variant="outlined"
  color="inherit"
  onClick={handleResendOtp}
  disabled={isResendDisabled}
  sx={{ mt: 2 }}
>
  Resend OTP {isResendDisabled && `(${timer}s)`}
</Button>
</> */
}
