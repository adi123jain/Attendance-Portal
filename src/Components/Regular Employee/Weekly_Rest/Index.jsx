import { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import {
  getEmpWeeklyRest,
  getOutWeeklyRestEmp,
  updateWeeklyRestByRO,
} from '../../../Services/Auth';

import {
  Typography,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Button,
  Box,
  Backdrop,
} from '@mui/material';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PropagateLoader } from 'react-spinners';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

//  Days constant outside component
const days = [
  { value: '1', label: 'Sunday' },
  { value: '2', label: 'Monday' },
  { value: '3', label: 'Tuesday' },
  { value: '4', label: 'Wednesday' },
  { value: '5', label: 'Thursday' },
  { value: '6', label: 'Friday' },
  { value: '7', label: 'Saturday' },
];

function OutsourceEmpWeeklyRest() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const tableRef = useRef();
  const [details, setDetails] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [weeklyRest, setWeeklyRest] = useState('');

  //  Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getOutWeeklyRestEmp();
        if (response.data.code === '200') {
          setDetails(response.data.list);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error', error);
      } finally {
        setOpenBackdrop(false);
      }
    };

    fetchEmployees();
  }, []);

  const modalClose = () => setModalShow(false);

  //  Open modal + fetch weekly rest
  const modalOpen = async (items) => {
    setEmployeeName(items.fullName);
    setEmployeeCode(items.empCode);
    setOpenBackdrop(true);
    setModalShow(true);

    try {
      const response = await getEmpWeeklyRest(items.empCode);
      if (
        response?.data.code === '200' &&
        response?.data.message === 'Success'
      ) {
        setWeeklyRest(response.data.list[0].weeklyRest);
      } else {
        alert(response?.data.message);
      }
    } catch (error) {
      console.error('Error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  //  Update weekly rest
  const updateWeeklyRest = async () => {
    if (!weeklyRest) return alert('Please select a weekly rest day!');

    setOpenBackdrop(true);

    const payload = {
      empCode: employeeCode,
      weeklyRest: parseInt(weeklyRest, 10),
      reportingOfficer: sessionStorage.getItem('empCode'),
    };

    try {
      const response = await updateWeeklyRestByRO(payload);
      if (
        response?.data.code === '200' &&
        response?.data.message === 'Success'
      ) {
        alert('Weekly Rest Changed Successfully !!');
        window.location.reload();
      } else {
        alert(response?.data.message);
      }
    } catch (error) {
      console.error('Error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow placement="top">
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
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Employee's Shift Change
          </Typography>
        </Card.Header>

        <Card.Body>
          <TableContainer component={Paper}>
            <Table ref={tableRef} tabIndex={-1}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S. No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Designation</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Employee Type</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {details.length > 0 ? (
                  details.map((item, index) => (
                    <StyledTableRow key={item.empCode}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.empCode}</StyledTableCell>
                      <StyledTableCell>{item.fullName}</StyledTableCell>
                      <StyledTableCell>{item.designation}</StyledTableCell>
                      <StyledTableCell>{item.department}</StyledTableCell>
                      <StyledTableCell>{item.empType}</StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="View Images" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() => modalOpen(item)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
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
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal
        show={modalShow}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h6"
              sx={{
                color: '#0f9721ff',
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              {employeeName} - ({employeeCode})
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', mb: 1, color: '#0a1f83' }}
            >
              Select Day
            </Typography>
            <Form.Select
              value={weeklyRest}
              onChange={(e) => setWeeklyRest(e.target.value)}
            >
              <option value="" disabled>
                -- Select Day --
              </option>
              {days.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </Form.Select>
          </Box>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="cancel-button"
            variant="outlined"
            onClick={modalClose}
          >
            Close
          </Button>
          &nbsp; &nbsp;
          <Button
            className="green-button"
            variant="outlined"
            onClick={updateWeeklyRest}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loader */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default OutsourceEmpWeeklyRest;
