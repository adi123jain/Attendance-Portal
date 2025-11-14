import React, { useState, useEffect, useRef, useMemo } from "react";
import Card from "react-bootstrap/Card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  Divider,
  Typography,
  Button,
  Backdrop,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getExpenditureByRo } from "../../../../Services/Auth";
import {
  StyledTableRow,
  StyledTableCell,
} from "../../../../Constants/TableStyles/Index";

// const headerBackground = "linear-gradient(to right, #90A4AE, #78909C)";
// const oddRowBackground = "#F9FAFB";
// const evenRowBackground = "#F1F3F4";
// const hoverBackground = "#E0E0E0";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     background: headerBackground,
//     color: theme.palette.common.white,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     textAlign: "center",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: oddRowBackground,
//   },
//   "&:nth-of-type(even)": {
//     backgroundColor: evenRowBackground,
//   },
//   "&:hover": {
//     backgroundColor: hoverBackground,
//   },
// }));

function ViewExpenditureByAuthority() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [expInTable, setExpInTable] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const tableRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year.toString());
  }, []);

  const getExpenditureForApproval = async () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select both month and year.");
      return;
    }

    const requestParam = `${selectedYear}${"-"}${selectedMonth}`;
    console.log("Request Param:", requestParam);
    setOpenBackdrop(true);

    try {
      const response = await getExpenditureByRo(requestParam);
      console.log("API Response:", response);
      setExpInTable(response?.data?.list || []);
      setOpenBackdrop(false);
      setTimeout(() => {
        tableRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Something went wrong while fetching records.");
    } finally {
      setOpenBackdrop(false);
    }
  };
  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>
          <Typography
            variant="h4"
            sx={{
              flex: 1,
              textAlign: "center",
              color: "#0a1f83",
              mb: 0,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            Expenditure For Approve/Reject
          </Typography>
        </Card.Header>
        <Card.Body>
          <Row xs={1} sm={3} md={3} className="g-3 mt-2">
            {/* Month Select */}
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

            {/* Year Select */}
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
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            {/* Search Button */}
            <Col>
              <Card>
                <Card.Header>click to Search</Card.Header>
                <Card.Body>
                  <Button
                    variant="contained"
                    className="blue-button w-100"
                    onClick={getExpenditureForApproval}
                  >
                    Search
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-4 shadow">
            <Card.Body>
              <TableContainer component={Paper} sx={{ marginTop: "15px" }}>
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
                      <StyledTableCell> Year-Month</StyledTableCell>
                      <StyledTableCell>Ref Number</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>View Heads</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {expInTable && expInTable.length > 0 ? (
                      expInTable.map((item, index) => (
                        <React.Fragment key={index}>
                          {/* Main Row */}
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>

                            <StyledTableCell>
                              {item.region.name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.circle.name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.division.name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.subdivision.name}
                            </StyledTableCell>
                            <StyledTableCell>{item.dc.name}</StyledTableCell>
                            <StyledTableCell>{item.created}</StyledTableCell>
                            <StyledTableCell>{item.empCode}</StyledTableCell>
                            <StyledTableCell>{item.fullName}</StyledTableCell>
                            <StyledTableCell>
                              {item.designation.name}
                            </StyledTableCell>
                            <StyledTableCell>{item.amount}</StyledTableCell>
                            <StyledTableCell>{item.monthYear}</StyledTableCell>
                            <StyledTableCell>{item.refNo}</StyledTableCell>
                            <StyledTableCell>{item.roApproval}</StyledTableCell>

                            <StyledTableCell>
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() =>
                                  navigate("/approveExpenditureByAuthority", {
                                    state: {
                                      referenceNo: item.refNo,
                                    },
                                  })
                                }
                              >
                                <VisibilityIcon fontSize="small" />
                              </Button>
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
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ViewExpenditureByAuthority;
