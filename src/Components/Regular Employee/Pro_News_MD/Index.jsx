import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { PropagateLoader } from 'react-spinners';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Modal, Fade, Box } from '@mui/material';

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
import { Link } from 'react-router-dom';

function ProNewsMD() {
  const [employeeList, setEmployeeList] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [monthYear, setMonthYear] = useState('');

  const remarkRefs = useRef({});

  const getMonthYearList = () => {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];

    const year = 2026;

    return months.map((month) => `${month}-${year}`);
  };

  const monthOptions = getMonthYearList();

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

  useEffect(() => {
    const defaultMonth = monthOptions[0];
    setMonthYear(defaultMonth);
    fetchEmployees(defaultMonth);
  }, []);

  const handleMonthChange = (e) => {
    const value = e.target.value;
    setMonthYear(value);
    fetchEmployees(value);
  };

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
    text && text.length > len
      ? text.slice(0, len) + '...'
      : text || 'Not Found';

  const downloadDocument = (path) => {
    const downloadPath = `https://attendance.mpcz.in:8888/E-Attendance/api/pro/downloadProDoc/${path}`;
    window.open(downloadPath, '_blank');
  };

  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [remarkContent, setRemarkContent] = useState('');
  const [remarkTitle, setRemarkTitle] = useState('');
  const hoverTimer = useRef(null);

  const handleOpenRemark = (title, content) => {
    clearTimeout(hoverTimer.current);

    hoverTimer.current = setTimeout(() => {
      setRemarkTitle(title);
      setRemarkContent(content || 'Not Found');
      setOpenRemarkModal(true);
    }, 300);
  };

  const handleCloseRemark = () => {
    clearTimeout(hoverTimer.current);
    setOpenRemarkModal(false);
  };

  const [openEditRemark, setOpenEditRemark] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [tempRemark, setTempRemark] = useState('');
  return (
    <>
      <Card className="shadow-lg rounded">
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
            News Comments (MD)
          </Typography>

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
            <Table sx={{ tableLayout: 'fixed', minWidth: 2400 }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Employee Location</StyledTableCell>
                  <StyledTableCell>Assigned Date</StyledTableCell>
                  <StyledTableCell>MD Remark</StyledTableCell>
                  <StyledTableCell>Assigned Remark</StyledTableCell>
                  <StyledTableCell>Date Of News</StyledTableCell>
                  <StyledTableCell>News Type</StyledTableCell>

                  <StyledTableCell>Document</StyledTableCell>
                  <StyledTableCell>User Submitted Date</StyledTableCell>
                  <StyledTableCell>User Remark</StyledTableCell>
                  <StyledTableCell>User Document</StyledTableCell>
                  <StyledTableCell>Remark </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {employeeList.length > 0 ? (
                  employeeList.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>
                        {row.empCode || 'Not Found'}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.empName || 'Not Found'}
                      </StyledTableCell>

                      <StyledTableCell>
                        {row.employeeDetail.postingLocation || 'Not Found'}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.dateOfNews || 'Not Found'}
                      </StyledTableCell>

                      <StyledTableCell>
                        <div
                          onClick={() =>
                            handleOpenRemark('MD Remark', row.mdComment)
                          }
                          style={{
                            maxWidth: 220,
                            cursor: 'default',
                            color: '#333',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {shortText(row.mdComment)}
                        </div>
                      </StyledTableCell>

                      <StyledTableCell>
                        <div
                          onClick={() =>
                            handleOpenRemark('Pro Remark', row.proRemark)
                          }
                          style={{
                            maxWidth: 220,
                            cursor: 'default',
                            color: '#333',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {shortText(row.proRemark)}
                        </div>
                      </StyledTableCell>

                      <StyledTableCell>{row.dateOfNews}</StyledTableCell>
                      <StyledTableCell>{row.type}</StyledTableCell>

                      <StyledTableCell>
                        <Tooltip
                          title="Download Assigned Document"
                          arrow
                          placement="top"
                        >
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() => downloadDocument(row.doc)}
                          >
                            <CloudDownloadIcon color="success" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>

                      <StyledTableCell>
                        {row.empUpdatedNo || 'Not Found'}
                      </StyledTableCell>
                      <StyledTableCell>
                        <div
                          onClick={() =>
                            handleOpenRemark('Employee Remark', row.empRemark)
                          }
                          style={{
                            maxWidth: 220,
                            cursor: 'default',
                            color: '#333',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {shortText(row.empRemark)}
                        </div>
                      </StyledTableCell>

                      <StyledTableCell>
                        {row.empDoc ? (
                          <Tooltip
                            title="Download Emp Document"
                            arrow
                            placement="top"
                          >
                            <Button
                              onClick={() => downloadDocument(row.empDoc)}
                              variant="contained"
                              color="dark"
                            >
                              <CloudDownloadIcon color="success" />
                            </Button>
                          </Tooltip>
                        ) : (
                          'Not Found'
                        )}
                      </StyledTableCell>

                      <StyledTableCell sx={{ width: 220 }}>
                        <Box
                          onClick={() => {
                            setActiveRow(row);
                            setTempRemark(row.remark || '');
                            setOpenEditRemark(true);
                          }}
                          sx={{
                            cursor: 'pointer',
                            px: 1.5,
                            py: 0.8,
                            borderRadius: 1,
                            border: '1px dashed #c4c4c4',
                            backgroundColor: '#fafafa',
                            '&:hover': {
                              borderColor: '#1976d2',
                              backgroundColor: '#f0f6ff',
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: row.remark ? '#333' : '#999',
                            }}
                          >
                            {row.remark || 'Click to add remark'}
                          </Typography>
                        </Box>

                        {row.errors.remark && (
                          <Typography variant="caption" color="error">
                            {row.errors.remark}
                          </Typography>
                        )}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Tooltip title="Add Comment" arrow placement="top">
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() => handleRowSubmit(row)}
                          >
                            <TaskAltIcon color="success" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={15}
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

        <Card.Footer className="text-center">
          <Button
            className="cancel-button"
            component={Link}
            to="/employeeDashboard"
          >
            Cancel
          </Button>
        </Card.Footer>
      </Card>

      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <PropagateLoader />
      </Backdrop>

      <Modal
        open={openRemarkModal}
        onClose={handleCloseRemark}
        closeAfterTransition
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={openRemarkModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '65%',
              maxHeight: '70vh',
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              outline: 'none',
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#0a1f83',
                borderBottom: '1px solid #eee',
                pb: 1,
              }}
            >
              {remarkTitle}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                color: '#444',
                lineHeight: 1.6,
              }}
            >
              {remarkContent}
            </Typography>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openEditRemark}
        onClose={() => setOpenEditRemark(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={openEditRemark}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1)',
              width: '520px',
              maxWidth: '90%',
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              p: 3,
              outline: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#0a1f83',
                borderBottom: '1px solid #eee',
                pb: 1,
              }}
            >
              Enter Remark
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={6}
              placeholder="Type your remark here..."
              value={tempRemark}
              onChange={(e) => setTempRemark(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#fafafa',
                },
              }}
            />

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1.5,
              }}
            >
              <Button
                onClick={() => setOpenEditRemark(false)}
                variant="outlined"
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  setEmployeeList((prev) =>
                    prev.map((item) =>
                      item.id === activeRow.id
                        ? {
                            ...item,
                            remark: tempRemark,
                            errors: { remark: '' },
                          }
                        : item,
                    ),
                  );
                  setOpenEditRemark(false);
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default ProNewsMD;
