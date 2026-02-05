import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import { downloadWiremanCertificate } from '../../../../Services/Auth';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

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
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../../Constants/TableStyles/Index';

export default function DownloadCertificateModal({ open, onClose, empCode }) {
  const [certificateInfo, setCertificateInfo] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Fetch certificate info when empCode changes
  useEffect(() => {
    const fetchCertificateInfo = async () => {
      try {
        if (!empCode) return;
        setOpenBackdrop(true);

        const response = await downloadWiremanCertificate(empCode);

        if (
          response?.data?.code === '200' &&
          response?.data?.message === 'Success'
        ) {
          setCertificateInfo(response.data.list || []);
        } else {
          alert(response?.data?.message || 'Failed to fetch certificates');
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        alert('Something went wrong while fetching certificates');
      } finally {
        setOpenBackdrop(false);
      }
    };

    fetchCertificateInfo();
  }, [empCode]);

  const downloadCertificate = (certNo) => {
    if (certNo) {
      window.open(
        `https://attendance.mpcz.in:8888/E-Attendance/api/outsource/dw_f/${certNo}`,
        '_blank',
      );
    } else {
      alert('Certificate not available');
    }
  };

  return (
    <>
      <Modal
        show={open}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bold">
            <Typography
              variant="h5"
              sx={{
                color: '#0a1f83',
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              Download and View Certificates
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Circle Name</StyledTableCell>
                    <StyledTableCell>Certificate No</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Cancel Remark</StyledTableCell>
                    <StyledTableCell>Cancelled By</StyledTableCell>
                    <StyledTableCell>Cancelled Date</StyledTableCell>
                    <StyledTableCell>Cancelled Status</StyledTableCell>
                    <StyledTableCell>Certificate</StyledTableCell>
                    <StyledTableCell>Cancel Certificate</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {certificateInfo?.length > 0 ? (
                    certificateInfo.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{item.empCode || '-'}</StyledTableCell>
                        <StyledTableCell>{item.empName || '-'}</StyledTableCell>
                        <StyledTableCell>{item.circle || '-'}</StyledTableCell>
                        <StyledTableCell>
                          {item.certificateNo || '-'}
                        </StyledTableCell>
                        <StyledTableCell>{item.updated || '-'}</StyledTableCell>
                        <StyledTableCell>
                          {item.cancelRemark || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.cancelledBy || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.cancelledOn || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.isCancelled ? 'Yes' : 'No'}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip title="Download Certificate" arrow>
                            <Button
                              variant="contained"
                              color="dark"
                              onClick={() =>
                                downloadCertificate(item.certificatePath)
                              }
                            >
                              <CloudDownloadIcon
                                fontSize="small"
                                color="success"
                              />
                            </Button>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.isCancelled && item.cancelPdf ? (
                            <Tooltip title="Download Cancel Certificate" arrow>
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() =>
                                  downloadCertificate(item.cancelPdf)
                                }
                              >
                                <CloudDownloadIcon
                                  fontSize="small"
                                  color="error"
                                />
                              </Button>
                            </Tooltip>
                          ) : (
                            'Not Found'
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={12}>
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="cancel-button"
            variant="outlined"
            onClick={onClose}
            style={{ borderRadius: '20px', padding: '6px 20px' }}
            disabled={openBackdrop}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}
