import React, { useRef, useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useNavigate } from "react-router-dom";
import {
  getOutsourceEmpByEmpCode,
  getOutsourceEmpByLevel,
} from "../../../Services/Auth";
import SearchUtils from "../../../Constants/Search_Utils/Index";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import "../../../Constants/Style/styles.css";
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
  Box,
} from "@mui/material";
import PunishmentModal from "./Modals/PunishmentModal";
import ComplaintModal from "./Modals/ComplaintModal";
import ViewPunishmentModal from "./Modals/ViewPunishmentModal";
import ViewComplaintModal from "./Modals/ViewComplaintModal";
import DeleteCertificateModal from "./Modals/DeleteCertificateModal";
import UploadCertificateModal from "./Modals/UploadCertificateModal";
import DownloadCertificateModal from "./Modals/DownloadCertificateModal";
import EmployeeTrainingView from "./Modals/ViewTrainingModal";
import {
  StyledTableRow,
  StyledTableCell,
} from "../../../Constants/TableStyles/Index";

// Styled Components
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

function OutsourceEmployeeServices() {
  const regionRef = useRef(null);
  // const circleRef = useRef(null);
  // const divisionRef = useRef(null);
  const tableRef = useRef(null);
  const empTableRef = useRef(null);
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({
    region: "",
    circle: "",
    division: "",
    subDivision: "",
    dc: "",
    subStation: "",
  });

  const [errors, setErrors] = useState({});
  const [showLevelTable, setShowLevelTable] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataInLevelTable, setDataInLevelTable] = useState([]);

  const validate = () => {
    const newErrors = {};
    if (!searchValues.region) {
      newErrors.region = " *region is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (showLevelTable && dataInLevelTable.length > 0 && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showLevelTable, dataInLevelTable]);

  // Search Employee By Level
  const searchEmpByLevel = async () => {
    setShowEmpTable(false);
    setEmpCode("");
    setEmpCodeError("");
    if (!validate()) {
      setEmpCodeError("");
      if (!searchValues.region && regionRef.current) {
        regionRef.current.focus();
      }
      return;
    }
    setOpenBackdrop(true);

    try {
      const payload = {
        regionId: searchValues.region,
        circleId: searchValues.circle,
        divisionId: searchValues.division,
        subDivisionId: searchValues.subDivision,
        dcId: searchValues.dc,
        substationId: searchValues.subStation,
      };
      const res = await getOutsourceEmpByLevel(payload);
      // console.log("Employee Data:", res?.data);
      if (res?.data.code == "200" && res?.data.message == "Success") {
        setOpenBackdrop(true);
        setDataInLevelTable(res?.data.list);
        setShowLevelTable(true);
        //tableRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        alert(res?.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      setOpenBackdrop(false);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // Search By Emp Code
  const [empCode, setEmpCode] = useState("");
  const [empCodeError, setEmpCodeError] = useState("");
  const [showEmpTable, setShowEmpTable] = useState(false);
  const [dataInEmpTable, setDataInEmpTable] = useState([]);

  useEffect(() => {
    if (showEmpTable && empTableRef.current) {
      empTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showEmpTable, dataInEmpTable]);

  const searchByEmpCode = async () => {
    setShowLevelTable(false);
    setSearchValues({
      region: "",
      circle: "",
      division: "",
      subDivision: "",
      dc: "",
      subStation: "",
    });
    setErrors("");
    if (!empCode.trim()) {
      setEmpCodeError("Employee Code is Required.");
      return;
    } else {
      setEmpCodeError("");
    }

    setOpenBackdrop(true);

    try {
      const payload = {
        empCode: empCode,
        regionId: null,
        circleId: null,
        divisionId: null,
        subDivisionId: null,
        dcId: null,
        substationId: null,
      };
      const res = await getOutsourceEmpByEmpCode(payload);
      console.log("Response:", res?.data);

      if (res?.data.code === "200" && res?.data.message === "Success") {
        setDataInEmpTable(res?.data.list?.[0]);
        // console.log("___", dataInEmpTable);
        setShowEmpTable(true);
      } else {
        setDataInEmpTable(null);
        setShowEmpTable(true);
        alert(res?.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // const getEmpInformation = (e) => {
  //   e.preventDefault();

  //   const empCode = sessionStorage.getItem("empCode");
  //   if (!empCode) {
  //     console.error("Employee Code not found in sessionStorage.");
  //     return;
  //   }

  //   const downloadUrl = `https://attendance.mpcz.in:8888/E-Attendance/api/outsource/getEmployeeMis?empCode=${empCode}`;

  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = downloadUrl;
  //   downloadLink.target = "_blank";
  //   downloadLink.download = "";
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  // };

  const [modalState, setModalState] = useState({
    open: false,
    type: null,
    empCode: "",
  });

  const handleOpen = (type, empCode) => {
    setModalState({ open: true, type, empCode });
  };

  const handleClose = () => {
    setModalState({ open: false, type: null, empCode: "" });
  };

  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="p-3">
          <Box
            sx={{
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "space-between",
              textAlign: "center",
              mb: 2,
            }}
          >
            {/* Centered Typography */}
            <Typography
              variant="h4"
              sx={{
                color: "#0a1f83",
                fontFamily: "serif",
                fontWeight: "bold",
                flex: 1,
                textAlign: "center",
              }}
            >
              Employee Service's (Outsource)
            </Typography>

            {/* Right-side Download Button */}
            {/* <Link to="#" onClick={getEmpInformation}>
              <Tooltip
                title="Click here to download Employee Information in Excel Sheet"
                arrow
              >
                <Button variant="contained" color="dark">
                  <CloudDownloadIcon fontSize="large" color="success" />
                </Button>
              </Tooltip>
            </Link> */}
          </Box>
        </Card.Header>

        <Card.Body>
          <SearchUtils
            values={searchValues}
            setValues={setSearchValues}
            errors={errors}
            refs={{
              region: regionRef,
              // circle: circleRef,
              // division: divisionRef,
            }}
          />
          <div className="text-center mt-4 mb-3">
            <Button
              onClick={searchEmpByLevel}
              variant="outlined"
              className="blue-button"
            >
              Search Employee's
            </Button>
          </div>
          <hr />

          <div className="row">
            <div className="col-12 col-md-4">
              <Card>
                <Card.Header className="bg-light">
                  *Search By Employee Code
                </Card.Header>
                <Card.Body>
                  <div className="row gx-2">
                    {/* Input Field */}
                    <div className="col-8">
                      <input
                        type="number"
                        id="empCode"
                        className={`form-control ${
                          empCodeError ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Employee Code"
                        value={empCode}
                        onChange={(e) => {
                          setEmpCode(e.target.value);
                          if (empCodeError) setEmpCodeError("");
                        }}
                      />
                      {empCodeError && (
                        <div className="invalid-feedback">{empCodeError}</div>
                      )}
                    </div>

                    {/* Search Button */}
                    <div className="col-4">
                      <Button
                        onClick={searchByEmpCode}
                        fullWidth
                        variant="outlined"
                        className="blue-button"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
      </Card>

      {showLevelTable && (
        <Card
          className="shadow-lg rounded"
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Card.Header className="text-center p-3">
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: "serif",
                fontWeight: "bold",
                color: "#0a1f83",
              }}
            >
              Employee Service's (Outsource)
            </Typography>
            <TextField
              label="Search by Code, Name or Designation"
              variant="outlined"
              sx={{
                mb: 2,
                mt: 1,
                width: "50%",
                mr: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Card.Header>

          <Card.Body>
            <TableContainer component={Paper}>
              <Table ref={tableRef}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell> Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Designation</StyledTableCell>
                    <StyledTableCell>Punishment</StyledTableCell>
                    <StyledTableCell>View Punishment</StyledTableCell>
                    <StyledTableCell>Complaint</StyledTableCell>
                    <StyledTableCell>View Complaint</StyledTableCell>
                    <StyledTableCell>Upload Certificate</StyledTableCell>
                    <StyledTableCell>Download Certificate</StyledTableCell>
                    <StyledTableCell>Delete Certificate</StyledTableCell>
                    <StyledTableCell>Employee Training</StyledTableCell>
                    <StyledTableCell>View Training</StyledTableCell>
                    <StyledTableCell>Place of Postings</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInLevelTable && dataInLevelTable.length > 0 ? (
                    dataInLevelTable
                      .filter((item) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          String(item.empCode || "")
                            .toLowerCase()
                            .includes(query) ||
                          String(item.fullName || "")
                            .toLowerCase()
                            .includes(query) ||
                          String(item.designation || "")
                            .toLowerCase()
                            .includes(query)
                        );
                      })
                      .map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{item.empCode}</StyledTableCell>
                          <StyledTableCell>{item.fullName}</StyledTableCell>
                          <StyledTableCell>{item.designation}</StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen("punishmentModal", item.empCode)
                              }
                            >
                              <Tooltip title="Punishment" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen("viewPunishmentModal", item.empCode)
                              }
                            >
                              <Tooltip title="View Punishment" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen("complaintModal", item.empCode)
                              }
                            >
                              <Tooltip title="Complaint" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen("viewComplaintModal", item.empCode)
                              }
                            >
                              <Tooltip title="View Complaint" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>

                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen(
                                  "uploadCertificateModal",
                                  item.empCode
                                )
                              }
                            >
                              <Tooltip title="Upload Certificate" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen(
                                  "downloadCertificateModal",
                                  item.empCode
                                )
                              }
                            >
                              <Tooltip title="Download Certificate" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen(
                                  "deleteCertificateModal",
                                  item.empCode
                                )
                              }
                            >
                              <Tooltip title="Delete Certificate" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                navigate("/outsourceEmployeeTraining")
                              }
                            >
                              <Tooltip title="Employee Training" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>

                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                handleOpen("viewEmployeeTraining", item.empCode)
                              }
                            >
                              <Tooltip title="Employee Training" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>

                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                              onClick={() =>
                                navigate("/outsourceEmployeePosting", {
                                  state: {
                                    empCode: item.empCode,
                                    fullName: item.fullName,
                                  },
                                })
                              }
                            >
                              <Tooltip title="Place of Posting" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          {/* <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>

                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Button
                              variant="contained"
                              size="small"
                              // className="download-button"
                              color="dark"
                            >
                              <Tooltip title="Click here" arrow>
                                <OpenInNewIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </Tooltip>
                            </Button>
                          </StyledTableCell> */}
                        </StyledTableRow>
                      ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={9}>
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      )}

      {showEmpTable && (
        <Card
          className="shadow-lg rounded"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <Card.Header className="text-center p-3">
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: "serif",
                fontWeight: "bold",
                color: "#0a1f83",
              }}
            >
              Employee Service's (Outsource)
            </Typography>
          </Card.Header>

          <Card.Body>
            <TableContainer component={Paper}>
              <Table ref={empTableRef}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Designation</StyledTableCell>
                    <StyledTableCell>Punishment</StyledTableCell>
                    <StyledTableCell>View Punishment</StyledTableCell>
                    <StyledTableCell>Complaint</StyledTableCell>
                    <StyledTableCell>View Complaint</StyledTableCell>
                    <StyledTableCell>Upload Certificate</StyledTableCell>
                    <StyledTableCell>Download Certificate</StyledTableCell>
                    <StyledTableCell>Delete Certificate</StyledTableCell>
                    <StyledTableCell>Employee Training</StyledTableCell>
                    <StyledTableCell>View Training</StyledTableCell>
                    <StyledTableCell>Place of Postings</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInEmpTable ? (
                    <StyledTableRow>
                      <StyledTableCell>1</StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.empCode}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.fullName}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.designation}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "punishmentModal",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="Punishment" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "viewPunishmentModal",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="View Punishment" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen("complaintModal", dataInEmpTable.empCode)
                          }
                        >
                          <Tooltip title="Complaint" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "viewComplaintModal",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="View Complaint" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "uploadCertificateModal",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="Upload Certificate" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "downloadCertificateModal",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="Download Certificate" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "deleteCertificateModal",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="Delete Certificate" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() => navigate("/outsourceEmployeeTraining")}
                        >
                          <Tooltip title="Employee Training" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            handleOpen(
                              "viewEmployeeTraining",
                              dataInEmpTable.empCode
                            )
                          }
                        >
                          <Tooltip title="Employee Training" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Button
                          variant="contained"
                          size="small"
                          // className="download-button"
                          color="dark"
                          onClick={() =>
                            navigate("/outsourceEmployeePosting", {
                              state: {
                                empCode: dataInEmpTable.empCode,
                                fullName: dataInEmpTable.fullName,
                              },
                            })
                          }
                        >
                          <Tooltip title="Place of Posting" arrow>
                            <OpenInNewIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={9}>
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      )}

      {/* Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>

      {/* Conditional Rendering of Modals */}
      {modalState.type === "punishmentModal" && (
        <PunishmentModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}
      {modalState.type === "viewPunishmentModal" && (
        <ViewPunishmentModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}
      {modalState.type === "complaintModal" && (
        <ComplaintModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}

      {modalState.type === "viewComplaintModal" && (
        <ViewComplaintModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}

      {modalState.type === "uploadCertificateModal" && (
        <UploadCertificateModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}

      {modalState.type === "downloadCertificateModal" && (
        <DownloadCertificateModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}

      {modalState.type === "deleteCertificateModal" && (
        <DeleteCertificateModal
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}

      {modalState.type === "viewEmployeeTraining" && (
        <EmployeeTrainingView
          open={modalState.open}
          onClose={handleClose}
          empCode={modalState.empCode}
        />
      )}
    </>
  );
}

export default OutsourceEmployeeServices;
