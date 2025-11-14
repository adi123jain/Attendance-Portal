import React, { useRef, useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";
import {
  getEmployeeByEmpCode,
  getEmployeeByLevel,
} from "../../../Services/Auth";
import SearchUtils from "../../../Constants/Search_Utils/Index";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import "../../../Constants/Style/styles.css";
import EditIcon from "@mui/icons-material/Edit";

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
  StyledTableCell,
  StyledTableRow,
} from "../../../Constants/TableStyles/Index";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

function EmployeeInformation() {
  const regionRef = useRef(null);
  const tableRef = useRef(null);
  const empTableRef = useRef(null);
  const navigate = useNavigate();
  const sessionEmpCode = sessionStorage.getItem("empCode");
  const isDisabled = sessionEmpCode === "89427825";
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
      const res = await getEmployeeByLevel(payload);
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
      const res = await getEmployeeByEmpCode(empCode);
      // console.log("Response:", res?.data);

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

  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="d-flex align-items-center justify-content-between p-3">
          <div className="flex-grow-1 text-center">
            <Typography
              variant="h4"
              sx={{
                color: "#0a1f83",
                mb: 2,
                fontFamily: "serif",
                fontWeight: "bold",
              }}
            >
              Employee Information
            </Typography>
          </div>

          <Link to="/addNewEmployee" className="text-danger">
            <Tooltip title="Add New Employee" arrow placement="top">
              <GroupAddIcon fontSize="large" />
            </Tooltip>
          </Link>
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

          <div className="row p-3">
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
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
              Employee Records
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
                    <StyledTableCell>Department</StyledTableCell>
                    <StyledTableCell>Employee Type</StyledTableCell>
                    <StyledTableCell>Edit Info</StyledTableCell>
                    <StyledTableCell>Place of Posting</StyledTableCell>
                    <StyledTableCell>Additional Charges</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInLevelTable && dataInLevelTable.length > 0 ? (
                    dataInLevelTable
                      .filter((item) => {
                        const sessionEmpCode =
                          sessionStorage.getItem("empCode");
                        if (sessionEmpCode === "89427825") {
                          return item.departmentId === 28;
                        }
                        return true; // Show all items for others
                      })
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
                          <StyledTableCell>{item.department}</StyledTableCell>
                          <StyledTableCell>{item.empType}</StyledTableCell>
                          <StyledTableCell>
                            <Tooltip
                              title="Edit Employee Info"
                              arrow
                              placement="top"
                            >
                              <Button
                                variant="contained"
                                size="small"
                                color="dark"
                                //className="green-button"
                                onClick={() =>
                                  navigate("/updateEmployeeInformation", {
                                    state: {
                                      empCode: item.empCode,
                                      fullName: item.fullName,
                                    },
                                  })
                                }
                              >
                                <EditIcon color="success" />
                              </Button>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip
                              title="Place of Posting"
                              arrow
                              placement="top"
                            >
                              <Button
                                variant="contained"
                                size="small"
                                color="dark"
                                onClick={() =>
                                  navigate("/employeePosting", {
                                    state: {
                                      empCode: item.empCode,
                                      fullName: item.fullName,
                                    },
                                  })
                                }
                              >
                                <AddLocationAltIcon color="success" />
                              </Button>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip
                              title="Additional Charges"
                              arrow
                              placement="top"
                            >
                              <Button
                                variant="contained"
                                size="small"
                                color="dark"
                                onClick={() =>
                                  navigate("/additionalCharges", {
                                    state: {
                                      empCode: item.empCode,
                                      fullName: item.fullName,
                                    },
                                  })
                                }
                              >
                                <AddToPhotosIcon color="success" />
                              </Button>
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={8}>
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
              Employee Records
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
                    <StyledTableCell>Department</StyledTableCell>
                    <StyledTableCell>Employee Type</StyledTableCell>
                    <StyledTableCell>Edit Info</StyledTableCell>
                    <StyledTableCell>Place of Posting</StyledTableCell>
                    <StyledTableCell>Additional Charges</StyledTableCell>
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
                        {dataInEmpTable.designation.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.department.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.employementType.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip
                          title="Edit Employee Info"
                          arrow
                          placement="top"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="dark"
                            // className="green-button"
                            onClick={() =>
                              navigate("/updateEmployeeInformation", {
                                state: {
                                  empCode: dataInEmpTable.empCode,
                                  fullName: dataInEmpTable.fullName,
                                },
                              })
                            }
                          >
                            <EditIcon color="success" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="Place of Posting" arrow placement="top">
                          <Button
                            variant="contained"
                            size="small"
                            color="dark"
                            onClick={() =>
                              navigate("/employeePosting", {
                                state: {
                                  empCode: dataInEmpTable.empCode,
                                  fullName: dataInEmpTable.fullName,
                                },
                              })
                            }
                          >
                            <AddLocationAltIcon color="success" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Tooltip
                          title="Additional Charges"
                          arrow
                          placement="top"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="dark"
                            onClick={() =>
                              navigate("/additionalCharges", {
                                state: {
                                  empCode: dataInEmpTable.empCode,
                                  fullName: dataInEmpTable.fullName,
                                },
                              })
                            }
                          >
                            <AddToPhotosIcon color="success" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={8}>
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
    </>
  );
}

export default EmployeeInformation;
