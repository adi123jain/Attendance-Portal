import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { PropagateLoader } from 'react-spinners';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  Select,
  MenuItem,
  FormControl,
  Modal,
  Fade,
  Box,
  Stack,
  IconButton,
  Tooltip,
  InputLabel,
} from '@mui/material';

import {
  StyledTableCell,
  StyledTableRow,
} from '../../../Constants/TableStyles/Index';
import { Link } from 'react-router-dom';
import {
  getAllCmHelplineHr,
  uploadCmExpDocument,
} from '../../../Services/Auth';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

function CmHelplineExpDocument() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [status, setStatus] = useState('');
  const [tableData, setTableData] = useState([]);
  const [openDocModal, setOpenDocModal] = useState(false);
  const [file, setFile] = useState(null);

  const resetModal = () => {
    setOpenDocModal(false);
    // setRemark('');
    setFile(null);
  };

  const handleChange = async (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    setOpenBackdrop(true);

    try {
      const { data } = await getAllCmHelplineHr(selectedStatus);

      if (data?.code === '200' && data?.message === 'Success') {
        setTableData(data?.list || []);
      } else {
        alert(data?.message);
        setTableData([]);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload document than submit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadCmExpDocument(formData);
      alert('Successfully Uploaded !!');
      resetModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = () => {
    setOpenDocModal(true);
  };

  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="d-flex align-items-center justify-content-between p-3">
          <div className="flex-grow-1 text-center">
            <Typography
              variant="h4"
              sx={{
                color: '#0a1f83',
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              CM Helpline
            </Typography>
          </div>

          <Tooltip title="Upload Document" arrow placement="top">
            <Button
              variant="contained"
              color="dark"
              onClick={() => handleOpenModal()}
            >
              <CloudUploadIcon fontSize="large" color="success" />
            </Button>
          </Tooltip>
        </Card.Header>

        <Card.Body>
          {/* Status Filter */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <FormControl
              sx={{
                minWidth: 280,
                background: '#fafafa',
                borderRadius: 2,
              }}
            >
              <InputLabel id="status-label" disabled>
                Select Status
              </InputLabel>

              <Select
                labelId="status-label"
                value={status}
                label="Select Status"
                onChange={handleChange}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d0d7de',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>--choose status--</em>
                </MenuItem>

                <MenuItem value="1">Explanation Issued</MenuItem>
                <MenuItem value="2">Reply Received</MenuItem>
                <MenuItem value="3">Explanation Closed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Employee Location</StyledTableCell>
                  <StyledTableCell>Complaint ID</StyledTableCell>
                  <StyledTableCell>Explaination No</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  {/* <StyledTableCell>Action</StyledTableCell> */}
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {tableData?.length ? (
                  tableData.map((row, index) => {
                    const {
                      id,
                      empCode,
                      empName,
                      employeeDetail,
                      cmHelplineCompId,
                      expNo,
                      status,
                    } = row;

                    return (
                      <StyledTableRow key={id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {empCode || 'Not Found'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {empName || 'Not Found'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {employeeDetail?.postingLocation || 'Not Found'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {cmHelplineCompId || 'Not Found'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {expNo || 'Not Found'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {status || 'Not Found'}
                        </StyledTableCell>
                        {/* <StyledTableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleOpenModal(row)}
                            color="dark"
                          >
                            <VisibilityIcon color="success" />
                          </Button>
                        </StyledTableCell> */}
                      </StyledTableRow>
                    );
                  })
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
        open={openDocModal}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            resetModal();
          }
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <Fade in={openDocModal}>
          <Box
            sx={{
              ...modalStyle,
              p: 0,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2,
                background: 'linear-gradient(90deg, #0a1f83 0%, #1976d2 100%)',
                color: '#fff',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Upload Document
              </Typography>

              <IconButton onClick={resetModal} sx={{ color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 3 }}>
              <Stack spacing={3}>
                {/* <Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                      color: '#333',
                    }}
                  >
                    Remark
                  </Typography>

                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter explanation remark..."
                    InputProps={{
                      startAdornment: (
                        <DescriptionIcon
                          sx={{ mr: 1, mt: 1, color: '#1976d2' }}
                        />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#fafafa',
                        alignItems: 'flex-start',
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      float: 'right',
                      mt: 0.5,
                      color: '#888',
                    }}
                  >
                    {remark.length}/250
                  </Typography>
                </Box> */}

                <Box>
                  {/* <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                      color: '#333',
                    }}
                  >
                    Upload Document
                  </Typography> */}

                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      fullWidth
                      value={file ? file.name : ''}
                      placeholder="No file selected"
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <AttachFileIcon sx={{ mr: 1, color: '#1976d2' }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: '#fafafa',
                        },
                      }}
                    />

                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        height: '56px',
                        minWidth: '140px',
                      }}
                    >
                      Browse
                      <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Stack>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Supported formats: PDF, JPG, PNG
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                px: 3,
                py: 2,
                borderTop: '1px solid #eee',
                background: '#fafafa',
              }}
            >
              <Button
                variant="outlined"
                onClick={resetModal}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default CmHelplineExpDocument;
