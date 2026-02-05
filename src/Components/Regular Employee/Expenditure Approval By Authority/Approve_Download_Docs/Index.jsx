import { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  Typography,
  Button,
  Backdrop,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Tooltip,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PropagateLoader } from 'react-spinners';
import { getIncentiveByrefNo, submitExpByRo } from '../../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../../Constants/TableStyles/Index';

function ApproveExpenditureByAuthority() {
  const location = useLocation();
  const referenceNo = location.state?.referenceNo || '';
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [headsInTable, setHeadsInTable] = useState([]);
  const [region, setRegion] = useState('');
  const [circle, setCircle] = useState('');
  const [division, setDivision] = useState('');
  const [subDivision, setSubDivision] = useState('');
  const [dc, setDc] = useState('');
  const [designation, setDesignation] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [requestedAmt, setRequestedAmt] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getIncentiveByrefNo(referenceNo);
        // console.log(response);
        if (response.data.code === '200') {
          setOpenBackdrop(false);
          setHeadsInTable(response.data.list[0].heads);
          setRegion(response.data.list[0].region.name);
          setCircle(response.data.list[0].circle.name);
          setDivision(response.data.list[0].division.name);
          setSubDivision(response.data.list[0].subdivision.name);
          setDc(response.data.list[0].dc.name);
          setDesignation(response.data.list[0].designation.name);
          setCurrentMonth(response.data.list[0].monthYear);
          setRequestedAmt(response.data.list[0].amount);
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.log('error', error);
        setOpenBackdrop(false);
      }
    };
    fetchDetails();
  }, []);

  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const statusRef = useRef(null);
  const remarkRef = useRef(null);

  const expenditureApproval = async () => {
    if (!status) {
      alert('Status is required');
      statusRef.current.focus();
      return;
    }
    if (!remark.trim()) {
      alert('Remark is required');
      remarkRef.current.focus();
      return;
    }
    setOpenBackdrop(true);
    try {
      const payload = {
        action: status,
        remark: remark,
        refNo: referenceNo,
        updatedBy: sessionStorage.getItem('empCode'),
      };

      const response = await submitExpByRo(payload);
      // console.log(response);
      if (response.data.code === '200') {
        alert('Submitted successfully!');
        setStatus('');
        setRemark('');
        setOpenBackdrop(false);
      } else {
        alert(response.data.message || 'Something went wrong');
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting data');
      setOpenBackdrop(false);
    }
  };
  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/viewExpenditureByAuthority">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>
          <Typography
            variant="h4"
            sx={{
              flex: 1,
              textAlign: 'center',
              color: '#0a1f83',
              mb: 0,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Expenditure Approval
          </Typography>
        </Card.Header>
        <Card.Body>
          <Card>
            <Card.Header className="text-center">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  mb: 0,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Basic Information
              </Typography>
            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>Region </Card.Header>
                    <Card.Body>
                      <Form.Control value={region} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Circle </Card.Header>
                    <Card.Body>
                      <Form.Control value={circle} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Division </Card.Header>
                    <Card.Body>
                      <Form.Control value={division} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Sub Division </Card.Header>
                    <Card.Body>
                      <Form.Control value={subDivision} disabled />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Distribution Center </Card.Header>
                    <Card.Body>
                      <Form.Control value={dc} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Designation </Card.Header>
                    <Card.Body>
                      <Form.Control value={designation} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Current Month/Year </Card.Header>
                    <Card.Body>
                      <Form.Control value={currentMonth} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Total Requested Amount (Rs) </Card.Header>
                    <Card.Body>
                      <Form.Control value={requestedAmt} disabled />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Body>
              <TableContainer component={Paper} sx={{ marginTop: '15px' }}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S. No.</StyledTableCell>
                      <StyledTableCell>Head's Name</StyledTableCell>
                      <StyledTableCell>Vendor's Name</StyledTableCell>
                      <StyledTableCell>Head Count</StyledTableCell>
                      <StyledTableCell>Requested Amount</StyledTableCell>
                      <StyledTableCell>Used Amount</StyledTableCell>
                      <StyledTableCell>Document Submit Date</StyledTableCell>
                      <StyledTableCell>Download Documents</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {headsInTable && headsInTable.length > 0 ? (
                      headsInTable.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>

                          <StyledTableCell>
                            {item.head?.name || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.vendorName || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.headCount || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.amount || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.usedAmount || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.docDate || '-'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.docPath ? (
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() =>
                                  (window.location.href = `https://attendance.mpcz.in:8888/E-Attendance/api/incentive/dw_expenditure/${item.docPath}`)
                                }
                              >
                                <CloudDownloadIcon
                                  fontSize="small"
                                  color="success"
                                />
                              </Button>
                            ) : (
                              'NA'
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={11}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Body>
              <Row className="g-3 mt-2">
                <Col xs={12} md={4}>
                  <Card>
                    <Card.Header>Status</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={statusRef}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="" disabled>
                          -- select status --
                        </option>
                        <option value="Approved"> Approved</option>
                        <option value="Rejected"> Rejected</option>
                        <option value="Resubmit">Resubmit</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={8}>
                  <Card>
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        ref={remarkRef}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Enter Remark"
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            component={Link}
            to="/"
            className="cancel-button"
            variant="contained"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            className="green-button"
            variant="contained"
            onClick={expenditureApproval}
          >
            Submit
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

export default ApproveExpenditureByAuthority;
