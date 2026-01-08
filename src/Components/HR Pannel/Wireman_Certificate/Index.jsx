import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import {
  Backdrop,
  Button,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { PropagateLoader } from 'react-spinners';
import {
  createWiremanCertificate,
  getEmpNameByCode,
} from '../../../Services/Auth';

import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from '@mui/material';

function WiremanCertificateByHr() {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [examDate, setExamDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [document, setDocument] = useState('');
  const circleName = sessionStorage.getItem('circleName');

  // Date error messages
  const [dateErrors, setDateErrors] = useState({
    examDate: '',
    fromDate: '',
    toDate: '',
    document: '',
  });

  // Date input refs
  const examDateRef = useRef(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const docRef = useRef(null);

  const [entries, setEntries] = useState([
    { empCode: '', FULLNAME: '', result: '', remark: '' },
  ]);

  const [errors, setErrors] = useState([]);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = entries.map(() => ({
      empCode: React.createRef(),
      result: React.createRef(),
      remark: React.createRef(),
    }));
  }, [entries]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addRow = () => {
    setEntries([
      ...entries,
      { empCode: '', FULLNAME: '', result: '', remark: '' },
    ]);

    setErrors([...errors, {}]);
  };

  const deleteRow = (index) => {
    if (entries.length === 1) {
      alert('At least one entry is required');
      return;
    }
    setEntries(entries.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const fetchEmployeeName = async (index, empCode) => {
    if (!empCode) {
      handleChange(index, 'FULLNAME', '');
      return;
    }

    try {
      const response = await getEmpNameByCode(empCode);
      // console.log('EMP NAME API:', response);

      if (response?.data?.code === '200') {
        const name = response.data.list[0]?.FULLNAME || '';
        handleChange(index, 'FULLNAME', name);
      } else {
        handleChange(index, 'FULLNAME', 'Not Found');
      }
    } catch (error) {
      console.log('Error fetching emp name:', error);
      handleChange(index, 'FULLNAME', '');
    }
  };

  const validate = () => {
    let newDateErrors = { examDate: '', fromDate: '', toDate: '' };
    let firstInvalidField = null;

    if (!examDate) {
      newDateErrors.examDate = '*Required';
      firstInvalidField = examDateRef;
    }

    if (!fromDate) {
      newDateErrors.fromDate = '*Required';
      if (!firstInvalidField) firstInvalidField = fromDateRef;
    }

    if (!toDate) {
      newDateErrors.toDate = '*Required';
      if (!firstInvalidField) firstInvalidField = toDateRef;
    }

    if (!document) {
      newDateErrors.document = '*Required';
      if (!firstInvalidField) firstInvalidField = docRef;
    }

    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      newDateErrors.toDate = '*To Date cannot be earlier';
      if (!firstInvalidField) firstInvalidField = toDateRef;
    }

    setDateErrors(newDateErrors);

    if (firstInvalidField) {
      setTimeout(() => {
        firstInvalidField.current?.focus();
      }, 200);
      return false;
    }

    let newErrors = [];
    let firstInvalidRow = null;
    let firstInvalidTableField = null;

    entries.forEach((row, i) => {
      let err = {};

      if (!row.empCode) {
        err.empCode = '*Required';
        if (firstInvalidRow === null) {
          firstInvalidRow = i;
          firstInvalidTableField = 'empCode';
        }
      }

      if (!row.result) {
        err.result = '*Required';
        if (firstInvalidRow === null) {
          firstInvalidRow = i;
          firstInvalidTableField = 'result';
        }
      }

      if (!row.remark.trim()) {
        err.remark = '*Required';
        if (firstInvalidRow === null) {
          firstInvalidRow = i;
          firstInvalidTableField = 'remark';
        }
      }

      newErrors[i] = err;
    });

    setErrors(newErrors);

    if (firstInvalidRow !== null) {
      setTimeout(() => {
        inputRefs.current[firstInvalidRow][
          firstInvalidTableField
        ]?.current?.focus();
      }, 200);
      return false;
    }

    return true;
  };

  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   setOpenBackdrop(true);

  //   const payload = entries.map((item) => ({
  //     empCode: item.empCode,
  //     dateOfExamination: examDate,
  //     result: item.result,
  //     remark: item.remark,
  //     startDate: fromDate,
  //     endDate: toDate,
  //     circle: sessionStorage.getItem('circleId'),
  //     createdBy: sessionStorage.getItem('empCode'),
  //     doc: document,
  //   }));

  //   console.log('FINAL PAYLOAD:', payload);

  //   try {
  //     const response = await createWiremanCertificate(payload);

  //     if (response?.data?.code === '200') {
  //       alert('Submitted Successfully!');

  //       // Reset everything
  //       setExamDate('');
  //       setFromDate('');
  //       setToDate('');
  //       setDocument('');
  //       setDateErrors({ examDate: '', fromDate: '', toDate: '' });

  //       setEntries([{ empCode: '', FULLNAME: '', result: '', remark: '' }]);

  //       setErrors([]);
  //     } else {
  //       alert(response?.data?.message || 'Submission failed!');
  //     }
  //   } catch (error) {
  //     alert('Something went wrong!');
  //     console.error(error);
  //   } finally {
  //     setOpenBackdrop(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!validate()) return;

    setOpenBackdrop(true);

    try {
      const wiremanList = entries.map((item) => ({
        empCode: Number(item.empCode),
        dateOfExamination: examDate, // yyyy-mm-dd
        circle: Number(sessionStorage.getItem('circleId')),
        result: item.result,
        remark: item.remark,
        startDate: fromDate,
        endDate: toDate,
        createdBy: Number(sessionStorage.getItem('empCode')),
        authLt440VLine: false,
        authLt11KvLine: false,
        authLt33KvLine: false,
      }));

      const formData = new FormData();

      formData.append('list', JSON.stringify(wiremanList));

      if (document instanceof File) {
        formData.append('doc', document);
      }

      const response = await createWiremanCertificate(formData);

      if (response?.data?.code === '200') {
        alert('Submitted Successfully');

        setExamDate('');
        setFromDate('');
        setToDate('');
        setDocument(null);
        setEntries([{ empCode: '', FULLNAME: '', result: '', remark: '' }]);
        setErrors([]);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{ fontFamily: 'serif', fontWeight: 'bold', color: '#0a1f83' }}
          >
            Wireman Certificate
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="g-3 mb-3" md={5}>
            <Col>
              <Card>
                <Card.Header>Circle Name</Card.Header>
                <Card.Body>
                  <Form.Control value={circleName} disabled />
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Examination Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    ref={examDateRef}
                    value={examDate}
                    isInvalid={!!dateErrors.examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {dateErrors.examDate}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>From Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    ref={fromDateRef}
                    value={fromDate}
                    isInvalid={!!dateErrors.fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {dateErrors.fromDate}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>To Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    ref={toDateRef}
                    value={toDate}
                    isInvalid={!!dateErrors.toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {dateErrors.toDate}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Document</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="file"
                    ref={docRef}
                    // value={document}
                    isInvalid={!!dateErrors.document}
                    onChange={(e) => setDocument(e.target.files[0])}
                  />
                  <Form.Control.Feedback type="invalid">
                    {dateErrors.document}
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Result</StyledTableCell>
                  <StyledTableCell>Remark</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {entries.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>

                    <StyledTableCell>
                      <Form.Control
                        type="number"
                        placeholder="Enter Employee Code"
                        ref={inputRefs.current[index]?.empCode}
                        value={row.empCode}
                        isInvalid={!!errors[index]?.empCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleChange(index, 'empCode', value);

                          fetchEmployeeName(index, value);
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <Form.Control
                        type="text"
                        placeholder="Employee Name"
                        value={row.FULLNAME}
                        disabled
                        readOnly
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <Form.Select
                        ref={inputRefs.current[index]?.result}
                        value={row.result}
                        isInvalid={!!errors[index]?.result}
                        onChange={(e) =>
                          handleChange(index, 'result', e.target.value)
                        }
                      >
                        <option value="">-- select --</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Not Qualified">Not Qualified</option>
                      </Form.Select>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Form.Control
                        ref={inputRefs.current[index]?.remark}
                        value={row.remark}
                        placeholder="Enter Remark"
                        isInvalid={!!errors[index]?.remark}
                        onChange={(e) =>
                          handleChange(index, 'remark', e.target.value)
                        }
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <IconButton
                        color="error"
                        disabled={entries.length === 1}
                        onClick={() => deleteRow(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="text-end mt-3">
            <Tooltip title="Add More Row" placement="top">
              <Button variant="contained" color="dark" onClick={addRow}>
                <AddBoxIcon color="success" />
              </Button>
            </Tooltip>
          </div>
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button
            variant="contained"
            className="blue-button"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Card.Footer>
      </Card>

      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={openBackdrop}>
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default WiremanCertificateByHr;
