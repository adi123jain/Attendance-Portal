import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Container, Form } from 'react-bootstrap';
import {
  Typography,
  Tooltip,
  Paper,
  Button,
  TextField,
  Backdrop,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Box,
  MenuItem,
  InputLabel,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { PropagateLoader } from 'react-spinners';
import {
  currentGradePay,
  submitMedicalReimbursement,
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
    // empName: "",
    // empDesignation: "",
    // empOfficeAddress: "",
    // empDepartment: "",
    // empResAddress: '',
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
  });

  const [opdClaimFor, setOpdClaimFor] = useState('');

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

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const [drugEntries, setDrugEntries] = useState([
    {
      shopName: '',
      cashMemoNo: '',
      cashMemoDate: '',
      drugName: '',
      quantity: '',
      totalValue: '',
      uploadMemo: null,
    },
  ]);

  // Handle input change
  const handleDrugChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedEntries = [...drugEntries];
    updatedEntries[index][name] = files ? files[0] : value;
    setDrugEntries(updatedEntries);
  };

  // Add new card
  const handleAdd = () => {
    setDrugEntries([
      ...drugEntries,
      {
        shopName: '',
        cashMemoNo: '',
        cashMemoDate: '',
        drugName: '',
        quantity: '',
        totalValue: '',
        uploadMemo: null,
      },
    ]);
  };

  // Delete card
  const handleDelete = (index) => {
    if (drugEntries.length === 1) return;
    const updatedEntries = drugEntries.filter((_, i) => i !== index);
    setDrugEntries(updatedEntries);
  };

  const [gradePays, setGradePays] = useState([]);
  const [selectedGradePay, setSelectedGradePay] = useState('');
  useEffect(() => {
    const fetchGradePay = async () => {
      try {
        const response = await currentGradePay();
        // console.log('API Response:', response);

        setGradePays(response.data.list || []);
      } catch (err) {
        console.error('Error fetching grade pay:', err);
      }
    };
    fetchGradePay();
  }, []);

  const handleSubmit = async () => {
    const dataToSend = new FormData();
    setOpenBackdrop(true);
    // Employee & Patient Info
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
      formData.essentialityCertificateNo || ''
    );
    if (formData.essentialityCertificate)
      dataToSend.append(
        'essentialityCertificatePdf',
        formData.essentialityCertificate || ''
      );
    dataToSend.append(
      'essentialityCertificateDate',
      formData.essentialityCertificateDate || ''
    );

    // Hospital & Doctor Info
    dataToSend.append('hospitalName', formData.hospitalName || '');
    dataToSend.append('hospitalAddress', formData.hospitalAddress || '');
    dataToSend.append('registrationNo', formData.registrationNo || '');
    dataToSend.append(
      'registrationValidity',
      formData.registrationValidity || ''
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
        formData.prolongedTreatment || ''
      );

    // Add medicines (drug entries)
    // drugEntries.forEach((entry, index) => {
    //   dataToSend.append(`medi[${index}].shopName`, entry.shopName || '');
    //   dataToSend.append(`medi[${index}].cashMemoNo`, entry.cashMemoNo || '');
    //   dataToSend.append(
    //     `medi[${index}].cashMemoDate`,
    //     entry.cashMemoDate || ''
    //   );
    //   dataToSend.append(`medi[${index}].drugName`, entry.drugName || '');
    //   dataToSend.append(`medi[${index}].quantity`, entry.quantity || '');
    //   dataToSend.append(`medi[${index}].totalValue`, entry.totalValue || '');
    //   if (entry.uploadMemo)
    //     dataToSend.append(`medi[${index}].memoDoc`, entry.uploadMemo);
    // });

    drugEntries.forEach((entry, index) => {
      // Only index 0 should send shop/memo details
      if (index === 0) {
        dataToSend.append(`medi[0].shopName`, entry.shopName || '');
        dataToSend.append(`medi[0].cashMemoNo`, entry.cashMemoNo || '');
        dataToSend.append(`medi[0].cashMemoDate`, entry.cashMemoDate || '');

        if (entry.uploadMemo) {
          dataToSend.append(`medi[0].memoDoc`, entry.uploadMemo);
        }
      }

      // These fields should always be sent for all rows
      // dataToSend.append(`medi[${index}].memoList[0].refNo`, entry.refNo || '');
      dataToSend.append(
        `medi[0].memoList[${index}].cashMemoNo`,
        entry.cashMemoNo || ''
      );
      dataToSend.append(
        `medi[0].memoList[${index}].drugName`,
        entry.drugName || ''
      );
      dataToSend.append(
        `medi[0].memoList[${index}].quantity`,
        entry.quantity || ''
      );
      dataToSend.append(
        `medi[0].memoList[${index}].totalValue`,
        entry.totalValue || ''
      );
    });

    // Debug: check FormData
    // for (let pair of dataToSend.entries()) {
    //   const payload = pair[0] + ":" + pair[1];
    //   console.log(payload);
    // }
    try {
      const response = await submitMedicalReimbursement(dataToSend);
      console.log('MR response', response);
      if (response.data.code == '200') {
        alert('Successfully Submitted!!');
        setOpenBackdrop(false);
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('error', error);
      setOpenBackdrop(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const minDate = sixMonthsAgo.toISOString().split('T')[0];

  const [shopName, setShopName] = useState('');
  const [cashMemoNo, setCashMemoNo] = useState('');
  const [cashMemoDate, setCashMemoDate] = useState('');
  const [uploadMemo, setUploadMemo] = useState(null);

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
          {/* Radio Control */}
          <Box display="flex" justifyContent="center">
            <FormControl component="fieldset">
              {/* <FormLabel>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "serif",
                    fontWeight: "bold",
                    color: "#0a1f83",
                  }}
                >
                  Select Form Type
                </Typography>
              </FormLabel> */}
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
                <FormControlLabel
                  value="IPD"
                  control={<Radio />}
                  label="IPD Form"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* <Divider sx={{ my: 2 }} /> */}

          {/* Common Fields */}
          <div className="my-4">
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={5} className="g-3">
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
                </Row>
              </Card.Body>
            </Card>

            {/* ================== PATIENT INFO ================== */}
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

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Card className="h-100">
                      <Card.Header>
                        In case of Children also give the following Information
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
                                {/* <Form.Control
                                  type="text"
                                  placeholder="Enter..."
                                  name="birthOrder"
                                  value={formData.birthOrder}
                                  onChange={handleChange}
                                /> */}

                                {/* <Select
                                  value={formData.birthOrder}
                                  displayEmpty
                                  onChange={handleChange}
                                  fullWidth
                                  name="birthOrder"
                                >
                                  <MenuItem value="" disabled selected>
                                    -- select --
                                  </MenuItem>
                                  <MenuItem value="1">First Child</MenuItem>
                                  <MenuItem value="2">Second Child</MenuItem>
                                </Select> */}

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

            {/* ================== DISEASE & DOCTOR ================== */}
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

            {/* ================== CERTIFICATE ================== */}
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={4} className="g-3">
                  {/* <Col>
                    <Card>
                      <Card.Header>
                        memo/cert. No. signed by Civil Surgeon/Hospital
                        Superintendent
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="number"
                          placeholder="Enter..."
                          name="certificateNo"
                          value={formData.certificateNo}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>
                        Dates memo/cert. signed by Civil Surgeon/Hospital
                        Superintendent
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="date"
                          name="certificateDate"
                          value={formData.certificateDate}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col> */}
                  <Col>
                    <Card>
                      <Card.Header>Total Amount Claimed</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
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
                          type="number"
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
                        Upload Form of Essentiality Certificate
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="file"
                          name="essentialityCertificate"
                          // value={formData.essentialityCertificate}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  {/* <Col md={4}>
                    <Card>
                      <Card.Header>Essentiality Certificate No</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="date"
                          name="essentialityCertificateNo"
                          value={formData.essentialityCertificateNo}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col> */}
                  <Col>
                    <Card>
                      <Card.Header>Essentiality Certificate Date</Card.Header>
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

                  <Col md={4}>
                    <Card>
                      <Card.Header>
                        Upload Certificate for Disease Requiring Prolonged
                        Treatment
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="file"
                          name="prolongedTreatment"
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>

          {/* Extra fields for IPD */}
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
                  {/* Hospital Details */}
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

                  {/* Packages and Tests */}

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

                    {/* <Col md={3}>
                      <Card>
                        <Card.Header>
                          Pay of the Government Employee (as defined in
                          Fundamental Rules,and any other Emoluments,Which
                          should be Shown separately)
                        </Card.Header>
                        <Card.Body>
                          <Form.Control
                            type="text"
                            name="emoluments"
                            placeholder="Enter..."
                            value={formData.emoluments}
                            onChange={handleChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col> */}

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

                  {/* Hospital Treatment */}
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

                          {/* Pathological Tests */}
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

                          {/* Other Charges */}
                          <Row className="g-3 mt-3">
                            {/* <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Special nursing (If employed on advice of
                                  Medical Officer, attach certificate
                                  countersigned by Medical Superintendent)
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="text"
                                    name="specialNursing"
                                    placeholder="Enter..."
                                    value={formData.specialNursing}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col> */}
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

                            {/* <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Upload Certificate for Disease Requiring
                                  Prolonged Treatment
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="file"
                                    name="prolongedTreatment"
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col> */}
                          </Row>

                          {/* <Row className="g-3 mt-3">
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Upload Form of Essentiality Certificate
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="file"
                                    name="essentialityCertificate"
                                    // value={formData.essentialityCertificate}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Essentiality Certificate No
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="date"
                                    name="essentialityCertificateNo"
                                    value={formData.essentialityCertificateNo}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Essentiality Certificate Date
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
                          </Row> */}

                          {/* <Row className="g-3 mt-3">
                            <Col md={4}>
                              <Card>
                                <Card.Header>
                                  Upload Certificate for Disease Requiring
                                  Prolonged Treatment
                                </Card.Header>
                                <Card.Body>
                                  <Form.Control
                                    type="file"
                                    name="prolongedTreatment"
                                    // value={formData.essentialityCertificate}
                                    onChange={handleChange}
                                  />
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row> */}
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
              <Card>
                <Card.Header>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      color: '#0a1f83',
                    }}
                  >
                    Medical Bill Entry Purchase
                  </Typography>
                </Card.Header>
                <Card.Body>
                  {drugEntries.map((entry, index) => (
                    <Row className="g-3" key={index}>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Name of the Shop</Form.Label>
                          <Form.Control
                            type="text"
                            name="shopName"
                            placeholder="Enter Name"
                            value={entry.shopName}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Cash Memo No</Form.Label>
                          <Form.Control
                            type="text"
                            name="cashMemoNo"
                            placeholder="Enter No"
                            value={entry.cashMemoNo}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Cash Memo Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="cashMemoDate"
                            value={entry.cashMemoDate}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Upload Memo</Form.Label>
                          <Form.Control
                            type="file"
                            name="uploadMemo"
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>

              {drugEntries.map((entry, index) => (
                <Card key={index} className="mb-3 mt-3 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center p-3">
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        color: '#0a1f83',
                      }}
                    >
                      Medical Bill Entry Purchase #{index + 1}
                    </Typography>
                    <div>
                      <Tooltip title="Add More" arrow placement="top">
                        <Button
                          variant="contained"
                          color="dark"
                          size="sm"
                          onClick={handleAdd}
                        >
                          <AddIcon color="primary" />
                        </Button>
                      </Tooltip>
                      &nbsp; &nbsp;
                      {drugEntries.length > 1 && (
                        <Tooltip title="Delete" arrow placement="top">
                          <Button
                            variant="contained"
                            size="sm"
                            color="dark"
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon color="error" />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Name of the Shop</Form.Label>
                          <Form.Control
                            type="text"
                            name="shopName"
                            placeholder="Enter Name"
                            value={entry.shopName}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Cash Memo No</Form.Label>
                          <Form.Control
                            type="text"
                            name="cashMemoNo"
                            placeholder="Enter No"
                            value={entry.cashMemoNo}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Cash Memo Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="cashMemoDate"
                            value={entry.cashMemoDate}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row> */}

                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Name of the Drug </Form.Label>
                          <Form.Control
                            type="text"
                            name="drugName"
                            placeholder="Enter Name"
                            value={entry.drugName}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity"
                            placeholder="Enter No."
                            value={entry.quantity}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Total Value</Form.Label>
                          <Form.Control
                            type="number"
                            name="totalValue"
                            placeholder="Enter No."
                            value={entry.totalValue}
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* <Row className="g-3 mt-2">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Upload Memo</Form.Label>
                          <Form.Control
                            type="file"
                            name="uploadMemo"
                            onChange={(e) => handleDrugChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row> */}
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

      {/* Backdrop Loader */}
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
