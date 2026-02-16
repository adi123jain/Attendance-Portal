import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Form } from 'react-bootstrap';
import {
  Typography,
  Tooltip,
  Button,
  Backdrop,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { PropagateLoader } from 'react-spinners';
import {
  currentGradePay,
  submitMedicalReimbursement,
  submitMedicineDetails,
} from '../../../Services/Auth';

function MedicalReimbirsement() {
  const sessionRegion = sessionStorage.getItem('regionName');
  const sessionCircle = sessionStorage.getItem('circleName');
  const sessionDivision = sessionStorage.getItem('divisionName');
  const sessionSubdivision = sessionStorage.getItem('subdivisionName');
  const sessionDc = sessionStorage.getItem('dcName');
  const designationName = sessionStorage.getItem('designationName');
  const sessionEmpCode = sessionStorage.getItem('empCode');
  const sessionEmpName = sessionStorage.getItem('fullName');
  const departmentName = sessionStorage.getItem('departmentName');
  const empAddress = sessionStorage.getItem('address');

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

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [formType, setFormType] = useState('OPD');

  const [formData, setFormData] = useState({
    childDOB: '',
    birthOrder: '',
    totalChildren: '',
    patientName: '',
    patientRelation: '',
    opdNo: '',
    opdDate: '',
    diseaseName: '',
    diseaseDuration: '',
    doctorName: '',
    doctorDesignation: '',
    certificateNo: '',
    certificateDate: '',
    totalAmountClaimed: '',

    hospitalName: '',
    hospitalAddress: '',
    registrationNo: '',
    registrationValidity: '',
    packageClaimed: '',
    // emoluments: "",
    testHospital: '',
    testOnAdvice: '',
    accommodationFile: '',
    diet: '',
    surgery: '',
    pathologyHospital: '',
    pathologyCertificate: '',
    nursing: '',
    // specialNursing: "",
    otherCharges: '',
    enclosures: '',
    essentialityCertificate: '',
    essentialityCertificateNo: '',
    essentialityCertificateDate: '',
    placeOfIllness: '',
    prolongedTreatment: '',
    uploadMemo: '',

    bankName: '',
    bankIfsc: '',
    bankAccount: '',
  });

  const [opdClaimFor, setOpdClaimFor] = useState('');

  const decodedData = useMemo(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }, []);

  const [bankDisabled, setBankDisabled] = useState(false);

  useEffect(() => {
    if (decodedData) {
      const hasBankData =
        decodedData.bankName || decodedData.bankIfsc || decodedData.bankAccount;

      if (hasBankData) {
        setFormData((prev) => ({
          ...prev,
          bankName: decodedData.bankName || '',
          bankIfsc: decodedData.bankIfsc || '',
          bankAccount: decodedData.bankAccount || '',
        }));

        setBankDisabled(true);
      }
    }
  }, [decodedData]);

  const handleOPDClaimChange = (value) => {
    setOpdClaimFor(value);

    if (value === 'Self') {
      setFormData({
        ...formData,
        patientName: sessionEmpName || '',
        patientRelation: 'Self',
      });
    } else {
      setFormData({
        ...formData,
        patientName: '',
        patientRelation: '',
      });
    }
  };

  // const handleChange = (e) => {
  //   const { name, value, files, type } = e.target;

  //   // Limit totalAmountClaimed to max 20,000
  //   if (name === 'totalAmountClaimed') {
  //     const amount = Number(value);

  //     // Prevent typing above 20000
  //     if (amount > 20000) {
  //       alert('Maximum claim allowed is ₹20,000.');
  //       return;
  //     }
  //   }

  //   setFormData({
  //     ...formData,
  //     [name]: type === 'file' ? files[0] : value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Limit totalAmountClaimed to max 20,000
    if (name === 'totalAmountClaimed') {
      const amount = Number(value);

      if (amount > 20000) {
        alert('Maximum claim allowed is ₹20,000.');
        return;
      }
    }

    // File size validation (Max 5MB)
    if (type === 'file') {
      const file = files[0];

      if (file) {
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
          alert('File size must be less than 5MB.');
          e.target.value = null;
          return;
        }
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const [gradePays, setGradePays] = useState([]);
  const [selectedGradePay, setSelectedGradePay] = useState('');
  useEffect(() => {
    const fetchGradePay = async () => {
      try {
        const response = await currentGradePay();
        setGradePays(response.data.list || []);
      } catch (err) {
        console.error('Error fetching grade pay:', err);
      }
    };
    fetchGradePay();
  }, []);

  const [drugEntries, setDrugEntries] = useState([
    {
      shopName: '',
      cashMemoNo: '',
      cashMemoDate: '',
      // uploadMemo: null,
      drugs: [{ drugName: '', quantity: '', totalValue: '' }],
    },
  ]);

  const handleDrugChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...drugEntries];
    updated[index][name] = files ? files[0] : value;
    setDrugEntries(updated);
  };

  const handleNestedDrugChange = (entryIdx, drugIdx, e) => {
    const { name, value, files } = e.target;
    const updated = [...drugEntries];
    const drugList = updated[entryIdx].drugs.map((d, i) =>
      i === drugIdx ? { ...d, [name]: files ? files[0] : value } : d,
    );
    updated[entryIdx].drugs = drugList;
    setDrugEntries(updated);
  };

  const handleDelete = (index) => {
    if (drugEntries.length === 1) return;
    const updated = drugEntries.filter((_, i) => i !== index);
    setDrugEntries(updated);
  };

  const addDrugToEntry = (entryIdx) => {
    const updated = [...drugEntries];
    updated[entryIdx].drugs.push({
      drugName: '',
      quantity: '',
      totalValue: '',
      // uploadMemo: null,
    });
    setDrugEntries(updated);
  };

  const deleteDrugFromEntry = (entryIdx, drugIdx) => {
    const updated = [...drugEntries];
    if (updated[entryIdx].drugs.length === 1) return;
    updated[entryIdx].drugs = updated[entryIdx].drugs.filter(
      (_, i) => i !== drugIdx,
    );
    setDrugEntries(updated);
  };

  const handleSubmit = async () => {
    const dataToSend = new FormData();
    setOpenBackdrop(true);

    dataToSend.append('empCode', sessionEmpCode || '');
    dataToSend.append('presentAddress', empAddress || '');
    dataToSend.append('childDob', formData.childDOB || '');
    dataToSend.append('noInBirthOrder', formData.birthOrder || '');
    dataToSend.append('noOfLivingChildren', formData.totalChildren || '');
    dataToSend.append('patientName', formData.patientName || '');
    dataToSend.append('patientRelation', formData.patientRelation || '');
    dataToSend.append('opdNo', formData.opdNo || '');
    dataToSend.append('opdDate', formData.opdDate || '');
    dataToSend.append('natureOfIllness', formData.diseaseName || '');
    dataToSend.append('illnessDuration', formData.diseaseDuration || '');
    dataToSend.append('doctorName', formData.doctorName || '');
    dataToSend.append('doctorDesignation', formData.doctorDesignation || '');
    dataToSend.append('totalAmount', formData.totalAmountClaimed);
    dataToSend.append('gradePay', selectedGradePay || '');
    dataToSend.append('placeOfIllness', formData.placeOfIllness || '');
    dataToSend.append(
      'essentialityCertificateNo',
      formData.essentialityCertificateNo || '',
    );
    if (formData.essentialityCertificate)
      dataToSend.append(
        'essentialityCertificatePdf',
        formData.essentialityCertificate || '',
      );
    dataToSend.append(
      'essentialityCertificateDate',
      formData.essentialityCertificateDate || '',
    );

    // Hospital & Doctor Info
    dataToSend.append('hospitalName', formData.hospitalName || '');
    dataToSend.append('hospitalAddress', formData.hospitalAddress || '');
    dataToSend.append('registrationNo', formData.registrationNo || '');
    dataToSend.append(
      'registrationValidity',
      formData.registrationValidity || '',
    );

    dataToSend.append('packageType', formData.packageClaimed || '');
    dataToSend.append('testingHosLabName', formData.testHospital || '');
    dataToSend.append('test1AuthorizedByDoctor', formData.testOnAdvice || '');

    if (formData.accommodationFile)
      dataToSend.append('accommodationPdf', formData.accommodationFile);
    dataToSend.append('dietCost', formData.diet);
    dataToSend.append('surgicalMedicalCharges', formData.surgery);
    // dataToSend.append("anyTest", formData.anyTest || "");
    dataToSend.append('testHosLabName', formData.pathologyHospital || '');
    if (formData.pathologyCertificate)
      dataToSend.append('testPrescriptionDoc', formData.pathologyCertificate);
    dataToSend.append('nursuingDetail', formData.nursing || '');
    dataToSend.append('anyOther', formData.otherCharges || '');
    if (formData.enclosures)
      dataToSend.append('enclosureDoc', formData.enclosures || '');

    dataToSend.append('type', formType);

    if (formData.prolongedTreatment)
      dataToSend.append(
        'prolongedTreatment',
        formData.prolongedTreatment || '',
      );

    if (formData.uploadMemo)
      dataToSend.append('memoDoc', formData.uploadMemo || '');
    dataToSend.append('bankName', formData.bankName || '');
    dataToSend.append('bankIfsc', formData.bankIfsc || '');
    dataToSend.append('bankAccount', formData.bankAccount || '');

    try {
      const response = await submitMedicalReimbursement(dataToSend);
      if (response.data.code === '200') {
        alert('Successfully Submitted!!');
        medicineSubmission(response.data.list[0].refNo);
        setOpenBackdrop(false);
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('error', error);
      alert('Something went wrong');
    } finally {
      setOpenBackdrop(false);
    }
  };

  const medicineSubmission = async (refNo) => {
    const mediPayload = {
      refNo: refNo,
      shopName: drugEntries[0]?.shopName || '',
      cashMemoNo: drugEntries[0]?.cashMemoNo || '',
      cashMemoDate: drugEntries[0]?.cashMemoDate || '',
      memoList: [],
      updatedBy: sessionEmpCode,
    };

    // Add memoList from drugEntries
    drugEntries.forEach((entry) => {
      entry.drugs.forEach((drug) => {
        mediPayload.memoList.push({
          cashMemoNo: entry.cashMemoNo || '',
          drugName: drug.drugName || '',
          quantity: drug.quantity || '',
          totalValue: drug.totalValue || '',
        });
      });
    });

    try {
      const response = await submitMedicineDetails(mediPayload);
      if (response.data.code === '200') {
        // window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error', error);
      alert('Something went wrong');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const minDate = sixMonthsAgo.toISOString().split('T')[0];

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
            Medical Reimbursement
          </Typography>
        </Card.Header>

        <Card.Body>
          <Box display="flex" justifyContent="center">
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <FormControlLabel
                  value="OPD"
                  control={<Radio />}
                  label="OPD Form"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <div className="my-4">
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={4} className="g-3">
                  <Col>
                    <Card>
                      <Card.Header>Name of Govt. Employee</Card.Header>
                      <Card.Body>
                        <Form.Control value={sessionEmpName} disabled />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Designation of Govt. Employee</Card.Header>
                      <Card.Body>
                        <Form.Control value={designationName} disabled />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>
                        Office Address of Govt. Employee
                      </Card.Header>
                      <Card.Body>
                        <Form.Control disabled value={officeName} />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Department of Govt. Employee</Card.Header>
                      <Card.Body>
                        <Form.Control
                          disabled
                          value={departmentName}
                        ></Form.Control>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row xs={1} md={4} className="g-3 mt-2">
                  <Col>
                    <Card className="h-100">
                      <Card.Header>
                        Residential Address of Govt. Employee
                      </Card.Header>
                      <Card.Body>
                        <Form.Control disabled value={empAddress} />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Bank Name</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Bank Name"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          disabled={bankDisabled}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Bank IFSC</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Bank IFSC"
                          name="bankIfsc"
                          value={formData.bankIfsc}
                          onChange={handleChange}
                          disabled={bankDisabled}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Account No</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Account Number"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleChange}
                          disabled={bankDisabled}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={5} className="g-3">
                  <Col>
                    <Card>
                      <Card.Header>OPD Claiming for</Card.Header>
                      <Card.Body>
                        <Form.Select
                          value={opdClaimFor}
                          onChange={(e) => handleOPDClaimChange(e.target.value)}
                        >
                          <option value="" disabled>
                            -- select --
                          </option>
                          <option value="Self">Self</option>
                          <option value="Dependent">Dependent</option>
                        </Form.Select>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Name of the Patient</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Name..."
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleChange}
                          readOnly={opdClaimFor === 'Self'}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>
                        Patient relationship with Employee
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter..."
                          name="patientRelation"
                          value={formData.patientRelation}
                          onChange={handleChange}
                          readOnly={opdClaimFor === 'Self'}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>OPD No. on Prescription</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter No..."
                          name="opdNo"
                          value={formData.opdNo}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Prescription Date</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="date"
                          name="opdDate"
                          value={formData.opdDate}
                          onChange={handleChange}
                          min={minDate}
                          max={today}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {opdClaimFor !== 'Self' && (
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={12}>
                      <Card className="h-100">
                        <Card.Header>
                          In case of Children also give the following
                          Information
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-3">
                            <Col md={4}>
                              <Card>
                                <Card.Header>Date of Birth</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="date"
                                    name="childDOB"
                                    value={formData.childDOB}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>No. in order of Birth</Card.Header>
                                <Card.Body>
                                  <Form.Select
                                    value={formData.birthOrder}
                                    // displayEmpty
                                    onChange={handleChange}
                                    // fullWidth
                                    name="birthOrder"
                                  >
                                    <option value="" disabled selected>
                                      -- select --
                                    </option>
                                    <option value="1">First Child</option>
                                    <option value="2">Second Child</option>
                                  </Form.Select>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Total No. of Living Children
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter..."
                                    name="totalChildren"
                                    value={formData.totalChildren}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={4} className="g-3">
                  <Col>
                    <Card>
                      <Card.Header>Name of the Disease</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter..."
                          name="diseaseName"
                          value={formData.diseaseName}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>
                        Disease Duration (With Specific Dates)
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="date"
                          name="diseaseDuration"
                          value={formData.diseaseDuration}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Authorized Doctor Name</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Name"
                          name="doctorName"
                          value={formData.doctorName}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>Authorized Doctor Designation</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Designation"
                          name="doctorDesignation"
                          value={formData.doctorDesignation}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={4} className="g-3">
                  <Col>
                    <Card>
                      <Card.Header>Total Amount Claimed</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="number"
                          placeholder="Enter..."
                          name="totalAmountClaimed"
                          value={formData.totalAmountClaimed}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Grade Pay</Card.Header>
                      <Card.Body>
                        <Form.Select
                          value={selectedGradePay}
                          onChange={(e) => setSelectedGradePay(e.target.value)}
                        >
                          <option value="" disabled>
                            -- select Grade Pay --
                          </option>
                          {gradePays.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.payBand}
                            </option>
                          ))}
                        </Form.Select>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>
                        Place at which the patient fell ill
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter..."
                          name="placeOfIllness"
                          value={formData.placeOfIllness}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Essentiality Certificate No</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter Number"
                          name="essentialityCertificateNo"
                          value={formData.essentialityCertificateNo}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row xs={1} md={4} className="g-3 mt-2">
                  <Col>
                    <Card>
                      <Card.Header>
                        Essentiality Cert/Lab Docs/Supporting Docs
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="file"
                          name="essentialityCertificate"
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>
                        Essentiality Cert/Lab Docs/Supporting Docs Date
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="date"
                          name="essentialityCertificateDate"
                          value={formData.essentialityCertificateDate}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Upload Prolonged Certificate</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="file"
                          name="prolongedTreatment"
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Upload Memo (Bill/Memo File)</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="file"
                          name="uploadMemo"
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>

          {formType === 'IPD' && (
            <>
              <Card className="mb-3">
                <Card.Header className="text-center p-3">
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      color: '#0a1f83',
                    }}
                  >
                    Details for Medical Reimbursement
                  </Typography>
                </Card.Header>

                <Card.Body>
                  <Row xs={1} md={4} className="mt-2 g-3">
                    <Col>
                      <Card>
                        <Card.Header>
                          Name of the Hospital (Empanelled/Non-Empanelled)
                        </Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="text"
                            name="hospitalName"
                            placeholder="Enter Name"
                            value={formData.hospitalName}
                            onChange={handleChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Address of the Hospital</Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="text"
                            name="hospitalAddress"
                            placeholder="Enter Address"
                            value={formData.hospitalAddress}
                            onChange={handleChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Registration No.</Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="number"
                            name="registrationNo"
                            placeholder="Enter Reg Number"
                            value={formData.registrationNo}
                            onChange={handleChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                      <Card>
                        <Card.Header>Validity of Registration</Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="date"
                            name="registrationValidity"
                            value={formData.registrationValidity}
                            onChange={handleChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="mt-3 g-3">
                    <Col md={3}>
                      <Card>
                        <Card.Header>
                          Packages under which Medical Reimbursement is being
                          Claimed
                        </Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="text"
                            name="packageClaimed"
                            placeholder="Enter..."
                            value={formData.packageClaimed}
                            onChange={handleChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={9}>
                      <Card>
                        <Card.Header>
                          Charges for pathological, bacteriological,
                          radiological or other similar tests undertaken during
                          diagnosis indicating
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-3">
                            <Col md={6}>
                              <Card>
                                <Card.Header>
                                  (a) the name of the hospital or laboratory
                                  where the tests were undertaken
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    name="testHospital"
                                    placeholder="Enter..."
                                    value={formData.testHospital}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={6}>
                              <Card>
                                <Card.Header>
                                  (b) whether the test was undertaken on the
                                  advice of the authorized doctor
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    name="testOnAdvice"
                                    placeholder="Enter..."
                                    value={formData.testOnAdvice}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Card>
                        <Card.Header className="text-center p-3">
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: 'serif',
                              fontWeight: 'bold',
                              color: '#0a1f83',
                            }}
                          >
                            Charges for hospital treatment indicating separately
                            charges for
                          </Typography>
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-3">
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Accommodation (Attach certificate stating the
                                  type of accommodation: General
                                  ward/Semi-private/Private ward/ICU during
                                  in-patient stay)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="file"
                                    name="accommodationFile"
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>Diet Cost</Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="number"
                                    name="diet"
                                    placeholder="Enter..."
                                    value={formData.diet}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Surgical operation or medical treatment
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    name="surgery"
                                    placeholder="Enter..."
                                    value={formData.surgery}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>

                          <Card className="mt-3">
                            <Card.Header className="text-center p-3">
                              <Typography
                                variant="h5"
                                sx={{
                                  fontFamily: 'serif',
                                  fontWeight: 'bold',
                                  color: '#0a1f83',
                                }}
                              >
                                Pathological, bacteriological or other similar
                                tests indicating—
                              </Typography>
                            </Card.Header>
                            <Card.Body>
                              <Row className="g-3">
                                <Col md={4}>
                                  <Card>
                                    <Card.Header>
                                      (a) the name of hospital or laboratory at
                                      which undertaken
                                    </Card.Header>
                                    <Card.Body>
                                      <Form.Control
                                        type="text"
                                        name="pathologyHospital"
                                        placeholder="Enter..."
                                        value={formData.pathologyHospital}
                                        onChange={handleChange}
                                      />
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={4}>
                                  <Card>
                                    <Card.Header>
                                      (b) whether undertaken on the advice of
                                      Medical Officer in-charge (attach
                                      certificate if applicable)
                                    </Card.Header>
                                    <Card.Body>
                                      <Form.Control
                                        type="file"
                                        name="pathologyCertificate"
                                        onChange={handleChange}
                                      />
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={4}>
                                  <Card>
                                    <Card.Header>Ordinary Nursing</Card.Header>
                                    <Card.Body>
                                      <Form.Control
                                        type="text"
                                        name="nursing"
                                        placeholder="Enter..."
                                        value={formData.nursing}
                                        onChange={handleChange}
                                      />
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>

                          <Row className="g-3 mt-3">
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Any other charges (e.g., fan, heater, AC etc.
                                  State if normally provided to all patients and
                                  no choice was left)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    name="otherCharges"
                                    placeholder="Enter..."
                                    value={formData.otherCharges}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  List of enclosures (Including Prescription in
                                  original/photocopy mentioning OPD & IPD No. &
                                  Date)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="file"
                                    name="enclosures"
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}

          <Card className="mt-3">
            <Card.Header className="text-center p-2">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#0a1f83',
                }}
              >
                Drug Entries
              </Typography>
            </Card.Header>
            <Card.Body>
              {drugEntries.map((entry, eIdx) => (
                <Card key={eIdx} className="mb-4 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center p-3">
                    <h5>Medical Bill Entry #{eIdx + 1}</h5>
                    <div className="d-flex gap-1">
                      {drugEntries.length > 1 && (
                        <Tooltip title="Delete Entry" arrow placement="top">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleDelete(eIdx)}
                            color="dark"
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </Card.Header>

                  <Card.Body>
                    <Card
                      className="mb-3 p-3 border rounded-3"
                      style={{ backgroundColor: '#f8f9fa' }}
                    >
                      <Row className="g-3 mb-3">
                        <Col>
                          <Form.Group>
                            <Form.Label>Name of the Shop</Form.Label>
                            <Form.Control
                              type="text"
                              name="shopName"
                              placeholder="Enter Name"
                              value={entry.shopName}
                              onChange={(e) => handleDrugChange(eIdx, e)}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Cash Memo No</Form.Label>
                            <Form.Control
                              type="text"
                              name="cashMemoNo"
                              placeholder="Enter Number"
                              value={entry.cashMemoNo}
                              onChange={(e) => handleDrugChange(eIdx, e)}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Cash Memo Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="cashMemoDate"
                              value={entry.cashMemoDate}
                              onChange={(e) => handleDrugChange(eIdx, e)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card>

                    {entry.drugs.map((drug, dIdx) => (
                      <Card
                        key={dIdx}
                        className="mb-3 p-3 border rounded-3"
                        style={{ backgroundColor: '#f8f9fa' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Drug #{dIdx + 1}</strong>
                          {entry.drugs.length > 1 && (
                            <Tooltip title="Remove Drug" arrow placement="top">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => deleteDrugFromEntry(eIdx, dIdx)}
                                color="dark"
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </Button>
                            </Tooltip>
                          )}
                        </div>

                        <Row className="g-3">
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Drug Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="drugName"
                                placeholder="Enter Name"
                                value={drug.drugName}
                                onChange={(e) =>
                                  handleNestedDrugChange(eIdx, dIdx, e)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Quantity</Form.Label>
                              <Form.Control
                                type="number"
                                name="quantity"
                                placeholder="Enter Quantity"
                                value={drug.quantity}
                                onChange={(e) =>
                                  handleNestedDrugChange(eIdx, dIdx, e)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Total Value</Form.Label>
                              <Form.Control
                                type="number"
                                name="totalValue"
                                placeholder="Enter Value"
                                value={drug.totalValue}
                                onChange={(e) =>
                                  handleNestedDrugChange(eIdx, dIdx, e)
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    <Tooltip title="Add Drug" arrow placement="top">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => addDrugToEntry(eIdx)}
                        color="dark"
                      >
                        <AddIcon fontSize="small" color="secondary" />
                      </Button>
                    </Tooltip>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
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
              onClick={handleSubmit}
              className="green-button"
              variant="outlined"
              style={{
                borderRadius: '20px',
                backgroundColor: '#0a1f83',
                color: '#fff',
                padding: '6px 20px',
                border: 'none',
              }}
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

export default MedicalReimbirsement;
