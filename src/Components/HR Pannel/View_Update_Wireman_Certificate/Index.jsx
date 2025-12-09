import {
  Backdrop,
  Button,
  Checkbox,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';
import {
  getWiremanCertificates,
  updateWiremanCertificateGM,
} from '../../../Services/Auth';
import { Link } from 'react-router-dom';

function UpdateWiremanCertificateStatus() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState([]); // selected checkbox IDs
  const [rowData, setRowData] = useState({}); // store gmStatus & gmRemark per id
  const [errors, setErrors] = useState({});
  const circleId = sessionStorage.getItem('circleId');

  const inputRefs = useRef({}); // for focus on error fields

  // ===================================================================
  // 🔹 FETCH DATA
  // ===================================================================
  const fetchDetails = async () => {
    try {
      setOpenBackdrop(true);

      const response = await getWiremanCertificates(circleId);
      if (response.data.code === '200') {
        setCertificates(response.data.list);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(certificates.map((item) => item.id));
    } else {
      // setSelected([]);
      setSelected([]);
      setRowData({});
      setErrors({});
    }
  };

  // const handleSelectRow = (id) => {
  //   if (selected.includes(id)) {
  //     setSelected(selected.filter((item) => item !== id));
  //   } else {
  //     setSelected([...selected, id]);
  //   }
  // };

  const handleSelectRow = (id) => {
    const isSelected = selected.includes(id);

    if (isSelected) {
      // REMOVE ROW FROM SELECTION
      setSelected(selected.filter((item) => item !== id));

      // CLEAR INPUT VALUES FOR THIS ROW
      setRowData((prev) => {
        const updated = { ...prev };
        updated[id] = {
          gmStatus: '',
          gmRemark: '',
        };
        return updated;
      });

      // CLEAR VALIDATION ERRORS FOR THIS ROW
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      // ADD ROW TO SELECTION
      setSelected([...selected, id]);
    }
  };

  const handleRowChange = (id, field, value) => {
    setRowData({
      ...rowData,
      [id]: {
        ...rowData[id],
        [field]: value,
      },
    });
  };

  const validate = () => {
    let newErrors = {};
    let firstInvalidField = null;

    selected.forEach((id) => {
      const row = rowData[id] || {};

      if (!row.gmStatus) {
        newErrors[id] = { ...newErrors[id], gmStatus: '*Required' };
        if (!firstInvalidField) firstInvalidField = { id, field: 'gmStatus' };
      }

      if (!row.gmRemark || row.gmRemark.trim() === '') {
        newErrors[id] = { ...newErrors[id], gmRemark: '*Required' };
        if (!firstInvalidField) firstInvalidField = { id, field: 'gmRemark' };
      }
    });

    setErrors(newErrors);

    if (firstInvalidField) {
      setTimeout(() => {
        inputRefs.current[firstInvalidField.id][
          firstInvalidField.field
        ]?.focus();
      }, 200);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert('Please select at least one record!');
      return;
    }

    if (!validate()) return;

    const payload = selected.map((id) => ({
      id,
      gmStatus: rowData[id]?.gmStatus,
      gmRemark: rowData[id]?.gmRemark,
      updatedBy: sessionStorage.getItem('empCode'),
      gmEmpCode: sessionStorage.getItem('empCode'),
    }));

    console.log('FINAL PAYLOAD:', payload);

    try {
      setOpenBackdrop(true);

      const response = await updateWiremanCertificateGM(payload);

      if (response.data.code === '200') {
        alert('Updated Successfully!');
        fetchDetails();
        setRowData({});
        setSelected([]);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log('Error:', error);
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
            Update Wireman Certificate Status By GM
          </Typography>
        </Card.Header>

        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>

                  <StyledTableCell>
                    Select All <br />
                    <Checkbox
                      color="success"
                      checked={
                        selected.length === certificates.length &&
                        certificates.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </StyledTableCell>

                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Examination Date</StyledTableCell>
                  <StyledTableCell>Start Date</StyledTableCell>
                  <StyledTableCell>End Date</StyledTableCell>
                  <StyledTableCell>GM Status</StyledTableCell>
                  <StyledTableCell>GM Remark</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {certificates && certificates.length > 0 ? (
                  certificates.map((item, index) => {
                    if (!inputRefs.current[item.id]) {
                      inputRefs.current[item.id] = {};
                    }

                    return (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>

                        <StyledTableCell>
                          <Checkbox
                            color="success"
                            checked={selected.includes(item.id)}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </StyledTableCell>

                        <StyledTableCell>{item.empCode}</StyledTableCell>
                        <StyledTableCell>{item.fullName}</StyledTableCell>
                        <StyledTableCell>
                          {item.dateOfExamination}
                        </StyledTableCell>
                        <StyledTableCell>{item.startDate}</StyledTableCell>
                        <StyledTableCell>{item.endDate}</StyledTableCell>

                        {/* GM STATUS */}
                        <StyledTableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={rowData[item.id]?.gmStatus || ''}
                              inputRef={(el) =>
                                (inputRefs.current[item.id].gmStatus = el)
                              }
                              onChange={(e) =>
                                handleRowChange(
                                  item.id,
                                  'gmStatus',
                                  e.target.value,
                                )
                              }
                              error={!!errors[item.id]?.gmStatus}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                -- select status --
                              </MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>

                            {errors[item.id]?.gmStatus && (
                              <Typography
                                sx={{ color: 'red', fontSize: '12px' }}
                              >
                                {errors[item.id]?.gmStatus}
                              </Typography>
                            )}
                          </FormControl>
                        </StyledTableCell>

                        {/* REMARK */}
                        <StyledTableCell>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter remark"
                            inputRef={(el) =>
                              (inputRefs.current[item.id].gmRemark = el)
                            }
                            value={rowData[item.id]?.gmRemark || ''}
                            onChange={(e) =>
                              handleRowChange(
                                item.id,
                                'gmRemark',
                                e.target.value,
                              )
                            }
                            error={!!errors[item.id]?.gmRemark}
                            helperText={errors[item.id]?.gmRemark}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={10}
                      style={{ textAlign: 'center' }}
                    >
                      No Records Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>

        {/* FIXED FOOTER UPDATE BUTTON */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            background: '#fff',
            padding: '15px',
            textAlign: 'center',
            borderTop: '1px solid #ddd',
            zIndex: 100,
          }}
        >
          <Button
            component={Link}
            to="/"
            variant="contained"
            className="cancel-button"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            variant="contained"
            className="green-button"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
      </Card>

      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={openBackdrop}>
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default UpdateWiremanCertificateStatus;
