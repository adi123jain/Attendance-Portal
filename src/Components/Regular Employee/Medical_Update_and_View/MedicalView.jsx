import { useEffect, useState } from 'react';
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
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { getMedicalFormByEmpCode } from '../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function MedicalFormView() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getMedicalFormByEmpCode();
        // console.log(response);
        if (response.data.code === '200') {
          setOpenBackdrop(false);
          setData(response.data.list);
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
            Medical Reimbursement View
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
                  <StyledTableCell>Submission Date</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>
                        {item.patientName || '-'}
                      </StyledTableCell>
                      <StyledTableCell>{item.empCode || '-'}</StyledTableCell>
                      <StyledTableCell>{item.refNo || '-'}</StyledTableCell>
                      <StyledTableCell>{item.created || '-'}</StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title="Preview" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() =>
                              navigate('/medicalReimbursementUpdate', {
                                state: { item },
                              })
                            }
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default MedicalFormView;
