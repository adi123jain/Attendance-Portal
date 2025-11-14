import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
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
  Tooltip,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

import {
  getIncentiveByrefNo,
  submitExpenditure,
} from "../../../../Services/Auth";
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
function UploadExpenditureDocuments() {
  const location = useLocation();
  const referenceNo = location.state?.referenceNo || "";
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [headsInTable, setHeadsInTable] = useState([]);
  const [region, setRegion] = useState("");
  const [circle, setCircle] = useState("");
  const [division, setDivision] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const [dc, setDc] = useState("");
  const [designation, setDesignation] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [requestedAmt, setRequestedAmt] = useState("");
  const [status, setStatus] = useState("");
  const [roRemark, setRoRemark] = useState("");
  const [resubmitRemark, setResubmitRemark] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getIncentiveByrefNo(referenceNo);
        //console.log(response);
        if (response.data.code == "200") {
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
          setStatus(response.data.list[0].roApproval);
          setRoRemark(response.data.list[0].roRemark);
          setResubmitRemark(response.data.list[0].roResubmitRemark);
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.log("error", error);
        setOpenBackdrop(false);
      }
    };
    fetchDetails();
  }, []);

  const [formState, setFormState] = useState({});

  // Checkbox toggle
  const handleCheckboxChange = (headId, checked, usedAmount = "") => {
    setFormState((prev) => ({
      ...prev,
      [headId]: {
        ...prev[headId],
        checked,
        usedAmount: checked ? prev[headId]?.usedAmount || usedAmount : "",
        file: null,
      },
    }));
  };

  // Input changes
  const handleInputChange = (headId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [headId]: {
        ...prev[headId],
        [field]: value,
      },
    }));
  };

  // Submit handler
  const handleSubmit = async (item) => {
    const state = formState[item.headId];
    if (!state?.usedAmount) {
      alert("Expense amount is required.");
      return;
    }
    if (!state?.file) {
      alert("Please select a file to upload.");
      return;
    }

    const file = state.file;

    // File validations
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("id", item.headId);
    formData.append("usedAmount", state.usedAmount);
    formData.append("refNo", referenceNo);
    formData.append("document", file);

    try {
      setOpenBackdrop(true);
      const response = await submitExpenditure(formData);
      //console.log(response);
      if (response.data.code === "200") {
        alert(response.data.message);
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again.");
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/viewExpenditure">
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
            Expenditure Booking Against Revenue Realization and Commercial
            Activity
          </Typography>
        </Card.Header>
        <Card.Body>
          {/* Card 1 */}
          <Card>
            <Card.Header className="text-center">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: "center",
                  color: "#0a1f83",
                  mb: 0,
                  fontFamily: "serif",
                  fontWeight: "bold",
                }}
              >
                Basic Information
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
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

              {/* Row 2 */}

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

              <Row xs={1} sm={2} md={3} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Status</Card.Header>
                    <Card.Body>
                      <Form.Control value={status} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> RO Remark </Card.Header>
                    <Card.Body>
                      <Form.Control value={roRemark} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> ReSubmit Remark </Card.Header>
                    <Card.Body>
                      <Form.Control value={resubmitRemark} disabled />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header className="text-danger">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  color: "red",
                  mb: 0,
                  fontFamily: "serif",
                  fontWeight: "bold",
                }}
              >
                *To submit please select the checkbox in given Table.
              </Typography>
            </Card.Header>
            <Card.Body>
              <TableContainer component={Paper} sx={{ marginTop: "15px" }}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S. No.</StyledTableCell>
                      <StyledTableCell>Select Checkbox</StyledTableCell>
                      <StyledTableCell>Head's Name</StyledTableCell>
                      <StyledTableCell>Vendor's Name</StyledTableCell>
                      <StyledTableCell>Head Count</StyledTableCell>
                      <StyledTableCell>Requested Amount</StyledTableCell>
                      <StyledTableCell>Expense Amount</StyledTableCell>
                      <StyledTableCell>
                        Upload (only PDF, max 5 MB)
                      </StyledTableCell>
                      <StyledTableCell>Previous Document</StyledTableCell>
                      <StyledTableCell>Previous Amount</StyledTableCell>
                      <StyledTableCell>Submit</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {headsInTable && headsInTable.length > 0 ? (
                      headsInTable.map((item, index) => {
                        const state = formState[item.headId] || {};
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>
                              <input
                                type="checkbox"
                                checked={state.checked || false}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    item.headId,
                                    e.target.checked,
                                    item.usedAmount
                                  )
                                }
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.head?.name || "-"}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.vendorName || "-"}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.headCount || "-"}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.amount || "-"}
                            </StyledTableCell>

                            {/* Expense Amount */}
                            <StyledTableCell>
                              <Form.Control
                                type="number"
                                placeholder="Enter Amount"
                                disabled={!state.checked}
                                value={state.usedAmount || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    item.headId,
                                    "usedAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </StyledTableCell>

                            {/* Upload / Download */}
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
                                <Form.Control
                                  type="file"
                                  accept=".pdf"
                                  disabled={!state.checked}
                                  onChange={(e) =>
                                    handleInputChange(
                                      item.headId,
                                      "file",
                                      e.target.files[0]
                                    )
                                  }
                                />
                              )}
                            </StyledTableCell>

                            {/* Previous Document */}
                            <StyledTableCell>
                              {item.isResubmit && item.prevDocPath ? (
                                <Button
                                  variant="contained"
                                  color="dark"
                                  onClick={() =>
                                    (window.location.href = `https://attendance.mpcz.in:8888/E-Attendance/api/incentive/dw_expenditure/${item.prevDocPath}`)
                                  }
                                >
                                  <CloudDownloadIcon
                                    fontSize="small"
                                    color="success"
                                  />
                                </Button>
                              ) : (
                                "-"
                              )}
                            </StyledTableCell>

                            {/* Previous Amount */}
                            <StyledTableCell>
                              {item.isResubmit ? (
                                <Form.Control
                                  value={item.prevUsedAmount}
                                  disabled
                                />
                              ) : (
                                "-"
                              )}
                            </StyledTableCell>

                            {/* Submit */}
                            <StyledTableCell>
                              <Button
                                variant="contained"
                                className="green-button"
                                disabled={!state.checked}
                                onClick={() => handleSubmit(item)}
                              >
                                Submit
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })
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
        </Card.Body>
        <Card.Footer className="text-center">
          <Link to="/" className="btn btn-danger">
            Cancel
          </Link>
        </Card.Footer>
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
export default UploadExpenditureDocuments;
