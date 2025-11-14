import React, { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Divider } from "@mui/material";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
// import "../../../Constants/Style/styles.css";
import {
  Typography,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Backdrop,
} from "@mui/material";
import { getCorrectionsByRoId } from "../../../Services/Auth";
import {
  StyledTableRow,
  StyledTableCell,
} from "../../../Constants/TableStyles/Index";

// const headerBackground = "linear-gradient(to right, #1E88E5, #42A5F5)";
// const oddRowBackground = "#E3F2FD";
// const evenRowBackground = "#BBDEFB";
// const hoverBackground = "#90CAF9";

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

function CorrectionApplication() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [details, setDetails] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  //set Current Month / Year
  useEffect(() => {
    const currentDate = new Date();
    setMonth(String(currentDate.getMonth() + 1));
    setYear(String(currentDate.getFullYear()));
  }, []);

  const viewCorrections = async () => {
    try {
      setOpenBackdrop(true);
      const response = await getCorrectionsByRoId(month, year);
      console.log(response);
      if (response.data.code == "200") {
        setDetails(response.data.list);
        setOpenBackdrop(false);
        setTimeout(() => {
          tableRef.current?.focus();
        }, 100);
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      setOpenBackdrop(false);
      console.log("Error", error);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="text-center text-primary p-3">
          <Typography
            variant="h4"
            sx={{
              color: "#0a1f83",
              mb: 2,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            Attendance Correction Application
          </Typography>
        </Card.Header>
        <Card.Body>
          <Row xs={1} md={5} className="justify-content-center my-4 ">
            <Col xs={0} md={1}></Col>
            <Col xs={12} sm={6} md={2} className="mb-2">
              <Form.Select
                onChange={(e) => setMonth(e.target.value)}
                value={month}
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Form.Select>
            </Col>
            <Col xs={12} sm={6} md={2} className="mb-2">
              <Form.Select
                onChange={(e) => setYear(e.target.value)}
                value={year}
              >
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </Form.Select>
            </Col>
            <Col xs={12} sm={4} md={2} className="d-grid mb-2">
              <Button
                variant="contained"
                className="blue-button"
                onClick={viewCorrections}
              >
                Search
              </Button>
            </Col>
            <Col xs={0} md={1}></Col>
          </Row>

          <TableContainer component={Paper}>
            <Table ref={tableRef} tabIndex={-1}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Designation</StyledTableCell>
                  <StyledTableCell>Total Applications</StyledTableCell>
                  <StyledTableCell>Applications Pending</StyledTableCell>
                  <StyledTableCell>Corrections View </StyledTableCell>
                  <StyledTableCell>Self Allow </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 ? (
                  details.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell> {index + 1}</StyledTableCell>
                      <StyledTableCell> {item.empCode}</StyledTableCell>
                      <StyledTableCell> {item.empName}</StyledTableCell>
                      <StyledTableCell> {item.designation}</StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {item.totalApplication}
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        {item.pendingApplication}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="View Corrections" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() =>
                              navigate("/correctionApproval", {
                                state: {
                                  empCode: item.empCode,
                                  empName: item.empName,
                                  empDesignation: item.designation,
                                  month: month,
                                  year: year,
                                },
                              })
                            }
                          >
                            {" "}
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title="Updation By RO" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            onClick={() =>
                              navigate("/correctionApprovalRO", {
                                state: {
                                  empCode: item.empCode,
                                  empName: item.empName,
                                  empDesignation: item.designation,
                                  month: month,
                                  year: year,
                                },
                              })
                            }
                          >
                            {" "}
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={8}>
                      {" "}
                      Data Not Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer></Card.Footer>
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
export default CorrectionApplication;
