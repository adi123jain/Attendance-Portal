import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
import { getShutDown, submitShutDown } from "../../../Services/Auth";
import {
  StyledTableRow,
  StyledTableCell,
} from "../../../Constants/TableStyles/Index";

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
function SsoShutDown() {
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [shutdownRecords, setShutdownRecords] = useState([]);
  const sessionEmp = sessionStorage.getItem("empCode");
  const sessionDcId = sessionStorage.getItem("dcId");

  useEffect(() => {
    const fetchRecords = async () => {
      setOpenBackdrop(true);
      const response = await getShutDown(sessionEmp, sessionDcId);
      console.log(response);
      if (response.data.code == "200") {
        setShutdownRecords(response.data.list);
        setOpenBackdrop(false);
      } else {
        setOpenBackdrop(false);
        alert(response.data.message);
      }
    };
    fetchRecords();
  }, []);

  const [option, setOption] = useState("");
  const [year, setYear] = useState("");
  const [remark, setRemark] = useState("");

  const [errors, setErrors] = useState({});
  const optionRef = useRef(null);
  const yearRef = useRef(null);
  const remarkRef = useRef(null);

  const validate = () => {
    let newErrors = {};
    if (!option) newErrors.option = "Please select an option";
    if (!year) newErrors.year = "Please select a year";
    if (!remark.trim()) newErrors.remark = "Remark is required";
    setErrors(newErrors);

    // focus on first error field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.option) optionRef.current.focus();
      else if (newErrors.year) yearRef.current.focus();
      else if (newErrors.remark) remarkRef.current.focus();
      return false;
    }
    return true;
  };

  const shutdownSubmit = async () => {
    if (!validate()) return;
    setOpenBackdrop(true);

    const payload = {
      empCode: sessionEmp,
      isTaggingShutdown: option,
      fyYear: year,
      remark: remark,
      dcID: sessionDcId,
    };

    try {
      const response = await submitShutDown(payload);
      if (response.data.code == "200") {
        alert("successfully Shutdown !");
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card
        className="shadow-lg rounded"
        style={{
          //   textAlign: "center",
          marginTop: "20px",
        }}
      >
        <Card.Header className="text-center p-3">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: "serif",
              fontWeight: "bold",
              color: "#0a1f83",
            }}
          >
            S/s Operator Tagging all the Planned or Unplanned Shutdown
          </Typography>
        </Card.Header>

        <Card.Body>
          <Card
            // className="shadow-lg rounded"
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: "serif",
                  fontWeight: "bold",
                  color: "#0a1f83",
                }}
                // color="primary"
              >
                Shutdown Records
              </Typography>
            </Card.Header>

            <Card.Body>
              <TableContainer component={Paper}>
                <Table ref={tableRef}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Employee Name</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>DC Name</StyledTableCell>
                      <StyledTableCell>Shutdown Tagging</StyledTableCell>
                      <StyledTableCell>FY Year</StyledTableCell>
                      {/* <StyledTableCell>Updated By </StyledTableCell>
                      <StyledTableCell>Updated Date</StyledTableCell> */}
                      <StyledTableCell>Remark</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {shutdownRecords && shutdownRecords.length > 0 ? (
                      shutdownRecords.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.empName || "-"}
                          </StyledTableCell>
                          <StyledTableCell>{item.empCode}</StyledTableCell>
                          <StyledTableCell>
                            {item.dcName || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.isTaggingShutdown || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.fyYear || "-"}
                          </StyledTableCell>
                          {/* <StyledTableCell>
                            {item.updatedBy || "-"}
                          </StyledTableCell> */}
                          {/* <StyledTableCell>
                            {item.updated || "-"}
                          </StyledTableCell> */}
                          <StyledTableCell>
                            {item.remark || "-"}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={13}>
                          Data Not Found
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>

          <Card
            style={{
              marginTop: "20px",
            }}
          >
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: "serif",
                  fontWeight: "bold",
                  color: "#0a1f83",
                }}
              >
                Submit Planned/Unplanned Shutdown
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row className="g-3 mt-1 mb-1">
                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header>Please Select Option</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={optionRef}
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        isInvalid={!!errors.option}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.option}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header>Year</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={yearRef}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        isInvalid={!!errors.year}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        <option value="2024-25">2024-25</option>
                        <option value="2025-26">2025-26</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.year}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6}>
                  <Card className="h-100">
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        ref={remarkRef}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Enter Remark"
                        isInvalid={!!errors.remark}
                        className="w-100"
                      />
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.remark}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="outlined"
                className="cancel-button"
                component={Link}
                to="/"
              >
                Cancel
              </Button>
              &nbsp;
              <Button
                onClick={shutdownSubmit}
                variant="outlined"
                className="blue-button"
              >
                Submit
              </Button>
            </Card.Footer>
          </Card>
        </Card.Body>
      </Card>

      {/* Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default SsoShutDown;
