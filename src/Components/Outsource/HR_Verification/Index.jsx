import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { getEmpForVerification } from '../../../Services/Auth';
import { PropagateLoader } from 'react-spinners';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function HRverification() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const empCode = sessionStorage.getItem('empCode');

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     setOpenBackdrop(true);
  //     try {
  //       const response = await getEmpForVerification(empCode);
  //       // console.log(response);
  //       if (response?.data?.list?.length > 0) {
  //         setEmployeeList(response.data.list);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setOpenBackdrop(false);
  //     }
  //   };

  //   fetchDetails();
  // }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const empCode = sessionStorage.getItem('empCode');

      if (!empCode) {
        console.warn('empCode not found in sessionStorage');
        window.location.reload();
        return;
      }

      setOpenBackdrop(true);
      try {
        const response = await getEmpForVerification(empCode);
        setEmployeeList(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setOpenBackdrop(false);
      }
    };

    fetchDetails();
  }, []);

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
            List of Employee for HR verification
          </Typography>
        </Card.Header>
        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Designation</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Employee Type</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {employeeList && employeeList.length > 0 ? (
                  employeeList.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.empCode || '-'}</StyledTableCell>
                      <StyledTableCell>{item.fullName || '-'}</StyledTableCell>
                      <StyledTableCell>
                        {item.designation || '-'}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.department || '-'}
                      </StyledTableCell>
                      <StyledTableCell>{item.empType || '-'}</StyledTableCell>
                      <StyledTableCell>
                        {item.hrVerified == null ? 'Pending' : item.hrVerified}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="outlined"
                          className="green-button"
                          onClick={() =>
                            navigate('/updateVerifyEmployee', {
                              state: {
                                empCode: item.empCode,
                                empName: item.fullName,
                              },
                            })
                          }
                        >
                          View
                        </Button>
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

export default HRverification;
