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
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

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
import {
  getDgmByJe,
  getLineByDcId,
  getLineStaffAuth,
  submitLineAuthorization,
} from "../../../Services/Auth";
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
function LineStaffAuthorization() {
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [lineRecords, setLineRecords] = useState([]);
  const sessionEmp = sessionStorage.getItem("empCode");
  const sessionDcId = sessionStorage.getItem("dcId");

  useEffect(() => {
    const fetchRecords = async () => {
      setOpenBackdrop(true);
      const response = await getLineStaffAuth(sessionDcId);
      console.log(response);
      if (response.data.code == "200") {
        setLineRecords(response.data.list);
        setOpenBackdrop(false);
      } else {
        setOpenBackdrop(false);
        alert(response.data.message);
      }
    };
    fetchRecords();
  }, []);

  const [lineStaffList, setLineStaffList] = useState([]);
  const [selectLine, setSelectLine] = useState("");

  useEffect(() => {
    const fetchLineStaff = async () => {
      const response = await getLineByDcId(sessionDcId);
      console.log(response);
      if (response.data.code == "200") {
        setLineStaffList(response.data.list);
      } else {
        alert(response.data.message);
      }
    };
    fetchLineStaff();
  }, []);

  const [dgmList, setDgmList] = useState([]);
  const [selectDgm, setSelectDgm] = useState("");

  useEffect(() => {
    const fetchDgm = async () => {
      const response = await getDgmByJe(sessionEmp);
      console.log(response);
      if (response.data.code == "200") {
        setDgmList(response.data.list);
      } else {
        alert(response.data.message);
      }
    };
    fetchDgm();
  }, []);

  //  State
  // const [selectLine, setSelectLine] = useState("");
  const [is11kv, setIs11kv] = useState("No");
  const [is33kv, setIs33kv] = useState("No");
  // const [selectDgm, setSelectDgm] = useState("");
  const [errors, setErrors] = useState({});
  const [remark, setRemark] = useState("");

  //  Refs
  const lineRef = useRef(null);
  const dgmRef = useRef(null);
  const kv11Ref = useRef(null);
  const kv33Ref = useRef(null);
  const remarkRef = useRef(null);

  //  Validation
  const validate = () => {
    const newErrors = {};
    if (!selectLine) newErrors.selectLine = "Line Staff is required";
    if (is11kv === "No" && is33kv === "No")
      newErrors.voltage = "Select at least one voltage";
    if (!selectDgm) newErrors.selectDgm = "DGM is required";
    if (!remark) newErrors.remark = "Remark is required";
    setErrors(newErrors);

    // Focus on first invalid
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.selectLine && lineRef.current) lineRef.current.focus();
      else if (newErrors.voltage && kv11Ref.current) kv11Ref.current.focus();
      else if (newErrors.selectDgm && dgmRef.current) dgmRef.current.focus();
      else if (newErrors.remark && remarkRef.current) remarkRef.current.focus();
      return false;
    }
    return true;
  };

  // 🔹 Submit Handler
  const LineStaffSubmit = async () => {
    if (!validate()) return;
    setOpenBackdrop(true);

    const payload = {
      jeEmpCode: sessionEmp,
      lineEmpCode: selectLine,
      status11KV: is11kv,
      status33KV: is33kv,
      dcID: sessionDcId,
      dgmEmpCode: selectDgm,
      jeRemark: remark,
    };

    try {
      const response = await submitLineAuthorization(payload);
      console.log("Success:", response.data);
      if (response.data.code === "200") {
        alert("Submitted successfully!");
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Submission failed!");
      setOpenBackdrop(false);
    }
  };

  const downloadApprovedPDF = () => {
    // https://attendance.mpcz.in:8888/E-Attendance/api/OnM/getAuthorizationSsoPdfByDcId?dcId=${sessionDcId}
    window.open(
      `https://attendance.mpcz.in:8888/E-Attendance/api/OnM/getAuthorizationLinePdfByDcId?dcId=${sessionDcId}`,
      "_blank"
    );
  };

  const downloadPendingPDF = () => {
    // https://attendance.mpcz.in:8888/E-Attendance/api/OnM/getAuthorizationSsoPdfByDcId?dcId=${sessionDcId}
    window.open(
      `http://172.16.17.79:8084/e-Attendance/api/OnM/getAuthPendingLinePdfByDcId?dcId=${sessionDcId}`,
      "_blank"
    );
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
            Authorization chart issue to Line Staff
          </Typography>
        </Card.Header>

        <Card.Body>
          <Card
            // className="shadow-lg rounded"
            style={{
              textAlign: "center",
            }}
          >
            <Card.Header className="d-flex justify-content-between align-items-center p-3">
              <Typography
                variant="h5"
                sx={{
                  mb: 0,
                  fontFamily: "serif",
                  fontWeight: "bold",
                  color: "#0a1f83",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Records
              </Typography>
              <Tooltip
                title="Approved Authorization Chart"
                arrow
                placement="top"
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: "linear-gradient(90deg, #2E7D32, #66BB6A)",
                    color: "#fff",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1B5E20, #43A047)",
                      boxShadow: "0px 3px 7px rgba(0,0,0,0.2)",
                    },
                  }}
                  onClick={() => downloadApprovedPDF()}
                >
                  <CloudDownloadIcon fontSize="small" />
                </Button>
              </Tooltip>
              &nbsp;
              <Tooltip
                title="Pendings Authorization Chart"
                arrow
                placement="top"
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: "linear-gradient(90deg, #2E7D32, #66BB6A)",
                    color: "#fff",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1B5E20, #43A047)",
                      boxShadow: "0px 3px 7px rgba(0,0,0,0.2)",
                    },
                  }}
                  onClick={() => downloadPendingPDF()}
                >
                  <CloudDownloadIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Card.Header>

            <Card.Body>
              <TableContainer component={Paper}>
                <Table ref={tableRef}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Line Staff Name</StyledTableCell>
                      <StyledTableCell>JE Name</StyledTableCell>
                      <StyledTableCell>DGM Name</StyledTableCell>
                      <StyledTableCell>DGM Status </StyledTableCell>
                      <StyledTableCell>GM Name</StyledTableCell>
                      <StyledTableCell>GM Status</StyledTableCell>
                      <StyledTableCell>11KV</StyledTableCell>
                      <StyledTableCell>33KV</StyledTableCell>
                      <StyledTableCell>Updated On</StyledTableCell>
                      <StyledTableCell>DC Name</StyledTableCell>
                      <StyledTableCell>JE Remark</StyledTableCell>
                      <StyledTableCell>DGM Remark</StyledTableCell>
                      <StyledTableCell>GM Remark</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {lineRecords && lineRecords.length > 0 ? (
                      lineRecords.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.lineName || "-"}
                          </StyledTableCell>
                          <StyledTableCell>{item.jeName}</StyledTableCell>
                          <StyledTableCell>
                            {item.dgmName || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.dgmStatus || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.gmName || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.gmStatus || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.status11KV || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.status33KV || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.updated || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.dcName || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.jeRemark || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.dgmRemark || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.gmRemark || "-"}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={14}>
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
                Submit Line Staff Authorization
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row className="g-3 mt-1 mb-1">
                {/* Select Line Staff */}
                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header>Select Line Staff</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={lineRef}
                        value={selectLine}
                        onChange={(e) => setSelectLine(e.target.value)}
                        isInvalid={!!errors.selectLine}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        {lineStaffList.map((item, index) => (
                          <option value={item.empCode} key={index}>
                            {item.fullName} - {item.empCode}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.selectLine}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Select Voltage */}
                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header>Select Voltage</Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-3">
                        <Form.Check
                          ref={kv11Ref}
                          type="checkbox"
                          label="11KV"
                          checked={is11kv === "Yes"}
                          onChange={(e) =>
                            setIs11kv(e.target.checked ? "Yes" : "No")
                          }
                          isInvalid={!!errors.voltage}
                        />
                        <Form.Check
                          ref={kv33Ref}
                          type="checkbox"
                          label="33KV"
                          checked={is33kv === "Yes"}
                          onChange={(e) =>
                            setIs33kv(e.target.checked ? "Yes" : "No")
                          }
                          isInvalid={!!errors.voltage}
                        />
                      </div>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.voltage}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Select DGM */}
                <Col xs={12} md={3}>
                  <Card className="h-100">
                    <Card.Header>Select DGM</Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={dgmRef}
                        value={selectDgm}
                        onChange={(e) => setSelectDgm(e.target.value)}
                        isInvalid={!!errors.selectDgm}
                      >
                        <option value="" disabled>
                          -- select --
                        </option>
                        {dgmList.map((item, index) => (
                          <option value={item.empCode} key={index}>
                            {item.fullName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.selectDgm}
                      </Form.Control.Feedback>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={3}>
                  <Card>
                    <Card.Header>Remark</Card.Header>
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Remark..."
                        ref={remarkRef}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        isInvalid={!!errors.remark}
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
                onClick={LineStaffSubmit}
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

export default LineStaffAuthorization;
