import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Form } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Typography,
  Tooltip,
  Paper,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Backdrop,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
  TableRow,
  TableCell,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { PropagateLoader } from 'react-spinners';
import {
  currentGradePay,
  deteleDrugDetails,
  getDrugDetails,
  submitMedicineDetails,
  updateMedicalForm,
} from '../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function MedicalFormUpdate() {
  const navigate = useNavigate();
  const sessionRegion = sessionStorage.getItem('regionName');
  const sessionCircle = sessionStorage.getItem('circleName');
  const sessionDivision = sessionStorage.getItem('divisionName');
  const sessionSubdivision = sessionStorage.getItem('subdivisionName');
  const sessionDc = sessionStorage.getItem('dcName');
  const designationName = sessionStorage.getItem('designationName');
  const sessionEmpName = sessionStorage.getItem('fullName');
  const departmentName = sessionStorage.getItem('departmentName');

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
    empResAddress: '',
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
    totalAmountClaimed: '',
    essentialityCertificate: '',
    essentialityCertificateNo: '',
    essentialityCertificateDate: '',
    placeOfIllness: '',
    prolongedTreatment: '',
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const location = useLocation();
  const { item: preItem } = location.state || {};

  const [drugEntry, setDrugEntry] = useState([]);
  useEffect(() => {
    const fetchDrugsDetails = async () => {
      try {
        const response = await getDrugDetails(preItem.refNo);
        if (response.data.code === '200') {
          setDrugEntry(response.data.list);
        } else {
          setDrugEntry([]);
        }
      } catch (error) {
        console.log('Error', error);
      }
    };
    fetchDrugsDetails();
  }, []);

  useEffect(() => {
    if (preItem) {
      setFormData((prev) => ({
        ...prev,
        empResAddress: preItem.presentAddress || '',
        childDOB: preItem.childDob || '',
        birthOrder: preItem.noInBirthOrder || '',
        totalChildren: preItem.noOfLivingChildren || '',
        patientName: preItem.patientName || '',
        patientRelation: preItem.patientRelation || '',
        opdNo: preItem.opdNo || '',
        opdDate: preItem.opdDate || '',
        diseaseName: preItem.natureOfIllness || '',
        diseaseDuration: preItem.illnessDuration || '',
        doctorName: preItem.doctorName || '',
        doctorDesignation: preItem.doctorDesignation || '',
        essentialityCertificateNo: preItem.essentialityCertificateNo || '',
        essentialityCertificate: '', // File
        essentialityCertificateDate: preItem.essentialityCertificateDate || '',
        totalAmountClaimed: preItem.totalAmount || '',
        placeOfIllness: preItem.placeOfIllness || '',
        prolongedTreatment: '', // File

        // hospitalName: preItem.hospitalName || '',
        // hospitalAddress: preItem.hospitalAddress || '',
        // registrationNo: preItem.registrationNo || '',
        // registrationValidity: preItem.registrationValidity || '',
        // packageClaimed: preItem.packageType || '',
        // testHospital: preItem.testingHosLabName || '',
        // testOnAdvice: preItem.test1AuthorizedByDoctor || '',
        // accommodationFile: '', //  File
        // diet: preItem.dietCost || '',
        // surgery: preItem.surgicalMedicalCharges || '',
        // pathologyHospital: preItem.testHosLabName || '',
        // pathologyCertificate: '', // File
        // nursing: preItem.nursuingDetail || '',
        // otherCharges: preItem.anyOther || '',
        // enclosures: '', // File
      }));
    }
    setSelectedGradePay(preItem.gradePay || '');
  }, [preItem]);

  const [drugEntries, setDrugEntries] = useState([
    {
      shopName: '',
      cashMemoNo: '',
      cashMemoDate: '',
      // uploadMemo: null,
      drugs: [{ drugName: '', quantity: '', totalValue: '' }],
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
  // const handleAdd = () => {
  //   setDrugEntries([
  //     ...drugEntries,
  //     {
  //       shopName: '',
  //       cashMemoNo: '',
  //       cashMemoDate: '',
  //       drugName: '',
  //       quantity: '',
  //       totalValue: '',
  //       uploadMemo: null,
  //     },
  //   ]);
  // };

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
        setGradePays(response.data.list || []);
      } catch (err) {
        console.error('Error fetching grade pay:', err);
      }
    };
    fetchGradePay();
  }, []);

  const canUpdate =
    preItem.appliPresentAtEmpCode == sessionStorage.getItem('empCode');

  const handleUpdate = async () => {
    const dataToSend = new FormData();
    if (!canUpdate) {
      alert('You are not able to update this.');
      return;
    }
    setOpenBackdrop(true);
    // Employee & Patient Info
    dataToSend.append('empCode', sessionStorage.getItem('empCode') || '');
    dataToSend.append('presentAddress', formData.empResAddress || '');
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

    // hospitalName: '',
    // hospitalAddress: '',
    // registrationNo: '',
    // registrationValidity: '',
    // packageClaimed: '',
    // testHospital: '',
    // testOnAdvice: '',
    // accommodationFile: '',
    // diet: '',
    // surgery: '',
    // pathologyHospital: '',
    // pathologyCertificate: '',
    // nursing: '',
    // otherCharges: '',
    // enclosures: '',
    // Hospital & Doctor Info
    // dataToSend.append('hospitalName', formData.hospitalName || '');
    // dataToSend.append('hospitalAddress', formData.hospitalAddress || '');
    // dataToSend.append('registrationNo', formData.registrationNo || '');
    // dataToSend.append(
    //   'registrationValidity',
    //   formData.registrationValidity || '',
    // );

    // dataToSend.append('packageType', formData.packageClaimed || '');
    // dataToSend.append('testingHosLabName', formData.testHospital || '');
    // dataToSend.append('test1AuthorizedByDoctor', formData.testOnAdvice || '');

    // if (formData.accommodationFile)
    //   dataToSend.append('accommodationPdf', formData.accommodationFile);
    // dataToSend.append('dietCost', formData.diet);
    // dataToSend.append('surgicalMedicalCharges', formData.surgery);
    // // dataToSend.append("anyTest", formData.anyTest || "");
    // dataToSend.append('testHosLabName', formData.pathologyHospital || '');
    // if (formData.pathologyCertificate)
    //   dataToSend.append('testPrescriptionDoc', formData.pathologyCertificate);
    // dataToSend.append('nursuingDetail', formData.nursing || '');
    // dataToSend.append('anyOther', formData.otherCharges || '');
    // if (formData.enclosures)
    //   dataToSend.append('enclosureDoc', formData.enclosures || '');

    dataToSend.append('type', formType);
    dataToSend.append('refNo', preItem.refNo);

    if (formData.prolongedTreatment)
      dataToSend.append(
        'prolongedTreatment',
        formData.prolongedTreatment || '',
      );

    // // Add medicines (drug entries)
    // drugEntries.forEach((entry, index) => {
    //   dataToSend.append(`medi[${index}].shopName`, entry.shopName || '');
    //   dataToSend.append(`medi[${index}].cashMemoNo`, entry.cashMemoNo || '');
    //   dataToSend.append(
    //     `medi[${index}].cashMemoDate`,
    //     entry.cashMemoDate || '',
    //   );
    //   dataToSend.append(`medi[${index}].drugName`, entry.drugName || '');
    //   dataToSend.append(`medi[${index}].quantity`, entry.quantity || '');
    //   dataToSend.append(`medi[${index}].totalValue`, entry.totalValue || '');
    //   if (entry.uploadMemo)
    //     dataToSend.append(`medi[${index}].memoDoc`, entry.uploadMemo);
    // });

    try {
      const response = await updateMedicalForm(dataToSend);
      console.log('Update response', response);
      if (response.data.code === '200') {
        medicineSubmission(response.data.list[0].refNo);
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

  const medicineSubmission = async (refNo) => {
    const mediPayload = {
      refNo: refNo,
      shopName: drugEntries[0]?.shopName || '',
      cashMemoNo: drugEntries[0]?.cashMemoNo || '',
      cashMemoDate: drugEntries[0]?.cashMemoDate || '',
      memoList: [],
      updatedBy: sessionStorage.getItem('empCode'),
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
        alert('Successfully Updated!!');
        navigate('/medicalReimbursementView');
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error', error);
      alert('Something went wrong');
    }
  };

  const deleteDrugEntries = async (id) => {
    const payload = {
      id: id,
      empCode: sessionStorage.getItem('empCode'),
      updatedBy: sessionStorage.getItem('empCode'),
    };
    const response = await deteleDrugDetails(payload);
    if (response.data.code === '200') {
      alert('Record Delete Successfully !!');
      window.location.reload();
    } else {
      alert(response.data.message);
    }
  };

  const deleteDrugFromEntry = (entryIdx, drugIdx) => {
    const updated = [...drugEntries];
    if (updated[entryIdx].drugs.length === 1) return;
    updated[entryIdx].drugs = updated[entryIdx].drugs.filter(
      (_, i) => i !== drugIdx,
    );
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

  const handleNestedDrugChange = (entryIdx, drugIdx, e) => {
    const { name, value, files } = e.target;
    const updated = [...drugEntries];
    const drugList = updated[entryIdx].drugs.map((d, i) =>
      i === drugIdx ? { ...d, [name]: files ? files[0] : value } : d,
    );
    updated[entryIdx].drugs = drugList;
    setDrugEntries(updated);
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const handleToggle = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      <Card className="shadow-lg rounded mt-4">
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/medicalReimbursementView">
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
            Update Medical Reimbursement
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
              </Card.Body>
            </Card>

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="g-3">
                  <Col md={3}>
                    <Card className="h-100">
                      <Card.Header>
                        Residential Address of Govt. Employee
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          name="empResAddress"
                          placeholder="Enter Address..."
                          value={formData.empResAddress}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={9}>
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
                                <Form.Control
                                  type="text"
                                  placeholder="Enter..."
                                  name="birthOrder"
                                  value={formData.birthOrder}
                                  onChange={handleChange}
                                />
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

            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row xs={1} md={4} className="g-3">
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
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>
                        Patient relationship with the Govt. Employee
                      </Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="text"
                          placeholder="Enter..."
                          name="patientRelation"
                          value={formData.patientRelation}
                          onChange={handleChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col>
                    <Card>
                      <Card.Header>Prescription with OPD No.</Card.Header>
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
                      <Card.Header>Prescription with OPD Date</Card.Header>
                      <Card.Body>
                        <Form.Control
                          type="date"
                          name="opdDate"
                          value={formData.opdDate}
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
                      <Card.Header>Grad Pay</Card.Header>
                      <Card.Body>
                        <Form.Select
                          value={selectedGradePay}
                          onChange={(e) => setSelectedGradePay(e.target.value)}
                        >
                          <option value="" disabled>
                            -- Select Grade Pay --
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
                        {' '}
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
                </Row>
              </Card.Body>
            </Card>
          </div>

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
                Delete Previous Drug Enteries
              </Typography>
            </Card.Header>
            <Card.Body>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Shop Name</StyledTableCell>
                      <StyledTableCell>Cash Memo</StyledTableCell>
                      <StyledTableCell>Cash Memo Date</StyledTableCell>
                      {/* <StyledTableCell>Drug Name</StyledTableCell> */}
                      {/* <StyledTableCell>Quantity</StyledTableCell> */}
                      {/* <StyledTableCell>Total Value</StyledTableCell> */}
                      <StyledTableCell>View All</StyledTableCell>
                      <StyledTableCell>Delete</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {/* <TableBody>
                    {drugEntry && drugEntry.length > 0 ? (
                      drugEntry.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.shopName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.cashMemoNo || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.cashMemoDate || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.drugName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.quantity || '-'}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.totalValue || '-'}
                          </StyledTableCell>

                          <StyledTableCell>
                            <Tooltip title="Delete Item" arrow placement="top">
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() => deleteDrugEntries(item.id)}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </Button>
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={8}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody> */}

                  <TableBody>
                    {drugEntry && drugEntry.length > 0 ? (
                      drugEntry.map((item, index) => (
                        <React.Fragment key={item.id}>
                          {/* Main Row */}
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>
                              {item.shopName || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.cashMemoNo || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.cashMemoDate || '-'}
                            </StyledTableCell>
                            {/* <StyledTableCell>
                              {item.totalValue || '-'}
                            </StyledTableCell> */}

                            <StyledTableCell>
                              {/* <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleToggle(item.id)}
                              >
                                {expandedRow === item.id ? '−' : '+'}
                              </Button> */}
                              <Button
                                onClick={() => handleToggle(item.id)}
                                variant="contained"
                                size="small"
                                color="dark"
                              >
                                {expandedRow === item.id ? (
                                  <VisibilityOffIcon color="success" />
                                ) : (
                                  <VisibilityIcon color="primary" />
                                )}
                              </Button>
                            </StyledTableCell>

                            <StyledTableCell>
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() => deleteDrugEntries(item.id)}
                                // className={canUpdate ? '' : 'button-disabled'}
                                disabled={!canUpdate}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>

                          {/* Sub Table Row */}
                          {expandedRow === item.id && (
                            <StyledTableRow>
                              <StyledTableCell colSpan={6}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>S.No.</TableCell>
                                      <TableCell>Drug Name</TableCell>
                                      <TableCell>Quantity</TableCell>
                                      <TableCell>Total Value</TableCell>
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {item.memoList &&
                                    item.memoList.length > 0 ? (
                                      item.memoList.map((memo, memoIndex) => (
                                        <TableRow key={memo.id}>
                                          <TableCell>{memoIndex + 1}</TableCell>
                                          <TableCell>{memo.drugName}</TableCell>
                                          <TableCell>{memo.quantity}</TableCell>
                                          <TableCell>
                                            {memo.totalValue}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={4}>
                                          No Memo Records Found
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </StyledTableCell>
                            </StyledTableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={7}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>

          {/* <Card className="mt-3">
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
                Drug Entry
              </Typography>
            </Card.Header>
            <Card.Body>
              {drugEntries.map((entry, index) => (
                <Card key={index} className="mb-3 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center p-3">
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        color: '#0a1f83',
                      }}
                    >
                      Drug Entry #{index + 1}
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
                    <Row className="g-3">
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
                            type="number"
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
                    </Row>

                    <Row className="g-3 mt-2">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Name of the Drug</Form.Label>
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

                    <Row className="g-3 mt-2">
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
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card> */}

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
                Medicine Details
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
                          <strong>Medicine #{dIdx + 1}</strong>
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
                              <Form.Label>Medicine Name</Form.Label>
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
              onClick={handleUpdate}
              disabled={!canUpdate}
              variant="outlined"
              className={canUpdate ? 'green-button' : 'button-disabled'}
            >
              Update
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

export default MedicalFormUpdate;
