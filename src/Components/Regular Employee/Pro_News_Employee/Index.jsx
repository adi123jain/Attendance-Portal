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
import { Modal, Fade, Box } from '@mui/material';

import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';

import {
  getProNewsEmployee,
  proNewsEmployeeSubmit,
} from '../../../Services/Auth';
import { Link } from 'react-router-dom';

function ProNewsEmployee() {
  const [employeeList, setEmployeeList] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const remarkRefs = useRef({});
  const fileRefs = useRef({});

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

  useEffect(() => {
    fetchEmployees(false);
  }, []);

  const handleRadioChange = (e) => {
    const value = e.target.value === 'true';

    setIsSubmitted(value);
    fetchEmployees(value);
  };

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
      const response = await proNewsEmployeeSubmit(formData);
      if (response.data.code === '200') {
        alert('Submitted Successfully');
        fetchEmployees(false);
        setIsSubmitted(false);
      } else {
        alert(response.data.message);
      }
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
            News Reply By Employee
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
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Employee Location</StyledTableCell>
                  <StyledTableCell>Assigned Date</StyledTableCell>
                  <StyledTableCell>MD Remark</StyledTableCell>
                  <StyledTableCell>Pro Remark</StyledTableCell>
                  <StyledTableCell>Document</StyledTableCell>
                  <StyledTableCell>Submitted Date</StyledTableCell>
                  <StyledTableCell>Your Remark</StyledTableCell>
                  <StyledTableCell>Your Document</StyledTableCell>

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
                          onMouseEnter={() =>
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
                          onMouseEnter={() =>
                            handleOpenRemark('Assigned Remark', row.proRemark)
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

                      <StyledTableCell>
                        {row.empUpdatedNo || 'Not Found'}
                      </StyledTableCell>

                      <StyledTableCell>
                        <div
                          onMouseEnter={() =>
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

                      {!isSubmitted && (
                        <>
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

                          <StyledTableCell align="center">
                            <Tooltip title="Submit" arrow placement="top">
                              <Button
                                variant="contained"
                                color="dark"
                                size="small"
                                onClick={() => handleRowSubmit(row)}
                              >
                                <TaskAltIcon color="success" />
                              </Button>
                            </Tooltip>
                          </StyledTableCell>
                        </>
                      )}
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={isSubmitted ? 11 : 14}
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
    </>
  );
}

export default ProNewsEmployee;
