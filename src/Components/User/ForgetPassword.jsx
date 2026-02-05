import React, { useState, useRef } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  InputAdornment,
  Stack,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from '@mui/material';
import { PropagateLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getOtp, updatePassword, verifyOtp } from '../../Services/Auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const BackgroundContainer = styled('div')(({ theme }) => ({
  backgroundImage: 'url("/assets/backgroundImg.avif")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
}));

function ForgetPassword() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [empCode, setEmpCode] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const inputRefs = useRef([]);

  // ---- Handle Employee Code Change ----
  const handleEmpCodeChange = (e) => {
    setEmpCode(e.target.value);
    if (error) setError('');
  };

  // ---- Send OTP ----
  const handleSendOtp = async () => {
    if (!empCode) {
      setError('Employee Code is required');
      return;
    }

    try {
      setOpenBackdrop(true);
      const otpReq = { username: empCode, source: 'Change Password OTP' };
      const otpResponse = await getOtp(otpReq);
      setOpenBackdrop(false);

      if (otpResponse.data.code === '200') {
        setOtpSent(true);
        setCanResend(false);
        setTimer(20);
        alert('OTP sent successfully!');

        // Focus on first OTP box after a small delay
        setTimeout(() => {
          if (inputRefs.current[0]) inputRefs.current[0].focus();
        }, 300);

        // Start timer countdown
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(otpResponse.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setOpenBackdrop(false);
      alert('Error while sending OTP');
    }
  };

  // ---- Handle OTP Change ----
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ---- Handle Keyboard Navigation ----
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ---- Verify OTP ----
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      alert('Please enter complete 4-digit OTP');
      return;
    }

    try {
      setOpenBackdrop(true);
      const sendReq = {
        username: empCode,
        source: 'Change Password OTP',
        otp: enteredOtp,
      };
      const response = await verifyOtp(sendReq);
      setOpenBackdrop(false);

      if (
        response.data?.code === '200' &&
        response.data.message === 'Success'
      ) {
        alert('OTP Verified Successfully!');
        setOpenModal(true);
      } else {
        alert(response.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      setOpenBackdrop(false);
      alert('Error verifying OTP');
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirm = () => setShowConfirm((prev) => !prev);

  // ---- Resend OTP ----
  const handleResendOtp = () => {
    setOtp(['', '', '', '']);
    handleSendOtp();
  };

  const modalClose = () => {
    setOpenModal(false);
  };

  const handleUpdate = async () => {
    if (!password || !confirmPassword) {
      setPassError('Both fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setPassError('Passwords do not match');
      return;
    }

    setPassError('');

    const payload = {
      username: empCode,
      password: password,
    };
    const res = await updatePassword(payload);
    if (res.data.code === '200' && res.data.message === 'Success') {
      alert('Password updated successfully!');
      modalClose();
      window.location.reload();
    } else {
      alert(res.data.message);
    }
  };

  return (
    <>
      <BackgroundContainer>
        <Container maxWidth="md">
          <Card style={{ padding: '20px', maxWidth: 400, margin: 'auto' }}>
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
                    height: '100px',
                    width: '100px',
                    marginBottom: '20px',
                    borderRadius: '50%',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  }}
                />

                <Typography
                  variant="h5"
                  gutterBottom
                  fontFamily={'serif'}
                  sx={{
                    color: '#0a1f83',
                    fontFamily: 'serif',
                    fontWeight: 'bold',
                  }}
                >
                  Change Password
                </Typography>

                <TextField
                  label="Enter Employee Code"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  fullWidth
                  required
                  value={empCode}
                  onChange={handleEmpCodeChange}
                  error={!!error}
                  helperText={error}
                  disabled={otpSent}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />

                {!otpSent && (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, mb: 2, textTransform: 'capitalize' }}
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </Button>
                )}

                {otpSent && (
                  <>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      spacing={2}
                      mb={2}
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
                        mt: 2,
                      }}
                    >
                      {otp.map((val, index) => (
                        <TextField
                          key={index}
                          type="text"
                          inputProps={{ maxLength: 1 }}
                          value={val}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          inputRef={(el) => (inputRefs.current[index] = el)}
                          sx={{
                            width: 65,
                            '& .MuiInputBase-root': { height: 65 },
                          }}
                        />
                      ))}
                    </Stack>

                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mb: 1, textTransform: 'capitalize' }}
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={handleResendOtp}
                      disabled={!canResend}
                    >
                      {canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
                    </Button>
                  </>
                )}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link to="/login" className="LinkButton">
                  User Login ?
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Container>

        <Modal
          open={openModal}
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
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Update Password
              </Typography>

              <TextField
                label="Enter Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                fullWidth
                sx={{ mb: 2 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!passError}
                helperText={passError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowConfirm} edge="end">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{ mr: 1 }}
              >
                Update
              </Button>
              <Button variant="outlined" onClick={modalClose}>
                Cancel
              </Button>
            </Box>
          </Fade>
        </Modal>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <PropagateLoader />
        </Backdrop>
      </BackgroundContainer>
    </>
  );
}

export default ForgetPassword;
