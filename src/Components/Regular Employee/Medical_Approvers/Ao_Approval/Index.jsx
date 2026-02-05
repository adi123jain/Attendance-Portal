import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'react-bootstrap';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Button,
  Backdrop,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import {
  getMedicalByAo,
  getMedicalByRefNo,
  submitMedicalAoStatus,
} from '../../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
  SubTableRow,
  SubTableCell,
} from '../../../../Constants/TableStyles/Index';

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

function MedicalApprovalByAo() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getMedicalByAo();
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

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [medicineData, setMedicineData] = useState([]);
  const [pcvData, setPcvData] = useState([]);
  const [jvData, setJvData] = useState([]);

  const handlePreview = async (refNo) => {
    try {
      setReferenceNo(refNo);

      const response = await getMedicalByRefNo(refNo);
      // console.log('API Response:', response);

      if (
        response?.data?.code === '200' &&
        response?.data?.message === 'Success'
      ) {
        setSelectedRow(response.data.list[0]);
        setMedicineData(response.data.list[0].medicineDetails);
        setPcvData(response.data.list[0].pcvList);
        setJvData(response.data.list[0].jvList);
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

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    window.location.reload();
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const handlePreviewMemo = (item, index) => {
    if (!item.memoList || item.memoList.length === 0) {
      alert('Memo list data not found');
      return;
    }

    setExpandedRow(expandedRow === index ? null : index);
  };

  const [aoStatus, setAoStatus] = useState('');
  const [aoRemark, setAoRemark] = useState('');
  // const [forwardTo, setForwardTo] = useState("");
  const [errors, setErrors] = useState({});

  const statusRef = useRef(null);
  const remarkRef = useRef(null);
  // const forwardToRef = useRef(null);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!aoStatus) newErrors.aoStatus = 'Status is required';
    if (!aoRemark.trim()) newErrors.aoRemark = 'Remark is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.aoStatus && statusRef.current) statusRef.current.focus();
      else if (newErrors.aoRemark && remarkRef.current)
        remarkRef.current.focus();
      return false;
    }
    return true;
  };

  //  Submit function
  const AoStatusUpdate = async () => {
    if (!validate()) return;
    setOpenBackdrop(true);
    const payload = {
      refNo: referenceNo,
      status: aoStatus,
      remark: aoRemark,
      // next: aoStatus === "Approved" ? "" : forwardTo,
    };

    try {
      // replace with your API call
      const response = await submitMedicalAoStatus(payload);
      // console.log('Success:', response);
      if (response.data.code === '200') {
        alert('Status Updated Successfully !!');
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Submission failed!');
      setOpenBackdrop(false);
    }
  };

  const handleEssentialityDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    // console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  const handleProlongedDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    // console.log('Downloading:', docPath);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/medical/downloadMRDoc/${docPath}`;
    window.open(url, '_blank');
  };

  const handleMemoDownload = (docPath) => {
    if (!docPath) {
      alert('Document not available');
      return;
    }

    // console.log('Downloading:', docPath);

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
            AO Verification for Medical Reimbursement
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
            Medical Verification By AO
          </Typography>
        </DialogTitle>

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
              {fieldCard('Bank IFSC', selectedRow.bankIfsc, 25)}
              {fieldCard('Account No', selectedRow.bankAccount, 26)}

              {fieldCard(
                'Amount Approved by CMO',
                selectedRow.totalAmountApprovedByDoc,
                27,
              )}

              {fieldCard('ERP Invoice Number', selectedRow.erpInvoiceNo, 28)}

              {fieldCard(
                'Essentiality Certificate',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                29,
                () =>
                  handleEssentialityDownload(
                    selectedRow.essentialityCertificateDoc,
                  ),
              )}

              {fieldCard(
                'Prolonged Certificate',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                30,
                () => handleProlongedDownload(selectedRow.prolongedTreatment),
              )}

              {fieldCard(
                'Memo Doc',
                <CloudDownloadIcon sx={{ color: '#3949ab', fontSize: 32 }} />,
                31,
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
                Petty Cash Voucher List
              </Typography>
            </Card.Header>
            <Card.Body>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Account Code</StyledTableCell>
                      <StyledTableCell>Account Head</StyledTableCell>
                      <StyledTableCell>D or C</StyledTableCell>
                      <StyledTableCell>Amount</StyledTableCell>
                      <StyledTableCell>Bill Reference</StyledTableCell>
                      <StyledTableCell>Bill Reference Date</StyledTableCell>
                      <StyledTableCell>Details</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {pcvData && pcvData.length > 0 ? (
                      pcvData.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.accountCode || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.accountHead || '-'}
                          </StyledTableCell>

                          <StyledTableCell>{item.dOrC || '-'}</StyledTableCell>
                          <StyledTableCell>
                            {item.amountRs || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.billReferenceNo || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.billDate || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.details || '-'}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={9}>
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
                Journal Voucher List
              </Typography>
            </Card.Header>
            <Card.Body>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Account Code</StyledTableCell>
                      <StyledTableCell>Account Head</StyledTableCell>
                      <StyledTableCell>D or C</StyledTableCell>
                      <StyledTableCell>Debit Amount</StyledTableCell>
                      <StyledTableCell>Credit Amount</StyledTableCell>
                      <StyledTableCell>Details</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {jvData && jvData.length > 0 ? (
                      jvData.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.accountCode || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.accountHead || '-'}
                          </StyledTableCell>

                          <StyledTableCell>{item.dOrC || '-'}</StyledTableCell>
                          <StyledTableCell>
                            {item.debitAmountRs || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.creditAmountRs || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.details || '-'}
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
                Update AO Status
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={6} className="mb-2">
                  <Card>
                    <Card.Header>Select Status</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={statusRef}
                        value={aoStatus}
                        onChange={(e) => {
                          setAoStatus(e.target.value);
                        }}
                        isInvalid={!!errors.aoStatus}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.aoStatus}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6}>
                  <Card>
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Remark..."
                        ref={remarkRef}
                        value={aoRemark}
                        onChange={(e) => setAoRemark(e.target.value)}
                        isInvalid={!!errors.aoRemark}
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.aoRemark}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center"></Card.Footer>
          </Card>
        </DialogContent>

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
              onClick={AoStatusUpdate}
              variant="contained"
              className="green-button"
            >
              Submit
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default MedicalApprovalByAo;
