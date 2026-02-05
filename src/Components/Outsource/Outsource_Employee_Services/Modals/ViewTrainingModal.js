// ComplaintModal.js
import { getEmployeeTrainings } from '../../../../Services/Auth';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';

import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Button,
  Backdrop,
} from '@mui/material';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../../Constants/TableStyles/Index';

export default function EmployeeTrainingView({ open, onClose, empCode }) {
  const [trainings, setTrainings] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Fetch Training Details on mount
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getEmployeeTrainings(empCode);
        // console.log(response);
        if (
          response?.data?.code === '200' &&
          response?.data?.message === 'Success'
        ) {
          setTrainings(response.data.list || []);
          setOpenBackdrop(false);
        } else {
          alert(
            response?.data?.message || 'Failed to fetch Punishment Details',
          );
          setOpenBackdrop(false);
        }
      } catch (err) {
        console.error('Error fetching punishments:', err);
        setOpenBackdrop(false);
      }
    };
    fetchTrainings();
  }, []);
  return (
    <>
      <Modal
        show={open}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bold">
            <Typography
              variant="h5"
              sx={{
                color: '#0a1f83',
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              Employee Training Records
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell> Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Subject of Training</StyledTableCell>
                    <StyledTableCell>Date of Training</StyledTableCell>
                    <StyledTableCell>Updated By</StyledTableCell>
                    <StyledTableCell> Remark </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {trainings && trainings.length > 0 ? (
                    trainings.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{item.empCode}</StyledTableCell>
                        <StyledTableCell>{item.empName}</StyledTableCell>
                        <StyledTableCell>{item.subject}</StyledTableCell>
                        <StyledTableCell>{item.dateOfTraining}</StyledTableCell>
                        <StyledTableCell>{item.updatedBy}</StyledTableCell>
                        <StyledTableCell>{item.remark}</StyledTableCell>
                      </StyledTableRow>
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
