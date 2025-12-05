import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'react-bootstrap';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Backdrop,
  tableCellClasses,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  TextField,
  Checkbox,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PropagateLoader } from 'react-spinners';
import {
  getMedicalByHr,
  getMedicalByRefNo,
  getMedicineDetailByRefNo,
  submitMedicalHrStatus,
} from '../../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
  SubTableRow,
  SubTableCell,
} from '../../../../Constants/TableStyles/Index';

// const fieldCard = (label, value, index) => (
//   <Grid item xs={12} sm={6} md={3} key={index}>
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ delay: index * 0.05 }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           p: 2,
//           borderRadius: 3,
//           textAlign: 'center',
//           transition: 'all 0.3s ease',
//           background: 'linear-gradient(135deg,#f8fbff,#ffffff)',
//           '&:hover': {
//             transform: 'translateY(-5px)',
//             boxShadow: '0px 10px 25px rgba(0,0,0,0.2)',
//           },
//         }}
//       >
//         <Typography
//           variant="body2"
//           sx={{ fontWeight: 'bold', color: '#3949ab', mb: 1 }}
//         >
//           {label}
//         </Typography>
//         <Typography variant="body1" sx={{ color: '#333' }}>
//           {value || '—'}
//         </Typography>
//       </Paper>
//     </motion.div>
//   </Grid>
// );

const fieldCard = (label, value, index, onClick) => (
  <Grid item xs={12} sm={6} md={3} key={index}>
    <motion.div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 3,
          textAlign: 'center',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg,#f8fbff,#ffffff)',
          '&:hover': {
            transform: onClick ? 'translateY(-5px)' : 'none',
            boxShadow: onClick ? '0px 10px 25px rgba(0,0,0,0.2)' : 'none',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', color: '#3949ab', mb: 1 }}
        >
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          {value || '—'}
        </Typography>
      </Paper>
    </motion.div>
  </Grid>
);

function MedicalApprovalByHr() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getMedicalByHr();
        // console.log(response);
        if (response.data.code === '200') {
          setOpenBackdrop(false);
          setRecords(response.data.list);
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.log('Error', error);
        setOpenBackdrop(false);
      }
    };
    fetchRecords();
  }, []);

  const [selectedRow, setSelectedRow] = useState([]);
  const [open, setOpen] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [medicineData, setMedicineData] = useState([]);

  // const handlePreview = (row) => {
  //   setSelectedRow(row);
  //   setOpen(true);
  //   fetchMedicineDetails(row.refNo);
  //   setReferenceNo(row.refNo);
  // };

  const handlePreview = async (refNo) => {
    try {
      setReferenceNo(refNo);

      // Fetch medicine details (no await? If async, add await)
      // fetchMedicineDetails(refNo);

      const response = await getMedicalByRefNo(refNo);
      // console.log('API Response:', response);

      if (
        response?.data?.code === '200' &&
        response?.data?.message === 'Success'
      ) {
        setSelectedRow(response.data.list[0]);
        setMedicineData(response.data.list[0].medicineDetails);
        setOpen(true);
      } else {
        alert(response?.data?.message || 'Something went wrong');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error in handlePreview:', error);
      alert('Something went wrong while fetching details.');
      setOpen(false);
    }
  };

  // useEffect(() => {
  //   if (selectedRow) {
  //     console.log('Updated Selected Row:', selectedRow);
  //     console.log('medicineData:', medicineData);

  //     if (selectedRow.aoStatus === 'Approved') {
  //     }
  //   }
  // }, [selectedRow]);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow([]);
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const handlePreviewMemo = (item, index) => {
    if (!item.memoList || item.memoList.length === 0) {
      alert('Memo list data not found');
      return;
    }

    // Toggle expand / collapse
    setExpandedRow(expandedRow === index ? null : index);
  };

  // const [medicineData, setMedicineData] = useState([]);
  // const fetchMedicineDetails = async (refNo) => {
  //   const response = await getMedicineDetailByRefNo(refNo);
  //   // console.log(response);
  //   setMedicineData(response.data.list[0]);
  // };

  // function downloadDocument(path) {
  //   console.log(path);
  //   console.log(records);

  //   if (!path) {
  //     alert('Data not Found.');
  //     return;
  //   }
  //   const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${path}`;
  //   window.open(url, '_blank');
  // }

  const [hrStatus, setHrStatus] = useState('');
  const [hrRemark, setHrRemark] = useState('');
  const [errors, setErrors] = useState({});

  const statusRef = useRef(null);
  const remarkRef = useRef(null);

  //  Validation function
  const validate = () => {
    const newErrors = {};
    if (!hrStatus) newErrors.hrStatus = 'Status is required';
    if (!hrRemark.trim()) newErrors.hrRemark = 'Remark is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.hrStatus && statusRef.current) statusRef.current.focus();
      else if (newErrors.hrRemark && remarkRef.current)
        remarkRef.current.focus();
      return false;
    }
    return true;
  };

  //  Submit function
  // const HrStatusUpdate = async () => {
  //   if (!validate()) return;
  //   setOpenBackdrop(true);
  //   const payload = {
  //     refNo: referenceNo,
  //     status: hrStatus,
  //     remark: hrRemark,
  //     next: null,
  //   };

  //   try {
  //     // replace with your API call
  //     const response = await submitMedicalHrStatus(payload);
  //     console.log('Success:', response);
  //     if (response.data.code == '200') {
  //       alert('Status Updated Successfully !!');
  //       setOpenBackdrop(false);
  //       //window.location.reload();
  //     } else {
  //       alert(response.data.message);
  //       setOpenBackdrop(false);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting:', error);
  //     alert('Submission failed!');
  //     setOpenBackdrop(false);
  //   }
  // };

  const [rows, setRows] = useState([
    {
      sno: 1,
      accountCode: '',
      accountHead: '',
      estimateNo: '',
      dc: '',
      amount: '',
      billRef: '',
      billRefDate: '',
      details: '',
    },
  ]);

  // ADD NEW ROW
  const addRow = () => {
    setRows([
      ...rows,
      {
        sno: rows.length + 1,
        accountCode: '',
        accountHead: '',
        estimateNo: '',
        dc: '',
        amount: '',
        billRef: '',
        billRefDate: '',
        details: '',
      },
    ]);
  };

  // DELETE ROW
  const deleteRow = (index) => {
    const updated = rows
      .filter((_, i) => i !== index)
      .map((item, idx) => ({
        ...item,
        sno: idx + 1,
      }));
    setRows(updated);
  };

  // HANDLE INPUT CHANGE
  const pettyChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // GET FILLED ROWS ONLY
  // const getFilledRows = () => {
  //   const filledRows = rows.filter((row) => {
  //     // Check if at least one field is filled
  //     return (
  //       row.accountCode ||
  //       row.accountHead ||
  //       row.estimateNo ||
  //       row.dc ||
  //       row.amount ||
  //       row.billRef ||
  //       row.billRefDate ||
  //       row.details
  //     );
  //   });

  //   console.log('FILLED ROWS:', filledRows);
  //   alert(JSON.stringify(filledRows, null, 2));
  // };

  const [journalRows, setJournalRows] = useState([
    {
      sno: 1,
      journalAccountCode: '',
      journalAccountHead: '',
      journalEstimateNo: '',
      journalDC: '',
      journalDebitAmount: '',
      journalCreditAmount: '',
      journalDetails: '',
    },
  ]);

  // ADD NEW JOURNAL ROW
  const journalAddRow = () => {
    setJournalRows([
      ...journalRows,
      {
        sno: journalRows.length + 1,
        journalAccountCode: '',
        journalAccountHead: '',
        journalEstimateNo: '',
        journalDC: '',
        journalDebitAmount: '',
        journalCreditAmount: '',
        journalDetails: '',
      },
    ]);
  };

  // DELETE JOURNAL ROW
  const journalDeleteRow = (index) => {
    const updated = journalRows
      .filter((_, i) => i !== index)
      .map((item, idx) => ({
        ...item,
        sno: idx + 1,
      }));
    setJournalRows(updated);
  };

  // HANDLE INPUT CHANGE
  const journalChange = (index, field, value) => {
    const updated = [...journalRows];
    updated[index][field] = value;
    setJournalRows(updated);
  };

  // GET FILLED JOURNAL ROWS
  // const journalGetFilledRows = () => {
  //   const filled = journalRows.filter((row) => {
  //     return (
  //       row.journalAccountCode ||
  //       row.journalAccountHead ||
  //       row.journalEstimateNo ||
  //       row.journalDC ||
  //       row.journalDebitAmount ||
  //       row.journalCreditAmount ||
  //       row.journalDetails
  //     );
  //   });

  //   console.log('JOURNAL SELECTED ROWS:', filled);
  //   alert(JSON.stringify(filled, null, 2));
  // };

  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [date, setDate] = useState('');

  // const handleSubmit = () => {
  //   const data = {
  //     bankCode,
  //     bankName,
  //     chequeNo,
  //     date,
  //   };

  //   console.log('Bank Form Data:', data);
  //   alert(JSON.stringify(data, null, 2));
  // };

  //  const HrStatusUpdate = async () => {
  //   if (!validate()) return;
  //   setOpenBackdrop(true);
  //   const payload = {
  //     refNo: referenceNo,
  //     status: hrStatus,
  //     remark: hrRemark,
  //     next: null,
  //   };

  //   try {
  //     // replace with your API call
  //     const response = await submitMedicalHrStatus(payload);
  //     console.log('Success:', response);
  //     if (response.data.code == '200') {
  //       alert('Status Updated Successfully !!');
  //       setOpenBackdrop(false);
  //       //window.location.reload();
  //     } else {
  //       alert(response.data.message);
  //       setOpenBackdrop(false);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting:', error);
  //     alert('Submission failed!');
  //     setOpenBackdrop(false);
  //   }
  // };

  const HrStatusUpdate = async () => {
    if (!validate()) return;
    setOpenBackdrop(true);

    // 🔹 Get Petty Cash Rows (Converted to Backend Format)
    const pettyCashConverted = rows
      .filter((row) => row.accountCode || row.amount)
      .map((row, index) => ({
        srNo: index + 1,
        accountCode: row.accountCode || '',
        accountHead: row.accountHead || '',
        estimateNo: row.estimateNo || '',
        dOrC: row.dc || '',
        amountRs: Number(row.amount) || 0,
        amountP: 0, // If you need paise field, modify accordingly
        billReferenceNo: row.billRef || '',
        billDate: row.billRefDate || '',
        details: row.details || '',
        refNo: referenceNo,
      }));

    //  Get Journal Rows (Converted to Backend Format)
    const journalConverted = journalRows
      .filter(
        (row) =>
          row.journalAccountCode ||
          row.journalDebitAmount ||
          row.journalCreditAmount,
      )
      .map((row, index) => ({
        srNo: index + 1,
        accountCode: row.journalAccountCode || '',
        accountHead: row.journalAccountHead || '',
        estimateNo: row.journalEstimateNo || '',
        dOrC: row.journalDC || '',
        debitAmountRs: Number(row.journalDebitAmount) || 0,
        debitAmountP: 0,
        creditAmountRs: Number(row.journalCreditAmount) || 0,
        creditAmountP: 0,
        details: row.journalDetails || '',
        refNo: referenceNo,
      }));

    //  Bank Form Data
    const bankData = {
      bankCode: bankCode,
      bankName: bankName,
      chequeNo: chequeNo,
      chequeDate: date || null,
    };

    // FINAL PAYLOAD EXACT MATCH AS YOUR GIVEN JSON
    const payload = {
      refNo: referenceNo,
      remark: hrRemark,
      status: hrStatus,
      // next: null,
      ...bankData,
      medicalPcvList: pettyCashConverted,
      medicalJvs: journalConverted,
    };

    console.log('FINAL READY PAYLOAD:', payload);

    try {
      const response = await submitMedicalHrStatus(payload);
      console.log(response);

      if (response.data.code === '200') {
        alert('Status Updated Successfully !!');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Submission failed!');
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleEssentialityDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  const handleProlongedDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  const handleMemoDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Card className="shadow">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{
              color: '#0a1f83',
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            HR Verification for Medical Reimbirsement
          </Typography>
        </Card.Header>
        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Patient Name</StyledTableCell>
                  <StyledTableCell>Patient Code</StyledTableCell>

                  <StyledTableCell>Reference No.</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {records && records.length > 0 ? (
                  records.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>
                        {item.patientName || '-'}
                      </StyledTableCell>
                      <StyledTableCell>{item.empCode || '-'}</StyledTableCell>
                      <StyledTableCell>{item.refNo || '-'}</StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title="Preview" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            //sx={{ backgroundColor: "#37474F", color: "#fff" }}
                            // onClick={() => handlePreview(item)}
                            onClick={() => handlePreview(item.refNo)}
                          >
                            <VisibilityIcon fontSize="small" />
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
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            variant="outlined"
            className="cancel-button"
            component={Link}
            to="/"
          >
            Back
          </Button>
        </Card.Footer>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%)',
            boxShadow: '0px 15px 45px rgba(0,0,0,0.25)',
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            textAlign: 'center',
            bgcolor: '#e2e3e5',
            py: 2,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#0a1f83' }}
          >
            Medical Verification By HR
          </Typography>
        </DialogTitle>

        {/* Body */}
        <DialogContent
          dividers
          sx={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            maxHeight: '80vh',
          }}
        >
          {selectedRow && (
            <Grid container spacing={3}>
              {fieldCard('Employee Code', selectedRow.empCode, 0)}
              {fieldCard('Reference No', selectedRow.refNo, 1)}
              {fieldCard('Patient Name', selectedRow.patientName, 2)}
              {fieldCard('Patient Relation', selectedRow.patientRelation, 3)}
              {fieldCard('OPD No', selectedRow.opdNo, 4)}
              {fieldCard('OPD Date', selectedRow.opdDate, 5)}
              {fieldCard('Doctor Name', selectedRow.doctorName, 6)}
              {fieldCard(
                'Doctor Designation',
                selectedRow.doctorDesignation,
                7,
              )}
              {fieldCard('Nature of Illness', selectedRow.natureOfIllness, 8)}
              {fieldCard('Illness Duration', selectedRow.illnessDuration, 9)}
              {fieldCard(
                'Essentiality Certificate No',
                selectedRow.essentialityCertificateNo,
                10,
              )}
              {fieldCard(
                'Certificate Date',
                selectedRow.essentialityCertificateDate,
                11,
              )}
              {fieldCard(
                'No Of Living Children',
                selectedRow.noOfLivingChildren,
                12,
              )}
              {fieldCard('No In Birth Order', selectedRow.noInBirthOrder, 13)}
              {fieldCard('Application Date', selectedRow.applicationDate, 14)}
              {fieldCard('Created Date', selectedRow.created, 15)}
              {fieldCard('Present Address', selectedRow.presentAddress, 16)}
              {fieldCard('Total Amount', selectedRow.totalAmount, 17)}
              {fieldCard('HR Status', selectedRow.hrStatus, 18)}
              {fieldCard('HR Remark', selectedRow.hrRemark, 19)}
              {fieldCard('CMO Status', selectedRow.cmoStatus, 20)}
              {fieldCard('CMO Remark', selectedRow.cmoRemark, 21)}
              {fieldCard('AO Status', selectedRow.aoStatus, 22)}
              {fieldCard('AO Remark', selectedRow.aoRemark, 23)}

              {fieldCard('Bank Name', selectedRow.bankName, 24)}
              {fieldCard('Bank Code', selectedRow.bankCode, 25)}
              {fieldCard('Cheque No', selectedRow.chequeNo, 26)}
              {fieldCard(
                'Amount Approved by CMO',
                selectedRow.totalAmountApprovedByDoc,
                27,
              )}
              {fieldCard(
                'Essentiality Certificate',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                28,
                () =>
                  handleEssentialityDownload(
                    selectedRow.essentialityCertificateDoc,
                  ),
              )}

              {fieldCard(
                'Prolonged Certificate',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                29,
                () => handleProlongedDownload(selectedRow.prolongedTreatment),
              )}

              {fieldCard(
                'Memo Doc',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                30,
                () => handleMemoDownload(selectedRow.memoPath),
              )}
            </Grid>
          )}

          <Card className="shadow mt-3">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  color: '#0a1f83',
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Drug Details
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>ShopName</StyledTableCell>
                      <StyledTableCell>Cash Memo No</StyledTableCell>
                      <StyledTableCell>Cash Memo Date</StyledTableCell>
                      <StyledTableCell>View</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {medicineData && medicineData.length > 0 ? (
                      medicineData.map((item, index) => (
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
                            <Tooltip title="Preview" arrow>
                              <Button variant="contained" color="dark">
                                <VisibilityIcon
                                  fontSize="small"
                                  color="success"
                                />
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
                  </TableBody>
                </Table>
              </TableContainer> */}

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Shop Name</StyledTableCell>
                      <StyledTableCell>Cash Memo No</StyledTableCell>
                      <StyledTableCell>Cash Memo Date</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {medicineData && medicineData.length > 0 ? (
                      medicineData.map((item, index) => (
                        <React.Fragment key={index}>
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

                            <StyledTableCell>
                              <Tooltip
                                title={
                                  expandedRow === index
                                    ? 'Hide Memo Details'
                                    : 'Show Memo Details'
                                }
                                arrow
                                placement="top"
                              >
                                <Button
                                  variant="contained"
                                  color="dark"
                                  onClick={() => handlePreviewMemo(item, index)}
                                  sx={{ minWidth: 40 }}
                                >
                                  {/* Toggle icon same, but color changes */}
                                  <VisibilityIcon
                                    fontSize="small"
                                    color={
                                      expandedRow === index
                                        ? 'error'
                                        : 'success'
                                    }
                                  />
                                </Button>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>

                          {/* Sub Table - Expandable */}
                          {expandedRow === index && (
                            <StyledTableRow>
                              <StyledTableCell colSpan={5} sx={{ padding: 1 }}>
                                <Table size="small">
                                  <TableHead>
                                    <SubTableRow>
                                      <SubTableCell>S.No.</SubTableCell>
                                      <SubTableCell>Cash Memo No</SubTableCell>
                                      <SubTableCell>Drug Name</SubTableCell>
                                      <SubTableCell>Quantity</SubTableCell>
                                      <SubTableCell>Total Value</SubTableCell>
                                    </SubTableRow>
                                  </TableHead>

                                  <TableBody>
                                    {item.memoList.map((memo, i) => (
                                      <SubTableRow key={i}>
                                        <SubTableCell>{i + 1}</SubTableCell>
                                        <SubTableCell>
                                          {memo.cashMemoNo || '-'}
                                        </SubTableCell>
                                        <SubTableCell>
                                          {memo.drugName || '-'}
                                        </SubTableCell>
                                        <SubTableCell>
                                          {memo.quantity || '-'}
                                        </SubTableCell>
                                        <SubTableCell>
                                          {memo.totalValue || '-'}
                                        </SubTableCell>
                                      </SubTableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </StyledTableCell>
                            </StyledTableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={8}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
            <Card.Footer className="text-center"></Card.Footer>
          </Card>

          {selectedRow?.cmoStatus === 'Approved' && (
            <>
              <Card className="shadow mt-3">
                <Card.Header className="text-center">
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#0a1f83',
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Petty Cash Voucher
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <Tooltip title="Add More Rows" arrow placement="top">
                    <Button variant="contained" color="dark" onClick={addRow}>
                      <AddBoxIcon fontSize="small" color="success" />
                    </Button>
                  </Tooltip>
                  <TableContainer component={Paper} className="mt-2">
                    <Table>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>S.No.</StyledTableCell>
                          <StyledTableCell>Account Code</StyledTableCell>
                          <StyledTableCell>Account Head</StyledTableCell>
                          <StyledTableCell>Estimate No.</StyledTableCell>
                          <StyledTableCell>D or C</StyledTableCell>
                          <StyledTableCell>Amount</StyledTableCell>
                          <StyledTableCell>Bill Reference</StyledTableCell>
                          <StyledTableCell>Bill Reference Date</StyledTableCell>
                          <StyledTableCell>Details</StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>

                      <TableBody>
                        {rows.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.sno}</StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.accountCode}
                                onChange={(e) =>
                                  pettyChange(
                                    index,
                                    'accountCode',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.accountHead}
                                onChange={(e) =>
                                  pettyChange(
                                    index,
                                    'accountHead',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.estimateNo}
                                onChange={(e) =>
                                  pettyChange(
                                    index,
                                    'estimateNo',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <Select
                                size="small"
                                value={row.dc}
                                displayEmpty
                                onChange={(e) =>
                                  pettyChange(index, 'dc', e.target.value)
                                }
                                style={{ width: '80px' }}
                              >
                                <MenuItem value="" disabled>
                                  select
                                </MenuItem>
                                <MenuItem value="D">D</MenuItem>
                                <MenuItem value="C">C</MenuItem>
                              </Select>
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.amount}
                                onChange={(e) =>
                                  pettyChange(index, 'amount', e.target.value)
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.billRef}
                                onChange={(e) =>
                                  pettyChange(index, 'billRef', e.target.value)
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                type="date"
                                size="small"
                                value={row.billRefDate}
                                onChange={(e) =>
                                  pettyChange(
                                    index,
                                    'billRefDate',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.details}
                                onChange={(e) =>
                                  pettyChange(index, 'details', e.target.value)
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <IconButton
                                color="error"
                                onClick={() => deleteRow(index)}
                                disabled={rows.length === 1}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div className=" my-3">
                    <Row className="mt-3 g-3">
                      <Col xs={12} md={3}>
                        <Card className="h-100">
                          <Card.Header>Bank Code</Card.Header>
                          <Card.Body>
                            <Form.Control
                              type="text"
                              placeholder="Enter Bank Code"
                              value={bankCode}
                              onChange={(e) => setBankCode(e.target.value)}
                            />
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col xs={12} md={3}>
                        <Card className="h-100">
                          <Card.Header>Bank Name</Card.Header>
                          <Card.Body>
                            <Form.Control
                              type="text"
                              placeholder="Enter Bank Name"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                            />
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col xs={12} md={3}>
                        <Card className="h-100">
                          <Card.Header>Cheque No.</Card.Header>
                          <Card.Body>
                            <Form.Control
                              type="text"
                              placeholder="Enter Cheque No."
                              value={chequeNo}
                              onChange={(e) => setChequeNo(e.target.value)}
                            />
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col xs={12} md={3}>
                        <Card className="h-100">
                          <Card.Header>Date</Card.Header>
                          <Card.Body>
                            <Form.Control
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
                <Card.Footer className="text-center"></Card.Footer>
              </Card>

              <Card className="shadow mt-3">
                <Card.Header className="text-center">
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#0a1f83',
                      mb: 2,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  >
                    Journal Voucher
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <Tooltip title="Add More Rows" arrow placement="top">
                    <Button
                      variant="contained"
                      color="dark"
                      onClick={journalAddRow}
                    >
                      <AddBoxIcon fontSize="small" color="success" />
                    </Button>
                  </Tooltip>

                  <TableContainer component={Paper} className="mt-2">
                    <Table>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>S.No.</StyledTableCell>
                          <StyledTableCell>Account Code</StyledTableCell>
                          <StyledTableCell>Account Head</StyledTableCell>
                          <StyledTableCell>Estimate No.</StyledTableCell>
                          <StyledTableCell>D / C</StyledTableCell>
                          <StyledTableCell>Debit Amount</StyledTableCell>
                          <StyledTableCell>Credit Amount</StyledTableCell>
                          <StyledTableCell>Details</StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>

                      <TableBody>
                        {journalRows.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.sno}</StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                placeholder="Enter..."
                                size="small"
                                value={row.journalAccountCode}
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalAccountCode',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.journalAccountHead}
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalAccountHead',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                placeholder="Enter..."
                                size="small"
                                value={row.journalEstimateNo}
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalEstimateNo',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <Select
                                size="small"
                                value={row.journalDC}
                                displayEmpty
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalDC',
                                    e.target.value,
                                  )
                                }
                                style={{ width: '100px' }}
                              >
                                <MenuItem value="" disabled>
                                  select
                                </MenuItem>
                                <MenuItem value="D">D</MenuItem>
                                <MenuItem value="C">C</MenuItem>
                              </Select>
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                type="number"
                                placeholder="Enter..."
                                value={row.journalDebitAmount}
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalDebitAmount',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                type="number"
                                value={row.journalCreditAmount}
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalCreditAmount',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <TextField
                                size="small"
                                placeholder="Enter..."
                                value={row.journalDetails}
                                onChange={(e) =>
                                  journalChange(
                                    index,
                                    'journalDetails',
                                    e.target.value,
                                  )
                                }
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              <IconButton
                                color="error"
                                onClick={() => journalDeleteRow(index)}
                                disabled={journalRows.length === 1}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card.Body>
                <Card.Footer className="text-center"></Card.Footer>
              </Card>
            </>
          )}

          <Card className="shadow mt-3">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  color: '#0a1f83',
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Update Hr Status
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Status Select */}
                <Col xs={12} md={4} className="mb-2">
                  <Card>
                    <Card.Header>Select Status</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={statusRef}
                        value={hrStatus}
                        onChange={(e) => setHrStatus(e.target.value)}
                        isInvalid={!!errors.hrStatus}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.hrStatus}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Remark Textarea */}
                <Col xs={12} md={8}>
                  <Card>
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Remark..."
                        ref={remarkRef}
                        value={hrRemark}
                        onChange={(e) => setHrRemark(e.target.value)}
                        isInvalid={!!errors.hrRemark}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.hrRemark}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center"></Card.Footer>
          </Card>
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              onClick={handleClose}
              variant="contained"
              className="cancel-button"
            >
              Close
            </Button>
            &nbsp;
            <Button
              onClick={HrStatusUpdate}
              variant="contained"
              className="green-button"
            >
              Submit
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

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

export default MedicalApprovalByHr;
