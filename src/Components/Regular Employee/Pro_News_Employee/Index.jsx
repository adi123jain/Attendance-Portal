import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { PropagateLoader } from 'react-spinners';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {
  Typography,
  Button,
  Backdrop,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TextField,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';

import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';

import {
  getProNewsEmployee,
  proNewsEmployeeSubmit,
} from '../../../Services/Auth';

function ProNewsEmployee() {
  const [employeeList, setEmployeeList] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // false = Pending (default)
  // true  = Submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  const remarkRefs = useRef({});
  const fileRefs = useRef({});

  // ---------------- FETCH API ----------------
  const fetchEmployees = async (status) => {
    try {
      setOpenBackdrop(true);

      const response = await getProNewsEmployee(status);

      if (response?.data?.code === '200') {
        const mapped = response.data.list.map((item) => ({
          ...item,
          remark: '',
          file: null,
          errors: {
            remark: '',
            file: '',
          },
        }));

        setEmployeeList(mapped);
      } else {
        setEmployeeList([]);
      }
    } catch (err) {
      console.error(err);
      setEmployeeList([]);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchEmployees(false); // default Pending
  }, []);

  // ---------------- RADIO CHANGE ----------------
  const handleRadioChange = (e) => {
    const value = e.target.value === 'true';

    setIsSubmitted(value);
    fetchEmployees(value);
  };

  // ---------------- SUBMIT ----------------
  const handleRowSubmit = async (row) => {
    let hasError = false;

    setEmployeeList((prev) =>
      prev.map((item) => {
        if (item.id !== row.id) return item;

        const errors = { remark: '', file: '' };

        if (!row.remark?.trim()) {
          errors.remark = '*Remark is required';
          hasError = true;
        }

        if (!row.file) {
          errors.file = '*Document is required';
          hasError = true;
        }

        return { ...item, errors };
      }),
    );

    if (!row.remark?.trim()) {
      remarkRefs.current[row.id]?.focus();
      return;
    }

    if (!row.file) {
      fileRefs.current[row.id]?.focus();
      return;
    }

    const formData = new FormData();
    formData.append('id', row.id);
    formData.append('empCode', row.empCode);
    formData.append('refNo', row.refNo);
    formData.append('remark', row.remark);
    formData.append('doc', row.file);

    try {
      setOpenBackdrop(true);
      await proNewsEmployeeSubmit(formData);

      alert('Submitted Successfully');

      // refresh pending list after submit
      fetchEmployees(false);
      setIsSubmitted(false);
    } catch (err) {
      alert('Submission failed');
    } finally {
      setOpenBackdrop(false);
    }
  };

  const shortText = (text, len = 35) =>
    text && text.length > len ? text.slice(0, len) + '...' : text || 'NA';

  const downloadDocument = (path) => {
    const downloadPath = `http://172.16.17.34:8084/e-Attendance/api/pro/downloadProDoc/${path}`;
    window.open(downloadPath, '_blank');
  };
  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{ color: '#0a1f83', fontWeight: 'bold' }}
          >
            Pro News Employee
          </Typography>

          <FormControl sx={{ mt: 2 }}>
            <RadioGroup
              row
              value={String(isSubmitted)}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Submitted"
              />
            </RadioGroup>
          </FormControl>
        </Card.Header>

        <Card.Body>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Emp Code</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>MD Remark</StyledTableCell>
                  <StyledTableCell>Pro Remark</StyledTableCell>
                  <StyledTableCell>Document</StyledTableCell>

                  {!isSubmitted && (
                    <>
                      <StyledTableCell>Upload</StyledTableCell>
                      <StyledTableCell>Remark</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {employeeList.length > 0 ? (
                  employeeList.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.empCode}</StyledTableCell>
                      <StyledTableCell>{row.empName}</StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title={row.mdComment || ''} arrow>
                          <span>{shortText(row.mdComment)}</span>
                        </Tooltip>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title={row.proRemark || ''} arrow>
                          <span>{shortText(row.proRemark)}</span>
                        </Tooltip>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title="Download" arrow placement="top">
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() => downloadDocument(row.doc)}
                          >
                            <CloudDownloadIcon color="success" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                      {!isSubmitted && (
                        <>
                          {/* FILE */}
                          <StyledTableCell>
                            <TextField
                              type="file"
                              size="small"
                              fullWidth
                              inputRef={(el) => (fileRefs.current[row.id] = el)}
                              error={!!row.errors.file}
                              helperText={row.errors.file}
                              onChange={(e) =>
                                setEmployeeList((prev) =>
                                  prev.map((item) =>
                                    item.id === row.id
                                      ? {
                                          ...item,
                                          file: e.target.files[0],
                                          errors: {
                                            ...item.errors,
                                            file: '',
                                          },
                                        }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </StyledTableCell>

                          {/* REMARK */}
                          <StyledTableCell>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Enter remark"
                              value={row.remark}
                              inputRef={(el) =>
                                (remarkRefs.current[row.id] = el)
                              }
                              error={!!row.errors.remark}
                              helperText={row.errors.remark}
                              onChange={(e) =>
                                setEmployeeList((prev) =>
                                  prev.map((item) =>
                                    item.id === row.id
                                      ? {
                                          ...item,
                                          remark: e.target.value,
                                          errors: {
                                            ...item.errors,
                                            remark: '',
                                          },
                                        }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </StyledTableCell>

                          {/* SUBMIT */}
                          <StyledTableCell align="center">
                            <Tooltip title="Submit" arrow placement="top">
                              <Button
                                variant="contained"
                                color="dark"
                                size="small"
                                onClick={() => handleRowSubmit(row)}
                              >
                                <TaskAltIcon />
                              </Button>
                            </Tooltip>
                          </StyledTableCell>
                        </>
                      )}
                    </StyledTableRow>
                  ))
                ) : (
                  // ✅ NO DATA FOUND
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={isSubmitted ? 5 : 8}
                      align="center"
                      sx={{ fontWeight: 'bold', color: '#777' }}
                    >
                      No Records Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
      </Card>

      {/* LOADER */}
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ProNewsEmployee;
