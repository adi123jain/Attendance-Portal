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
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';

import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';

import { getAllProNews, proNewsSubmitByMD } from '../../../Services/Auth';

function ProNewsMD() {
  const [employeeList, setEmployeeList] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [monthYear, setMonthYear] = useState('');

  const remarkRefs = useRef({});

  // ---------------- MONTH LIST ----------------
  const getMonthYearList = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const year = 2026;

    return months.map((month) => `${month}-${year}`);
  };

  const monthOptions = getMonthYearList();

  // ---------------- FETCH API ----------------
  const fetchEmployees = async (selectedMonth) => {
    try {
      setOpenBackdrop(true);

      const response = await getAllProNews(selectedMonth);

      if (response?.data?.code === '200') {
        const mapped = response.data.list.map((item) => ({
          ...item,
          remark: '',
          errors: {
            remark: '',
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
    const defaultMonth = monthOptions[0];
    setMonthYear(defaultMonth);
    fetchEmployees(defaultMonth);
  }, []);

  // ---------------- MONTH CHANGE ----------------
  const handleMonthChange = (e) => {
    const value = e.target.value;
    setMonthYear(value);
    fetchEmployees(value);
  };

  // ---------------- SUBMIT ----------------
  const handleRowSubmit = async (row) => {
    if (!row.remark?.trim()) {
      setEmployeeList((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                errors: { remark: '*Remark is required' },
              }
            : item,
        ),
      );

      remarkRefs.current[row.id]?.focus();
      return;
    }

    const payload = {
      id: row.id,
      empCode: row.empCode,
      refNo: row.refNo,
      remark: row.remark,
      doc: null,
    };

    try {
      setOpenBackdrop(true);
      await proNewsSubmitByMD(payload);

      alert('Submitted Successfully');

      fetchEmployees(monthYear);
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
            Pro News MD
          </Typography>

          {/* MONTH SELECT */}
          <FormControl sx={{ mt: 2, minWidth: 160 }}>
            <Select value={monthYear} onChange={handleMonthChange}>
              {monthOptions.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
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
                  <StyledTableCell>Remark</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
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
                        <Button
                          variant="contained"
                          onClick={() => downloadDocument(row.doc)}
                        >
                          <CloudDownloadIcon />
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter remark"
                          value={row.remark}
                          inputRef={(el) => (remarkRefs.current[row.id] = el)}
                          error={!!row.errors.remark}
                          helperText={row.errors.remark}
                          onChange={(e) =>
                            setEmployeeList((prev) =>
                              prev.map((item) =>
                                item.id === row.id
                                  ? {
                                      ...item,
                                      remark: e.target.value,
                                      errors: { remark: '' },
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleRowSubmit(row)}
                        >
                          <TaskAltIcon />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={8}
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

export default ProNewsMD;
