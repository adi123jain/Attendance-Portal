import { useEffect, useState, useRef } from 'react';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
  Modal,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Card, Form } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';
import {
  getOtp,
  getWiremanCertificates,
  updateWiremanCertificateGM,
  verifyOtp,
} from '../../../Services/Auth';
import { Link } from 'react-router-dom';

function UpdateWiremanCertificateStatus() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState([]);
  const [rowData, setRowData] = useState({});
  const [errors, setErrors] = useState({});
  const circleId = sessionStorage.getItem('circleId');

  const inputRefs = useRef({});

  const fetchDetails = async () => {
    try {
      setOpenBackdrop(true);

      const response = await getWiremanCertificates(circleId);
      if (response.data.code === '200') {
        setCertificates(response.data.list);
        const initialRowData = {};
        response.data.list.forEach((item) => {
          initialRowData[item.id] = {
            authLt440VLine: item.authLt440VLine,
            authLt11KvLine: item.authLt11KvLine,
            authLt33KvLine: item.authLt33KvLine,
            gmStatus: '',
            gmRemark: '',
          };
        });
        setRowData(initialRowData);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(certificates.map((item) => item.id));
    } else {
      setSelected([]);
      setRowData({});
      setErrors({});
    }
  };

  const handleSelectRow = (id) => {
    const isSelected = selected.includes(id);

    if (isSelected) {
      setSelected(selected.filter((item) => item !== id));

      setRowData((prev) => {
        const updated = { ...prev };

        updated[id] = {
          ...updated[id],
          gmStatus: '',
          gmRemark: '',
        };
        return updated;
      });

      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleRowChange = (id, field, value) => {
    setRowData({
      ...rowData,
      [id]: {
        ...rowData[id],
        [field]: value,
      },
    });
  };

  const validate = () => {
    let newErrors = {};
    let firstInvalidField = null;

    selected.forEach((id) => {
      const row = rowData[id] || {};

      if (!row.gmStatus) {
        newErrors[id] = { ...newErrors[id], gmStatus: '*Required' };
        if (!firstInvalidField) firstInvalidField = { id, field: 'gmStatus' };
      }

      if (!row.gmRemark || row.gmRemark.trim() === '') {
        newErrors[id] = { ...newErrors[id], gmRemark: '*Required' };
        if (!firstInvalidField) firstInvalidField = { id, field: 'gmRemark' };
      }
    });

    setErrors(newErrors);

    if (firstInvalidField) {
      setTimeout(() => {
        inputRefs.current[firstInvalidField.id][
          firstInvalidField.field
        ]?.focus();
      }, 200);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const payload = selected.map((id) => {
      return {
        id,
        gmStatus: rowData[id]?.gmStatus,
        gmRemark: rowData[id]?.gmRemark,
        updatedBy: sessionStorage.getItem('empCode'),
        gmEmpCode: sessionStorage.getItem('empCode'),

        authLt440VLine: rowData[id]?.authLt440VLine,
        authLt11KvLine: rowData[id]?.authLt11KvLine,
        authLt33KvLine: rowData[id]?.authLt33KvLine,
      };
    });

    try {
      setOpenBackdrop(true);

      const response = await updateWiremanCertificateGM(payload);
      if (response.data.code === '200') {
        alert('Updated Successfully!');
        window.location.reload();
        fetchDetails();
        setRowData({});
        setSelected([]);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const [otp, setOtp] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Send OTP API
  const sendOtp = async () => {
    if (selected.length === 0) {
      alert('Please select at least one record!');
      return;
    }

    if (!validate()) return;
    const payload = {
      username: sessionStorage.getItem('empCode'),
      source: 'OTP for approval of Wireman Certificate',
    };
    try {
      setOpenBackdrop(true);

      const response = await getOtp(payload);
      if (response.data.code === '200') {
        alert('OTP sent successfully');
        setOtp('');
        setOtpError('');
        setOtpModal(true);
        setResendTimer(15);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // Timer effect for resend
  useEffect(() => {
    if (!otpModal) {
      setResendTimer(0);
      return;
    }

    if (resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpModal, resendTimer]);

  // Resend OTP
  const handleResend = () => {
    if (resendTimer > 0) return;
    sendOtp();
  };

  // Submit OTP API
  const submitOtp = async () => {
    if (!otp || otp.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP.');
      return;
    }

    try {
      const payload = {
        username: sessionStorage.getItem('empCode'),
        source: 'OTP for approval of Wireman Certificate',
        otp: otp,
      };
      const response = await verifyOtp(payload);
      if (response.data.code === '200') {
        alert('OTP verified successfully');
        handleSubmit();
        setOtpModal(false);
        setOtp('');
        setOtpError('');
      } else {
        setOtpError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log('Error', error);
      setOtpError('Something went wrong, please try again.');
    }
  };

  const handleCloseOtpModal = () => {
    setOtpModal(false);
    setOtp('');
    setOtpError('');
    setResendTimer(0);
  };

  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#0a1f83' }}
          >
            Update Wireman Certificate Status By GM
          </Typography>
        </Card.Header>

        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>

                  <StyledTableCell>
                    Select All <br />
                    <Checkbox
                      color="success"
                      checked={
                        selected.length === certificates.length &&
                        certificates.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </StyledTableCell>

                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Examination Date</StyledTableCell>
                  <StyledTableCell>Start Date</StyledTableCell>
                  <StyledTableCell>End Date</StyledTableCell>
                  <StyledTableCell>Authorised For</StyledTableCell>
                  <StyledTableCell>GM Status</StyledTableCell>
                  <StyledTableCell>GM Remark</StyledTableCell>
                  <StyledTableCell>Document</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {certificates && certificates.length > 0 ? (
                  certificates.map((item, index) => {
                    if (!inputRefs.current[item.id]) {
                      inputRefs.current[item.id] = {};
                    }

                    return (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>

                        <StyledTableCell>
                          <Checkbox
                            color="success"
                            checked={selected.includes(item.id)}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </StyledTableCell>

                        <StyledTableCell>{item.empCode}</StyledTableCell>
                        <StyledTableCell>{item.fullName}</StyledTableCell>
                        <StyledTableCell>
                          {item.dateOfExamination}
                        </StyledTableCell>
                        <StyledTableCell>{item.startDate}</StyledTableCell>
                        <StyledTableCell>{item.endDate}</StyledTableCell>

                        <StyledTableCell>
                          <Form.Check
                            type="checkbox"
                            label="LT (440V) Line Work"
                            checked={rowData[item.id]?.authLt440VLine || false}
                            onChange={(e) =>
                              handleRowChange(
                                item.id,
                                'authLt440VLine',
                                e.target.checked,
                              )
                            }
                          />

                          <Form.Check
                            type="checkbox"
                            label="11KV Line Work"
                            checked={rowData[item.id]?.authLt11KvLine || false}
                            onChange={(e) =>
                              handleRowChange(
                                item.id,
                                'authLt11KvLine',
                                e.target.checked,
                              )
                            }
                          />

                          <Form.Check
                            type="checkbox"
                            label="33KV Line Work"
                            checked={rowData[item.id]?.authLt33KvLine || false}
                            onChange={(e) =>
                              handleRowChange(
                                item.id,
                                'authLt33KvLine',
                                e.target.checked,
                              )
                            }
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={rowData[item.id]?.gmStatus || ''}
                              inputRef={(el) =>
                                (inputRefs.current[item.id].gmStatus = el)
                              }
                              onChange={(e) =>
                                handleRowChange(
                                  item.id,
                                  'gmStatus',
                                  e.target.value,
                                )
                              }
                              error={!!errors[item.id]?.gmStatus}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                -- select status --
                              </MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>

                            {errors[item.id]?.gmStatus && (
                              <Typography
                                sx={{ color: 'red', fontSize: '12px' }}
                              >
                                {errors[item.id]?.gmStatus}
                              </Typography>
                            )}
                          </FormControl>
                        </StyledTableCell>

                        <StyledTableCell>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter remark"
                            inputRef={(el) =>
                              (inputRefs.current[item.id].gmRemark = el)
                            }
                            value={rowData[item.id]?.gmRemark || ''}
                            onChange={(e) =>
                              handleRowChange(
                                item.id,
                                'gmRemark',
                                e.target.value,
                              )
                            }
                            error={!!errors[item.id]?.gmRemark}
                            helperText={errors[item.id]?.gmRemark}
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          {/* <Button onClick={item.docPath}>Download</Button> */}
                          <Button>Download</Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={10}
                      style={{ textAlign: 'center' }}
                    >
                      No Records Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>

        <div
          style={{
            position: 'sticky',
            bottom: 0,
            background: '#fff',
            padding: '15px',
            textAlign: 'center',
            borderTop: '1px solid #ddd',
            zIndex: 100,
          }}
        >
          <Button
            component={Link}
            to="/humanResourceDashboard"
            variant="contained"
            className="cancel-button"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            variant="contained"
            className="green-button"
            onClick={sendOtp}
          >
            Update
          </Button>
        </div>
      </Card>

      <Modal open={otpModal} onClose={handleCloseOtpModal}>
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              background:
                'linear-gradient(135deg, #1565C0 0%, #1E88E5 50%, #42A5F5 100%)',
              color: 'white',
              py: 1.5,
              px: 2.2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              OTP Verification
            </Typography>

            <IconButton onClick={handleCloseOtpModal} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography
              variant="body1"
              sx={{ mb: 2, color: '#555', lineHeight: 1.4 }}
            >
              Please enter the 4-digit OTP sent to your registered mobile
              number.
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              label="Enter OTP"
              required
              placeholder="••••"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,4}$/.test(value)) {
                  setOtp(value);
                  setOtpError('');
                }
              }}
              error={!!otpError}
              helperText={otpError || 'OTP is valid for a limited time.'}
              inputProps={{
                maxLength: 4,
                inputMode: 'numeric',
                style: {
                  textAlign: 'center',
                  fontSize: '20px',
                  letterSpacing: '4px',
                  padding: '10px 0',
                },
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={submitOtp}
                sx={{
                  flex: 1,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: 2,
                  background:
                    'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
                }}
              >
                Submit OTP
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  flex: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  sx={{
                    py: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: '1.8px',
                  }}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </Button>
                <Typography variant="caption" sx={{ mt: 0.5, color: '#888' }}>
                  You can resend OTP after 15 seconds.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>

      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={openBackdrop}>
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default UpdateWiremanCertificateStatus;
