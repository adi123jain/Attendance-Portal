import React, { useEffect, useState, useRef } from 'react';
import { Backdrop, Typography } from '@mui/material';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import { getPunishmentType, updatePunishment } from '../../../../Services/Auth';
import { PropagateLoader } from 'react-spinners';

export default function PunishmentModal({ open, onClose, empCode }) {
  const [punishments, setPunishments] = useState([]);
  const [selectedPunishment, setSelectedPunishment] = useState('');
  const [remark, setRemark] = useState('');
  const [errors, setErrors] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const punishmentRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    const fetchPunishmentType = async () => {
      try {
        const response = await getPunishmentType();
        setPunishments(response.data.list || []);
      } catch (err) {
        console.error('Error fetching punishments:', err);
      }
    };
    fetchPunishmentType();
  }, []);

  const punishmentSubmit = async () => {
    const newErrors = {};

    if (!selectedPunishment)
      newErrors.selectedPunishment = '*Please select a punishment.';
    if (!remark.trim()) newErrors.remark = '*Please enter remarks.';

    setErrors(newErrors);

    // Focus on first invalid field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.selectedPunishment) {
        punishmentRef.current.focus();
      } else if (newErrors.remark) {
        remarkRef.current.focus();
      }
      return;
    }

    setOpenBackdrop(true);

    try {
      const payload = {
        empCode,
        punishmentTypeId: selectedPunishment,
        details: remark,
        hrEmpCode: sessionStorage.getItem('empCode'),
      };
      // console.log(payload);

      const response = await updatePunishment(payload);
      // console.log(response);
      if (response.data.code == '200') {
        alert('Punishment Updated !!');
        onClose();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to update punishment.' });
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Modal
        show={open}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bold">
            <Typography
              variant="h5"
              sx={{
                color: '#0a1f83',
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              Assign Punishment - ({empCode})
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            <Card className="mb-3">
              <Card.Header className="bg-light fw-semibold">
                Select Punishment
              </Card.Header>
              <Card.Body>
                <Form.Select
                  value={selectedPunishment}
                  onChange={(e) => setSelectedPunishment(e.target.value)}
                  ref={punishmentRef}
                  isInvalid={!!errors.selectedPunishment}
                >
                  <option value="" disabled>
                    -- select Punishment --
                  </option>
                  {punishments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  <Typography variant="caption">
                    {errors.selectedPunishment}
                  </Typography>
                </Form.Control.Feedback>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header className="bg-light fw-semibold">
                Remarks
              </Card.Header>
              <Card.Body>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  ref={remarkRef}
                  isInvalid={!!errors.remark}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.remark}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>

            {errors.submit && (
              <div className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
                <Typography variant="caption">{errors.submit}</Typography>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="cancel-button"
            variant="outlined"
            onClick={onClose}
            style={{ borderRadius: '20px', padding: '6px 20px' }}
            disabled={openBackdrop}
          >
            Close
          </Button>

          <Button
            className="green-button"
            variant="outlined"
            onClick={punishmentSubmit}
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
        </Modal.Footer>
      </Modal>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}
