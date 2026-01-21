import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Form } from 'react-bootstrap';
import {
  Typography,
  Tooltip,
  Button,
  Backdrop,
  CardContent,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { PropagateLoader } from 'react-spinners';
import { submitMediclaim } from '../../../Services/Auth';

function MedicalHealthInsurance() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const sesEmpName = sessionStorage.getItem('fullName') || '';
  const sesEmpCode = sessionStorage.getItem('empCode') || '';
  const sesEmpDesignation = sessionStorage.getItem('designationName') || '';
  const sesEmpDepartment = sessionStorage.getItem('departmentName') || '';
  const sesEmpAdhaar = sessionStorage.getItem('adhaarNumber') || '';
  const sesEmpEmail = sessionStorage.getItem('email') || '';
  const sesEmpMobile = sessionStorage.getItem('mobileNo') || '';
  const sesEmpAddress = sessionStorage.getItem('address') || '';

  let storedDob = sessionStorage.getItem('dateOfBirth');
  if (storedDob) {
    const parts = storedDob.split('/');
    if (parts.length === 3) {
      storedDob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(
        2,
        '0',
      )}`;
    }
  }

  const relationLabels = [
    'Spouse',
    'First Child',
    'Second Child',
    'Third Child',
    'Father/Father-in-law',
    'Mother/Mother-in-law',
  ];

  const [formData, setFormData] = useState({
    schemeOption: '',
    optionalMobile: '',
    bloodGroup: '',
    familyId: '',
    members: Array.from({ length: 6 }, (_, i) => ({
      relation: relationLabels[i],
      fullName: '',
      status: '',
      isDependent: '',
      gender: '',
      bloodGroup: '',
      dob: '',
      adhaar: '',
    })),
  });

  const inputRefs = useRef({});

  const handleChange = (idxOrField, fieldOrValue, value) => {
    setFormData((prev) => {
      if (typeof idxOrField === 'number') {
        const updatedMembers = [...prev.members];
        updatedMembers[idxOrField] = {
          ...updatedMembers[idxOrField],
          [fieldOrValue]: value,
        };
        return { ...prev, members: updatedMembers };
      }
      return { ...prev, [idxOrField]: fieldOrValue };
    });
  };
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const validateForm = () => {
    // Optional Mobile
    if (formData.optionalMobile && formData.optionalMobile.length !== 10) {
      alert('Optional Mobile number must be 10 digits');
      inputRefs.current.optionalMobile.focus();
      return false;
    }

    // Blood Group
    if (!formData.bloodGroup) {
      alert('Blood Group is required');
      inputRefs.current.bloodGroup.focus();
      return false;
    }

    // Scheme Option
    if (!formData.schemeOption) {
      if (inputRefs.current['500']) {
        inputRefs.current['500'].focus();
      }
      alert('Please select a Scheme Option');
      return false;
    }

    // Updated Member Card Validation
    for (let i = 0; i < formData.members.length; i++) {
      const m = formData.members[i];
      const filledFields = [
        m.fullName,
        m.status,
        m.isDependent,
        m.gender,
        m.bloodGroup,
        m.dob,
        m.adhaar,
      ];

      const anyFieldFilled = filledFields.some(
        (val) => val && val.toString().trim() !== '',
      );
      const allFieldsFilled = filledFields.every(
        (val) => val && val.toString().trim() !== '',
      );

      // If user filled something but not all 7 fields
      if (anyFieldFilled && !allFieldsFilled) {
        alert(`Please fill all 7 fields for ${m.relation} card`);
        inputRefs.current[`member-${i}-fullName`]?.focus();
        return false;
      }

      // adhaar check — only if card is fully filled
      if (allFieldsFilled && m.adhaar.length !== 12) {
        alert(`${m.relation}'s adhaar must be 12 digits`);
        inputRefs.current[`member-${i}-adhaar`]?.focus();
        return false;
      }
    }

    return true;
  };

  const submitHealtheInsurance = async () => {
    if (!validateForm()) return;
    if (!sesEmpCode || isNaN(parseInt(sesEmpCode))) {
      alert(
        'Employee code is missing or invalid. Please re-login and try again.',
      );
      return;
    }

    setOpenBackdrop(true);

    const familyList = formData.members
      .filter((m) => {
        return (
          (m.fullName && m.fullName.trim() !== '') ||
          m.dob || // or m.dob !== "" if it's string
          (m.status && m.status.trim() !== '') ||
          (m.gender && m.gender.trim() !== '') ||
          (m.bloodGroup && m.bloodGroup.trim() !== '') ||
          (m.adhaar && m.adhaar.trim() !== '')
        );
      })
      .map((m) => ({
        relation: m.relation || '',
        fullName: m.fullName || '',
        dateOfBirth: m.dob || null,
        status: m.status || '',
        isDependent: m.isDependent || '',
        gender: m.gender || '',
        bloodGroup: m.bloodGroup || '',
        adhaarNumber: m.adhaar || '',
      }));

    const payload = {
      empCode: parseInt(sesEmpCode),
      optionOpt: parseInt(formData.schemeOption) || '',
      dateOfBirth: storedDob,
      presentAddress: sesEmpAddress,
      firstMobileNo: sesEmpMobile,
      otherMobileNo: formData.optionalMobile || '',
      bloodGroup: formData.bloodGroup || '',
      emailId: sesEmpEmail,
      familySamagraId: formData.familyId || '',
      familyList,
    };

    try {
      setOpenBackdrop(true);

      const response = await submitMediclaim(payload);
      if (response.data.code === '200') {
        alert('Submitted Successfully!');
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
        window.location.reload();
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded mt-4">
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>
          <Typography
            variant="h4"
            sx={{
              flex: 1,
              textAlign: 'center',
              color: '#0a1f83',
              mb: 0,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Medical Health Insurance
          </Typography>
        </Card.Header>

        <Card.Body>
          <div className="p-3">
            {/* Employee Details */}
            <Card className="mb-3 shadow-sm">
              <Card.Header>Employee Details</Card.Header>
              <Card.Body>
                <Row xs={1} md={4} className="g-3">
                  <Col>
                    <Card>
                      <Card.Header>Employee Name</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpName} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Employee Number</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpCode} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Designation</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpDesignation} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Department</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpDepartment} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>adhaar Number</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpAdhaar} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Mobile Number</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpMobile} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Email</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpEmail} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Date of Birth</Card.Header>
                      <Card.Body>
                        <Form.Control value={storedDob} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Address</Card.Header>
                      <Card.Body>
                        <Form.Control value={sesEmpAddress} disabled />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Optional Mobile Number</Card.Header>
                      <Card.Body>
                        <Form.Control
                          placeholder="Enter Optional Mobile Number"
                          type="number"
                          value={formData.optionalMobile}
                          onChange={(e) =>
                            handleChange('optionalMobile', e.target.value)
                          }
                          ref={(el) => (inputRefs.current.optionalMobile = el)}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Blood Group</Card.Header>
                      <Card.Body>
                        <Form.Select
                          value={formData.bloodGroup}
                          onChange={(e) =>
                            handleChange('bloodGroup', e.target.value)
                          }
                          ref={(el) => (inputRefs.current.bloodGroup = el)}
                        >
                          <option value="" disabled>
                            Select Blood Group
                          </option>
                          {[
                            'A+',
                            'A-',
                            'B+',
                            'B-',
                            'O+',
                            'O-',
                            'AB+',
                            'AB-',
                          ].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </Form.Select>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Family ID</Card.Header>
                      <Card.Body>
                        <Form.Control
                          placeholder="Enter Family Id"
                          value={formData.familyId}
                          onChange={(e) =>
                            handleChange('familyId', e.target.value)
                          }
                          ref={(el) => (inputRefs.current.familyId = el)}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header>Choose a Health Scheme</Card.Header>
              <Card.Body>
                <Row xs={1} md={3} className="g-3">
                  {[
                    {
                      value: '500',
                      title: 'Option 1',
                      details: [
                        'Beneficiary contribution Rs. 500 per month per family.',
                        'Health Risk Cover Rs. 5 lakh per year per family.',
                        'Ward Eligibility Rs. 3000 per day rent for private ward.',
                      ],
                      badge: 'Basic',
                      color: 'success',
                    },
                    {
                      value: '1000',
                      title: 'Option 2',
                      details: [
                        "Beneficiary contribution Rs. 1000 per month for family's care",
                        'Health Risk Cover Rs. 10 lakh per year per family (Complimentary annual preventive health checkup for all members)',
                        'Ward Eligibility Rs. 6000 per day rent for private ward',
                      ],
                      badge: 'Standard',
                      color: 'warning',
                    },
                    {
                      value: '2000',
                      title: 'Option 3',
                      details: [
                        'Beneficiary contribution Rs. 2000 per month per family',
                        'Health Risk Cover Rs. 25 lakh per year per family (Complimentary annual preventive health checkup for all members)',
                        'Ward Eligibility Rs. 6000 per day rent for private ward',
                      ],
                      badge: 'Premium',
                      color: 'danger',
                    },
                  ].map((option) => (
                    <Col key={option.value}>
                      <Card
                        className={`h-100 border-1 ${
                          formData.schemeOption === option.value
                            ? 'border-primary'
                            : 'border-light'
                        }`}
                        style={{
                          cursor: 'pointer',
                          transition: '0.3s',
                          position: 'relative',
                        }}
                        onClick={() =>
                          handleChange('schemeOption', option.value)
                        }
                      >
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <span>{option.title}</span>
                          <span
                            className={`badge bg-${option.color} text-white`}
                          >
                            {option.badge}
                          </span>
                        </Card.Header>
                        <Card.Body>
                          <Form.Check
                            type="radio"
                            name="schemeOption"
                            value={option.value}
                            checked={formData.schemeOption === option.value}
                            onChange={(e) =>
                              handleChange('schemeOption', e.target.value)
                            }
                            ref={(el) => {
                              if (el) inputRefs.current[option.value] = el;
                            }}
                            className="mb-3"
                          />
                          <ul
                            style={{ fontSize: '0.9rem', paddingLeft: '1rem' }}
                          >
                            {option.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </div>

          {/* Members */}
          <div className="p-3">
            {formData.members.map((member, idx) => (
              <Card key={idx} className="mb-3 shadow-sm">
                <Card.Header>{member.relation} Information</Card.Header>
                <Card.Body>
                  <Row xs={1} md={4} className="g-3">
                    <Col>
                      <Card>
                        <Card.Header>Name</Card.Header>
                        <Card.Body>
                          <Form.Control
                            value={member.fullName}
                            placeholder="Enter Name"
                            onChange={(e) =>
                              handleChange(idx, 'fullName', e.target.value)
                            }
                            ref={(el) =>
                              (inputRefs.current[`member-${idx}-fullName`] = el)
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Current Status</Card.Header>
                        <Card.Body>
                          <Form.Select
                            value={member.status}
                            onChange={(e) =>
                              handleChange(idx, 'status', e.target.value)
                            }
                          >
                            <option value="">-- Select Status --</option>
                            <option value="Alive">Alive</option>
                            <option value="Deceased">Deceased</option>
                          </Form.Select>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Is Dependent?</Card.Header>
                        <Card.Body>
                          <Form.Select
                            value={member.isDependent}
                            onChange={(e) =>
                              handleChange(idx, 'isDependent', e.target.value)
                            }
                          >
                            <option value="">-- Select Option --</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Form.Select>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Gender</Card.Header>
                        <Card.Body>
                          <Form.Select
                            value={member.gender}
                            onChange={(e) =>
                              handleChange(idx, 'gender', e.target.value)
                            }
                          >
                            <option value="">-- Select Gender --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row xs={1} md={3} className="g-3 mt-1">
                    <Col>
                      <Card>
                        <Card.Header>Blood Group</Card.Header>
                        <Card.Body>
                          <Form.Select
                            value={member.bloodGroup}
                            onChange={(e) =>
                              handleChange(idx, 'bloodGroup', e.target.value)
                            }
                          >
                            <option value="">-- Select Blood Group --</option>
                            {[
                              'A+',
                              'A-',
                              'B+',
                              'B-',
                              'O+',
                              'O-',
                              'AB+',
                              'AB-',
                            ].map((bg) => (
                              <option key={bg} value={bg}>
                                {bg}
                              </option>
                            ))}
                          </Form.Select>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Date of Birth</Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="date"
                            value={member.dob}
                            onChange={(e) =>
                              handleChange(idx, 'dob', e.target.value)
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>adhaar Number</Card.Header>
                        <Card.Body>
                          <Form.Control
                            placeholder="Enter adhaar Number"
                            type="number"
                            value={member.adhaar}
                            onChange={(e) =>
                              handleChange(idx, 'adhaar', e.target.value)
                            }
                            ref={(el) =>
                              (inputRefs.current[`member-${idx}-adhaar`] = el)
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="container my-5">
            <Card
              sx={{
                boxShadow: 6,

                background: 'linear-gradient(135deg, #fdfdfd, #f0f0f0)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 8 },
                fontFamily: "'Merriweather', serif",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: '#e2e2e2',
                  textAlign: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid #ccc',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: '#0a1f83',
                  }}
                >
                  कर्मचारी द्वारा घोषणा
                </Typography>
              </div>

              {/* Content */}
              <CardContent
                sx={{
                  fontSize: '15px',
                  textAlign: 'justify',
                  lineHeight: 1.6,
                  color: '#333',
                  paddingX: 4,
                  paddingY: 3,
                  fontFamily: 'serif',
                }}
              >
                <Typography paragraph sx={{ marginBottom: 2 }}>
                  मैं{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontFamily: "'Times New Roman', serif",
                    }}
                  >
                    {sesEmpName}
                  </span>{' '}
                  (नाम), पद{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontFamily: "'Times New Roman', serif",
                    }}
                  >
                    {sesEmpDesignation}
                  </span>
                  , कम्पनी{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontFamily: "'Times New Roman', serif",
                    }}
                  >
                    मध्य प्रदेश मध्य क्षेत्र विद्युत वितरण कंपनी लिमिटेड
                  </span>{' '}
                  एतद द्वारा घोषणा करता/करती हूँ कि मैंने म. प्र. पावर कम्पनी
                  अंशदायी केशलेस स्वास्थ्य योजना के सभी प्रावधानों को पढ़ लिया
                  है एवं भलीभाँति समझ लिया है। विशेष रूप से विकल्प परिवर्तन एवं
                  को-पे के उपबंधों को समझ लिया है।
                </Typography>

                <Typography paragraph sx={{ marginBottom: 2 }}>
                  मैं इस योजना में स्वयं तथा अपने परिवार को शामिल करने की पूर्ण
                  सहमति देता/देती हूँ।
                </Typography>

                <Typography paragraph sx={{ marginBottom: 2 }}>
                  म. प्र. राज्य पावर कम्पनी की अंशदायी (contributory) केशलेस
                  स्वास्थ्य योजना में शामिल होने हेतु मेरे द्वारा दी गई उपरोक्त
                  जानकारी पूर्णतः सही है। यदि मेरे द्वारा दी गई कोई भी जानकारी
                  भविष्य में गलत पाई जाती है तो मुझे स्वास्थ्य योजना से अपात्र
                  माना जाएगा एवं जमा किये गये अंशदान की राशि मुझे लौटाई नहीं
                  जाएगी। मैं योजना को अच्छी तरह से समझ कर उपलब्ध विकल्प के
                  अनुसार अपने अंशदान की आवश्यक कटौती वेतन/पेंशन से प्रतिमाह
                  कराने की सहमति देता/देती हूँ।
                </Typography>

                {/* Checkbox */}
                <div className="form-check mt-4 d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="declarationCheck"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor="declarationCheck"
                    style={{ fontWeight: 500, fontSize: '15.5px' }}
                  >
                    मैं उपरोक्त घोषणा से सहमत हूँ।
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card.Body>

        <Card.Footer>
          <div className="text-center mt-4 mb-3">
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
              onClick={submitHealtheInsurance}
              disabled={!isChecked}
              variant="contained"
              className={isChecked ? 'green-button' : 'button-disabled'}
            >
              Submit
            </Button>
          </div>
        </Card.Footer>
      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default MedicalHealthInsurance;
