import React, { useState, useRef } from 'react';
import { Backdrop, Typography } from '@mui/material';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import { outsourceEmpTraning } from '../../../Services/Auth';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function OutsourceEmployeeTraining() {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Form states
  const [trainingSubject, setTrainingSubject] = useState('');
  const [trainingDate, setTrainingDate] = useState('');
  const [employeeCodesInput, setEmployeeCodesInput] = useState('');
  const [remark, setRemark] = useState('');

  const [errors, setErrors] = useState({});

  // Refs for focus
  const subjectRef = useRef();
  const dateRef = useRef();
  const employeeRef = useRef();
  const remarkRef = useRef();

  // Validate form
  const validateForm = () => {
    let newErrors = {};

    if (!trainingSubject.trim())
      newErrors.trainingSubject = '*Subject is required';
    if (!trainingDate) newErrors.trainingDate = '*Date is required';
    if (!employeeCodesInput.trim())
      newErrors.employeeCodesInput = '*Employee Code(s) required';
    if (!remark.trim()) newErrors.remark = '*Remark is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.trainingSubject) subjectRef.current.focus();
      else if (newErrors.trainingDate) dateRef.current.focus();
      else if (newErrors.employeeCodesInput) employeeRef.current.focus();
      else if (newErrors.remark) remarkRef.current.focus();
      return false;
    }
    return true;
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Convert input to array of trimmed codes
    const employeeCodes = employeeCodesInput
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code !== '');

    const payload = {
      subject: trainingSubject,
      date: trainingDate,
      empCode: employeeCodes,
      remark: remark,
      createdBy: sessionStorage.getItem('empCode'),
    };

    try {
      setOpenBackdrop(true);
      const response = await outsourceEmpTraning(payload);
      if (response.data.code === '200' && response.data.message === 'Success') {
        alert('Training record saved successfully!');
        window.location.reload();
        setOpenBackdrop(false);
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.error('Error saving training:', err);
      alert('Failed to save training!');
      setOpenBackdrop(false);
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="text-primary text-center p-3">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            Outsource Employee Training
          </Typography>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  Subject of Training
                </Card.Header>
                <Card.Body>
                  <Form.Control
                    ref={subjectRef}
                    placeholder="Enter Subject of Training"
                    value={trainingSubject}
                    onChange={(e) => setTrainingSubject(e.target.value)}
                    isInvalid={!!errors.trainingSubject}
                  />
                  <Form.Control.Feedback type="invalid">
                    &nbsp;
                    <Typography variant="caption">
                      {errors.trainingSubject}
                    </Typography>
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  Select Training Date
                </Card.Header>
                <Card.Body>
                  <Form.Control
                    ref={dateRef}
                    type="date"
                    value={trainingDate}
                    onChange={(e) => setTrainingDate(e.target.value)}
                    isInvalid={!!errors.trainingDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    &nbsp;
                    <Typography variant="caption">
                      {errors.trainingDate}
                    </Typography>
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  Employee Code(s) (comma separated)
                </Card.Header>
                <Card.Body>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="e.g. 33001, 33002, 33003"
                    value={employeeCodesInput}
                    onChange={(e) => setEmployeeCodesInput(e.target.value)}
                    ref={employeeRef}
                    isInvalid={!!errors.employeeCodesInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    &nbsp;
                    <Typography variant="caption">
                      {errors.employeeCodesInput}
                    </Typography>
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3">
                <Card.Header className="bg-light">Enter Remark</Card.Header>
                <Card.Body>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter Remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    ref={remarkRef}
                    isInvalid={!!errors.remark}
                  />
                  <Form.Control.Feedback type="invalid">
                    &nbsp;
                    <Typography variant="caption">{errors.remark}</Typography>
                  </Form.Control.Feedback>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button
            className="cancel-button"
            variant="contained"
            style={{ borderRadius: '20px', padding: '6px 20px' }}
            component={Link}
            to="/"
          >
            Cancel
          </Button>
          &nbsp; &nbsp;
          <Button
            className="blue-button"
            variant="contained"
            onClick={handleSubmit}
            style={{
              borderRadius: '20px',
              backgroundColor: '#0a1f83',
              color: '#fff',
              padding: '6px 20px',
              border: 'none',
            }}
            disabled={openBackdrop}
          >
            {openBackdrop ? 'Updating...' : 'Update'}
          </Button>
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

export default OutsourceEmployeeTraining;
