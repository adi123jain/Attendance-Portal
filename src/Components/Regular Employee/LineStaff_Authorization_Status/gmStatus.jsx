import { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Button,
  TextField,
  Backdrop,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import Card from 'react-bootstrap/Card';
import { PropagateLoader } from 'react-spinners';

import { getLineSatusByGm, updateLineSatusByGm } from '../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function GmLineStaffStatus() {
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [records, setRecords] = useState([]);
  const sessionEmp = sessionStorage.getItem('empCode');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getLineSatusByGm(sessionEmp);
        // console.log(response);
        if (response.data.code === '200') {
          setRecords(response.data.list);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching SSO status:', error);
      } finally {
        setOpenBackdrop(false);
      }
    };
    fetchDetails();
  }, [sessionEmp]);

  const [actionValues, setActionValues] = useState({});
  const [remarkValues, setRemarkValues] = useState({});

  const [errors, setErrors] = useState({});
  const selectRefs = useRef({});

  const handleSelectChange = (index, value) => {
    setActionValues((prev) => ({ ...prev, [index]: value }));

    setErrors((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        select: false,
      },
    }));
  };

  const handleRemarkChange = (index, value) => {
    setRemarkValues((prev) => ({
      ...prev,
      [index]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        remark: false,
      },
    }));
  };

  // On update click
  const updateGmStatus = async (index, id) => {
    const selectedValue = actionValues[index];
    const remarkValue = remarkValues[index];

    let hasError = false;

    // ---- Validate Select ----
    if (!selectedValue) {
      hasError = true;
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          select: true,
        },
      }));

      const ref = selectRefs.current[index];
      if (ref) ref.focus();
    }

    // ---- Validate Remark ----
    if (!remarkValue || remarkValue.trim() === '') {
      hasError = true;
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          remark: true,
        },
      }));
    }

    if (hasError) return;

    try {
      setOpenBackdrop(true);

      const response = await updateLineSatusByGm(
        selectedValue,
        id,
        remarkValue,
      );
      // console.log('Update API Response:', response);

      if (response?.data?.code === '200') {
        alert('Successfully Updated!');
        window.location.reload();
      } else {
        alert(response?.data?.message || 'Update failed!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card
        className="shadow-lg rounded"
        style={{
          //   textAlign: "center",
          marginTop: '20px',
        }}
      >
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            Line Staff Authorization Status by GM
          </Typography>
        </Card.Header>

        <Card.Body className="px-4 pb-4">
          <Paper
            elevation={3}
            sx={{ borderRadius: '12px', overflow: 'hidden' }}
          >
            <TableContainer>
              <Table ref={tableRef} stickyHeader>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>Line Staff Name</StyledTableCell>
                    <StyledTableCell>JE Name</StyledTableCell>
                    <StyledTableCell>DGM Name</StyledTableCell>
                    <StyledTableCell>DGM Status</StyledTableCell>
                    <StyledTableCell>GM Name</StyledTableCell>
                    <StyledTableCell>GM Status</StyledTableCell>
                    <StyledTableCell>11KV</StyledTableCell>
                    <StyledTableCell>33KV</StyledTableCell>
                    <StyledTableCell>JE Remark</StyledTableCell>
                    <StyledTableCell>DGM Remark</StyledTableCell>
                    <StyledTableCell>DC Name</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                    <StyledTableCell>Remark</StyledTableCell>

                    <StyledTableCell>Update Status</StyledTableCell>
                  </StyledTableRow>
                </TableHead>

                <TableBody>
                  {records && records.length > 0 ? (
                    records.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {item.lineName || '-'}
                        </StyledTableCell>
                        <StyledTableCell>{item.jeName || '-'}</StyledTableCell>
                        <StyledTableCell>{item.dgmName || '-'}</StyledTableCell>
                        <StyledTableCell>
                          {item.dgmStatus || '-'}
                        </StyledTableCell>
                        <StyledTableCell>{item.gmName || '-'}</StyledTableCell>

                        <StyledTableCell>
                          {item.gmStatus || '-'}
                        </StyledTableCell>

                        <StyledTableCell>
                          {item.status11KV || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.status33KV || '-'}
                        </StyledTableCell>

                        <StyledTableCell>
                          {item.jeRemark || '-'}
                        </StyledTableCell>

                        <StyledTableCell>
                          {item.dgmRemark || '-'}
                        </StyledTableCell>

                        <StyledTableCell>{item.dcName || '-'}</StyledTableCell>

                        <StyledTableCell>
                          <FormControl
                            fullWidth
                            error={errors[index]}
                            variant="outlined"
                            size="small"
                          >
                            <Select
                              value={actionValues[index] || ''}
                              onChange={(e) =>
                                handleSelectChange(index, e.target.value)
                              }
                              displayEmpty
                              inputRef={(el) =>
                                (selectRefs.current[index] = el)
                              }
                            >
                              <MenuItem value="" disabled selected>
                                Select Status
                              </MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                            {errors[index] && (
                              <FormHelperText>
                                Please select a status before updating
                              </FormHelperText>
                            )}
                          </FormControl>
                        </StyledTableCell>

                        <StyledTableCell>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter remark"
                            value={remarkValues[index] || ''}
                            error={errors[index]?.remark}
                            helperText={
                              errors[index]?.remark ? 'Remark is required' : ''
                            }
                            onChange={(e) =>
                              handleRemarkChange(index, e.target.value)
                            }
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <Tooltip title="Update Status" arrow>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                background:
                                  'linear-gradient(90deg, #2196F3, #21CBF3)',
                                color: '#fff',
                                '&:hover': {
                                  background:
                                    'linear-gradient(90deg, #1E88E5, #1AA7E5)',
                                },
                              }}
                              onClick={() => updateGmStatus(index, item.id)}
                            >
                              <VerifiedIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={15}>
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No data found
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Card.Body>
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

export default GmLineStaffStatus;
