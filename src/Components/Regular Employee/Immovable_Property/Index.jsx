import { useEffect, useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import {
  Typography,
  Tooltip,
  Button,
  Modal,
  Paper,
  Box,
  IconButton,
  TextField,
  Backdrop,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getOtp,
  submitImmovableProperty,
  verifyOtp,
} from '../../../Services/Auth';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { PropagateLoader } from 'react-spinners';

const ImmovableProperty = () => {
  const sessionRegion = sessionStorage.getItem('regionName');
  const sessionCircle = sessionStorage.getItem('circleName');
  const sessionDivision = sessionStorage.getItem('divisionName');
  const sessionSubdivision = sessionStorage.getItem('subdivisionName');
  const sessionDc = sessionStorage.getItem('dcId');
  const designationName = sessionStorage.getItem('designationName');
  const sessionEmpCode = sessionStorage.getItem('empCode');
  const sessionEmpName = sessionStorage.getItem('fullName');

  const isValid = (val) => val !== null && val !== 'null' && val !== '';

  let officeName = null;

  if (isValid(sessionRegion)) {
    officeName = sessionRegion;
  }
  if (isValid(sessionCircle)) {
    officeName = sessionCircle;
  }
  if (isValid(sessionDivision)) {
    officeName = sessionDivision;
  }
  if (isValid(sessionSubdivision)) {
    officeName = sessionSubdivision;
  }
  if (isValid(sessionDc)) {
    officeName = sessionDc;
  }

  const circleVal = (val) => val !== null && val !== 'null' && val !== '';

  let cirName = null;

  if (circleVal(sessionRegion)) {
    cirName = sessionRegion;
  }
  if (circleVal(sessionCircle)) {
    cirName = sessionCircle;
  }

  const emptyForm = {
    // officeName: "",
    // year: "",
    // empName: "",
    // designation: "",
    // empNumber: "",
    gpfNumber: '',
    district: '',
    subDistrict: '',
    village: '',
    residentialLocationNo: '',
    residentialArea: '',
    residentialValue: '',
    agricultureLocationNo: '',
    agricultureArea: '',
    agricultureValue: '',
    housingLocationNo: '',
    housingArea: '',
    housingValue: '',
    shopLocationNo: '',
    shopArea: '',
    shopValue: '',
    ownershipStatus: '',
    employeeRelation: '',
    acquisitionSource: '',
    acquisitionDate: '',
    acquisitionPerson: '',
    annualIncome: '',
    businessDetails: '',
    remark: '',
  };

  const [forms, setForms] = useState([emptyForm]);

  const currentYear = new Date().getFullYear() - 1;

  // Handle field change
  const handleChange = (index, field, value) => {
    const updated = [...forms];
    updated[index][field] = value;
    setForms(updated);
  };

  // Add new form
  const handleAdd = () => {
    setForms([...forms, { ...emptyForm }]);
  };

  // Delete form
  const handleDelete = (index) => {
    if (forms.length === 1) return;
    setForms(forms.filter((_, i) => i !== index));
  };

  // Submit Immovable Property
  const submitImmovableForm = async () => {
    const payload = forms.map((form) => ({
      empCode: sessionStorage.getItem('empCode'),
      gpfPranEpfNo: form.gpfNumber,
      district: form.district,
      subDistrict: form.subDistrict,
      talukaVillage: form.village,

      residentialLocation: form.residentialLocationNo,
      residentialSizeArea: parseFloat(form.residentialArea) || null,
      residentialPresentValue: parseFloat(form.residentialValue) || null,

      agriculturalLocation: form.agricultureLocationNo,
      agriculturalSizeArea: parseFloat(form.agricultureArea) || null,
      agriculturalPresentValue: parseFloat(form.agricultureValue) || null,

      housingLocation: form.housingLocationNo,
      housingSizeBuildUpArea: parseFloat(form.housingArea) || null,
      housingPresentValue: parseFloat(form.housingValue) || null,

      shopLocation: form.shopLocationNo,
      shopSizeBuildUpArea: parseFloat(form.shopArea) || null,
      shopPresentValue: parseFloat(form.shopValue) || null,

      ownershipStatus: form.ownershipStatus,
      relationWithBoard: form.employeeRelation,
      acquisitionMode: form.acquisitionSource,
      acquisitionDate: form.acquisitionDate,
      fromWhomAcquired: form.acquisitionPerson,
      annualIncome: parseFloat(form.annualIncome) || null,
      privateBusinessDetails: form.businessDetails,
      remarks: form.remark,
      createdBy: sessionStorage.getItem('empCode'),
      year: new Date().getFullYear(),
    }));

    // console.log('Payload to send:', payload);

    try {
      const response = await submitImmovableProperty(payload);
      // console.log(response);

      if (response.data.code === '200') {
        alert('Successfully Submitted');
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const [otp, setOtp] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Send OTP API
  const sendOtp = async () => {
    // if (selected.length === 0) {
    //   alert('Please select at least one record!');
    //   return;
    // }

    // if (!validate()) return;
    const payload = {
      username: sessionStorage.getItem('empCode'),
      source: 'OTP for approval of IMMOVABLE PROPERTY RETURN',
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
        source: 'OTP for approval of IMMOVABLE PROPERTY RETURN',
        otp: otp,
      };
      const response = await verifyOtp(payload);
      if (response.data.code === '200') {
        // alert('OTP verified successfully');
        submitImmovableForm();
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
      <Card className="shadow-lg rounded mt-4">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            MADHYA PRADESH MADHYA KSHETRA VIDYUT VITARAN COMPANY LIMITED BHOPAL
            IMMOVABLE PROPERTY RETURN DETAILS - As on DECEMBER {currentYear}{' '}
            (Year)
          </Typography>
        </Card.Header>

        <Card.Body>
          <div className="mt-3">
            {forms.map((form, index) => (
              <Card className="mt-4" key={index}>
                <Card.Header className="text-center">
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      color: '#0a1f83',
                    }}
                  >
                    Please fill all the Information
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col>
                      <Card className="mb-2">
                        <Card.Header>Circle</Card.Header>
                        <Card.Body>
                          <Form.Control disabled value={cirName} />
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col>
                      <Card className="mb-2">
                        <Card.Header>Name of Office</Card.Header>
                        <Card.Body>
                          <Form.Control disabled value={officeName} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card className="mb-2">
                        <Card.Header>Year</Card.Header>
                        <Card.Body>
                          <Form.Control disabled value={currentYear} />
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col>
                      <Card className="mb-2">
                        <Card.Header>Name of Officer/Employee</Card.Header>
                        <Card.Body>
                          <Form.Control disabled value={sessionEmpName} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card className="mb-2">
                        <Card.Header>Designation</Card.Header>
                        <Card.Body>
                          <Form.Control disabled value={designationName} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card className="mb-2">
                        <Card.Header>Employee Code</Card.Header>
                        <Card.Body>
                          <Form.Control disabled value={sessionEmpCode} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* ================= Location ================= */}
                  <Card className="mb-2">
                    <Card.Header>
                      Location in Which Property is Situated
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          <Card className="mb-2">
                            <Card.Header>GPF/PRAN/EPF Number</Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="number"
                                placeholder="Enter Number"
                                value={form.gpfNumber}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'gpfNumber',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={3}>
                          <Card className="mb-2">
                            <Card.Header>Name of District</Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={form.district}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'district',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={3}>
                          <Card className="mb-2">
                            <Card.Header>Sub District</Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={form.subDistrict}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'subDistrict',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={3}>
                          <Card className="mb-2">
                            <Card.Header>Taluka & Village</Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={form.village}
                                onChange={(e) =>
                                  handleChange(index, 'village', e.target.value)
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="mt-2">
                    <Card.Header>Name & Details of Property</Card.Header>
                    <Card.Body>
                      {/* ================= Land ================= */}
                      <Card className="mb-3">
                        <Card.Header>Land</Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Residential Location</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={form.residentialLocationNo}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'residentialLocationNo',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>
                                  Residential Area (sq. ft.)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Area"
                                    value={form.residentialArea}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'residentialArea',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>
                                  Residential Present Value
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Value"
                                    value={form.residentialValue}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'residentialValue',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Agriculture Location</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={form.agricultureLocationNo}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'agricultureLocationNo',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>
                                  Agriculture Area (sq. ft.)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Area"
                                    value={form.agricultureArea}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'agricultureArea',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Agriculture Value</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Value"
                                    value={form.agricultureValue}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'agricultureValue',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* ================= Housing & Other Building ================= */}
                      <Card className="mb-3">
                        <Card.Header>Housing & Other Building</Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Housing Location</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Location"
                                    value={form.housingLocationNo}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'housingLocationNo',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>
                                  Housing Area (sq. ft.)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Area"
                                    value={form.housingArea}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'housingArea',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Housing Present Value</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Value"
                                    value={form.housingValue}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'housingValue',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Shop Location</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={form.shopLocationNo}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'shopLocationNo',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Shop Area (sq. ft.)</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Area"
                                    value={form.shopArea}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'shopArea',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card className="mb-2">
                                <Card.Header>Shop Value</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Value"
                                    value={form.shopValue}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        'shopValue',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Card.Body>
                  </Card>

                  <Card className="mt-2">
                    <Card.Header>
                      Whether In Own Name Or In The Name of Spouse Or Family
                      Member "STATE" Relationship With Board Servant Share of
                      Board Servant Etc.
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Card className="mb-2">
                            <Card.Header>Ownership Status</Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="text"
                                placeholder="Enter Status"
                                value={form.ownershipStatus}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'ownershipStatus',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="mb-2">
                            <Card.Header>
                              Relationship with Employee
                            </Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="text"
                                placeholder="Enter Relationship"
                                value={form.employeeRelation}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'employeeRelation',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="mt-2">
                    <Card.Header>
                      How Acquired Whether Owned By Purchase Lease Or Mortgage
                      Or Gift Parental Or Other Wise With the Date of Acqusition
                      & Name With Details Of Person From Whom Acquired
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          <Card className="mb-2">
                            <Card.Header>Acquisition Mode & Source</Card.Header>
                            <Card.Body>
                              <Form.Control
                                as="textarea"
                                placeholder="Enter Source"
                                rows={1}
                                value={form.acquisitionSource}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'acquisitionSource',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="mb-2">
                            <Card.Header>Date of Acquisition</Card.Header>
                            <Card.Body>
                              <Form.Control
                                type="date"
                                value={form.acquisitionDate}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'acquisitionDate',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="mb-2">
                            <Card.Header>Person From Whom Acquired</Card.Header>
                            <Card.Body>
                              <Form.Control
                                as="textarea"
                                placeholder="Enter"
                                rows={1}
                                value={form.acquisitionPerson}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    'acquisitionPerson',
                                    e.target.value,
                                  )
                                }
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Row className="mt-2">
                    <Col md={4}>
                      <Card className="mb-2">
                        <Card.Header>Annual Income From Property</Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="number"
                            placeholder="Enter Annual Income"
                            value={form.annualIncome}
                            onChange={(e) =>
                              handleChange(
                                index,
                                'annualIncome',
                                e.target.value,
                              )
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={8}>
                      <Card className="mb-2">
                        <Card.Header>
                          Details Of Private Business Related With Board's
                          Cuitivators By The Spouse Family Member Alongwith the
                          Annual Income There From Also Indicate The Details of
                          Business.
                        </Card.Header>
                        <Card.Body>
                          <Form.Control
                            as="textarea"
                            placeholder="Enter Details"
                            rows={1}
                            value={form.businessDetails}
                            onChange={(e) =>
                              handleChange(
                                index,
                                'businessDetails',
                                e.target.value,
                              )
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card className="mb-2">
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter Remark"
                        rows={3}
                        value={form.remark}
                        onChange={(e) =>
                          handleChange(index, 'remark', e.target.value)
                        }
                      />
                    </Card.Body>
                  </Card>
                </Card.Body>

                <Card.Footer className="text-center">
                  <Tooltip title="Add More" arrow placement="top">
                    <Button
                      variant="contained"
                      className="me-2"
                      onClick={handleAdd}
                      color="dark"
                    >
                      <AddIcon color="primary" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Delete" arrow placement="top">
                    <Button
                      variant="contained"
                      className="me-2"
                      onClick={() => handleDelete(index)}
                      disabled={forms.length === 1}
                      color="dark"
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </Card.Body>
        <Card.Footer className="text-center mt-3">
          <Button
            className="cancel-button"
            variant="outlined"
            component={Link}
            to="/"
          >
            Close
          </Button>
          &nbsp;
          <Button
            variant="contained"
            className="green-button"
            onClick={sendOtp}
          >
            Submit
          </Button>
        </Card.Footer>
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
};

export default ImmovableProperty;
