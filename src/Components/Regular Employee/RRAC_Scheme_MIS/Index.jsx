import React, { useState, useEffect, useRef, useMemo } from 'react';
import Card from 'react-bootstrap/Card';
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
  TableRow,
  Paper,
  Collapse,
  Box,
} from '@mui/material';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PropagateLoader } from 'react-spinners';
import { getIncentiveMisHostory } from '../../../Services/Auth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

function RRAC_MIS() {
  const [historyInTable, setHistoryInTable] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const tableRef = useRef(null);

  //  Set default current month & year
  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year.toString());
  }, []);

  const handleSubmit = async () => {
    if (!selectedMonth || !selectedYear) {
      alert('Please select both month and year.');
      return;
    }

    const requestParam = `${selectedYear}${'-'}${selectedMonth}`;
    console.log('Request Param:', requestParam);

    setOpenBackdrop(true);

    try {
      const response = await getIncentiveMisHostory(requestParam);
      console.log('API Response:', response);

      setHistoryInTable(response?.data?.list || []);

      // Wait a tick to ensure table is rendered, then focus
      setTimeout(() => {
        tableRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error fetching records:', error);
      alert('Something went wrong while fetching records.');
    } finally {
      setOpenBackdrop(false);
    }
  };

  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState('All');

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  //  Filtered data based on radio selection
  const filteredData = useMemo(() => {
    if (!historyInTable) return [];
    if (filter === 'All') return historyInTable;
    if (filter === 'Approved')
      return historyInTable.filter((item) => item.roApproval === 'Approved');
    if (filter === 'Not Approved')
      return historyInTable.filter((item) => item.roApproval !== 'Approved');
    return historyInTable;
  }, [historyInTable, filter]);

  //  Summary Calculations
  const summary = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        totalAmount: 0,
        totalRecords: 0,
        distinctEmp: 0,
        distinctLoc: 0,
      };
    }

    const totalAmount = filteredData.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );

    const totalRecords = filteredData.length;

    const distinctEmp = new Set(filteredData.map((i) => i.empCode)).size;

    const distinctLoc = new Set(filteredData.map((i) => i.dc?.name)).size;

    return { totalAmount, totalRecords, distinctEmp, distinctLoc };
  }, [filteredData]);

  const downloadExcel = () => {
    if (!selectedMonth || !selectedYear) {
      alert('Please select Month and Year before downloading');
      return;
    }

    const monthYear = `${selectedYear}-${selectedMonth}`;
    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/incentive/getIncentiveMIS?monthYear=${monthYear}`;
    window.open(url, '_blank');
  };

  const downloadDocument = () => {
    if (!selectedMonth || !selectedYear) {
      alert('Please select Month and Year before downloading');
      return;
    }

    const monthYear = `${selectedYear}-${selectedMonth}`;
    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/incentive/getIncentiveMIS?monthYear=${monthYear}`;

    window.open(url, '_blank');
  };

  return (
    <>
      <Card>
        <Card.Header className="text-center p-3">
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
            Revenue Realization & Commercial Activity (MIS)
          </Typography>
        </Card.Header>
        <Card.Body>
          <Row xs={1} sm={2} md={4} className="g-3 mt-2">
            <Col>
              <Card>
                <Card.Header>Month</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option disabled value="">
                      -- select Month --
                    </option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Year</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option disabled value="">
                      -- select Year --
                    </option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>click to Search</Card.Header>
                <Card.Body>
                  <Button
                    variant="contained"
                    className="blue-button w-100"
                    onClick={handleSubmit}
                  >
                    Search
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Download Excel</Card.Header>
                <Card.Body>
                  <Button
                    variant="contained"
                    className="green-button w-100"
                    onClick={downloadDocument}
                  >
                    Search
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-4 shadow">
            <Card.Header className="p-3 bg-light">
              <div className="d-flex gap-3 my-3">
                <Form.Check
                  type="radio"
                  label="All"
                  name="filter"
                  value="All"
                  checked={filter === 'All'}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Approved"
                  name="filter"
                  value="Approved"
                  checked={filter === 'Approved'}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Not Approved"
                  name="filter"
                  value="Not Approved"
                  checked={filter === 'Not Approved'}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <Row className="align-items-center g-3">
                <Col xs={12} md="auto" className="text-center">
                  <Button
                    onClick={downloadExcel}
                    className="green-button  mt-4"
                    variant="contained"
                  >
                    Export To Excel
                  </Button>
                </Col>

                <Col xs={12} md className="d-flex flex-wrap gap-3">
                  <Form.Group
                    controlId="grandTotal"
                    className="d-flex flex-column text-center flex-grow-1"
                  >
                    <Form.Label className="text-primary mb-0">
                      <strong>Total Amount</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      className="mt-1"
                      value={summary.totalAmount}
                    />
                  </Form.Group>

                  <Form.Group
                    controlId="totalRecord"
                    className="d-flex flex-column text-center flex-grow-1"
                  >
                    <Form.Label className="text-primary mb-0">
                      <strong>Total Records</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      className="mt-1"
                      value={summary.totalRecords}
                    />
                  </Form.Group>

                  <Form.Group
                    controlId="distinctEmp"
                    className="d-flex flex-column text-center flex-grow-1"
                  >
                    <Form.Label className="text-primary mb-0">
                      <strong>Distinct Employees</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      className="mt-1"
                      value={summary.distinctEmp}
                    />
                  </Form.Group>

                  <Form.Group
                    controlId="distinctLocation"
                    className="d-flex flex-column text-center flex-grow-1"
                  >
                    <Form.Label className="text-primary mb-0">
                      <strong>Distinct Locations</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      className="mt-1"
                      value={summary.distinctLoc}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              <TableContainer component={Paper} sx={{ marginTop: '15px' }}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Region Name</StyledTableCell>
                      <StyledTableCell>Circle Name</StyledTableCell>
                      <StyledTableCell>Division Name</StyledTableCell>
                      <StyledTableCell>Subdivision Name</StyledTableCell>
                      <StyledTableCell>DC Name</StyledTableCell>
                      <StyledTableCell>Request Date</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Full Name</StyledTableCell>
                      <StyledTableCell>Designation Name</StyledTableCell>
                      <StyledTableCell>Total Amount</StyledTableCell>
                      <StyledTableCell>Ref Number</StyledTableCell>
                      <StyledTableCell>RO Name</StyledTableCell>
                      <StyledTableCell>RO Designation</StyledTableCell>
                      <StyledTableCell>RO Employee Code</StyledTableCell>
                      <StyledTableCell>RO Approval Status</StyledTableCell>
                      <StyledTableCell>Approval Date</StyledTableCell>
                      <StyledTableCell>Some of Used Amount</StyledTableCell>
                      <StyledTableCell>View Heads</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {filteredData && filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <React.Fragment key={index}>
                          {/* Main Row */}
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>
                              {item.region?.name || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.circle?.name || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.division?.name || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.subdivision?.name || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.dc?.name || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.created || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.empCode || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.fullName || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.designation?.name || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.amount || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.refNo || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.roName || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.roDesignation || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.roEmpCode || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.roApproval || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.roApprovalDate || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.usedAmount || '-'}
                            </StyledTableCell>
                            <StyledTableCell>
                              {/* <Button
                                variant="contained"
                                onClick={() => toggleRow(index)}
                              >
                                {openRow === index
                                  ? "Hide Heads"
                                  : "View Heads"}
                              </Button> */}

                              <Button
                                variant="contained"
                                onClick={() => toggleRow(index)}
                                color="dark"
                              >
                                {openRow === index ? (
                                  <VisibilityOffIcon
                                    fontSize="small"
                                    color="success"
                                  />
                                ) : (
                                  <VisibilityIcon
                                    fontSize="small"
                                    color="error"
                                  />
                                )}
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>

                          {/* Collapsible Row */}
                          <StyledTableRow>
                            <StyledTableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={19}
                            >
                              <Collapse
                                in={openRow === index}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box margin={2}>
                                  <Table size="small">
                                    <TableHead>
                                      <StyledTableRow>
                                        <StyledTableCell>
                                          Head Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          Vendor Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          Head Count
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          Head Amount
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          Used Amount
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          Documents
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                      {item.heads && item.heads.length > 0 ? (
                                        item.heads.map((head, hIndex) => (
                                          <StyledTableRow key={hIndex}>
                                            <StyledTableCell>
                                              {head.head.name || '-'}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {head.vendorName || '-'}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {head.headCount || '0'}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {head.amount || '0'}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {head.usedAmount || '0'}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              <Button
                                                variant="contained"
                                                color="dark"
                                              >
                                                <CloudDownloadIcon
                                                  fontSize="small"
                                                  color="success"
                                                />
                                              </Button>
                                            </StyledTableCell>
                                          </StyledTableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <StyledTableCell
                                            colSpan={6}
                                            align="center"
                                          >
                                            No Head Data
                                          </StyledTableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </StyledTableCell>
                          </StyledTableRow>
                        </React.Fragment>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={19} align="center">
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>
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

export default RRAC_MIS;
