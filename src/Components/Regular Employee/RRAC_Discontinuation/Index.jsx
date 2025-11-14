import React, { useState, useEffect, useRef, useMemo } from "react";
import Card from "react-bootstrap/Card";
import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
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
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

import {
  deleteDiscontinuationRecords,
  empWalletAmount,
  getAllVendors,
  getCircle,
  getDC,
  getDiscontinuationRecords,
  getDivision,
  getIncentiveHeads,
  getRegion,
  getSubDivision,
  getVendorArmedForce,
  maxAmountByDesignation,
  requestRRAC,
  updateDiscontinuationRecords,
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

function RRAC_Discontinuation() {
  const sessionRegion = sessionStorage.getItem("regionId");
  const sessionCircle = sessionStorage.getItem("circleId");
  const sessionDivision = sessionStorage.getItem("divisionId");
  const sessionSubdivision = sessionStorage.getItem("subdivisionId");
  const sessionDc = sessionStorage.getItem("dcId");
  const designationName = sessionStorage.getItem("designationName");
  const departmentName = sessionStorage.getItem("departmentName");
  const sessionEmpCode = sessionStorage.getItem("empCode");

  const departmentId = sessionStorage.getItem("departmentId");
  const designationId = sessionStorage.getItem("designationId");

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [dcs, setDCs] = useState([]);
  const [subStations, setSubStations] = useState([]);
  const [errors, setErrors] = useState({});

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCircle, setSelectedCircle] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubDivision, setSelectedSubDivision] = useState("");
  const [selectedDC, setSelectedDC] = useState("");
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [discontInTable, setDiscontInTable] = useState([]);
  const tableRef = useRef(null);

  // Load Regions
  useEffect(() => {
    (async () => {
      try {
        setOpenBackdrop(true);
        const response = await getDiscontinuationRecords();
        console.log(response);
        if (response.data.code == "200") {
          setOpenBackdrop(false);
          setDiscontInTable(response.data.list || []);
          setTimeout(() => {
            tableRef.current?.focus();
          }, 100);
        } else {
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        setOpenBackdrop(false);
      }
    })();
  }, []);

  const deletRecords = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteDiscontinuationRecords(id);
      if (response?.data?.code === "200") {
        window.location.reload();
      } else {
        alert(response?.data?.message || "Failed to delete records");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Load Regions
  useEffect(() => {
    (async () => {
      try {
        const response = await getRegion();
        setRegions(response.data.list || []);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    })();
  }, []);

  // Fetch Circles when Region changes
  useEffect(() => {
    if (!selectedRegion) return;
    (async () => {
      try {
        const res = await getCircle(selectedRegion);
        setCircles(res.data.list || []);
      } catch (error) {
        console.error("Error fetching circles:", error);
      }
    })();
  }, [selectedRegion]);

  // Fetch Divisions when Circle changes
  useEffect(() => {
    if (!selectedCircle) return;
    (async () => {
      try {
        const res = await getDivision(selectedCircle);
        setDivisions(res.data.list || []);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    })();
  }, [selectedCircle]);

  // Fetch SubDivisions when Division changes
  useEffect(() => {
    if (!selectedDivision) return;
    (async () => {
      try {
        const res = await getSubDivision(selectedDivision);
        setSubDivisions(res.data.list || []);
      } catch (error) {
        console.error("Error fetching sub divisions:", error);
      }
    })();
  }, [selectedDivision]);

  // Fetch DCs when SubDivision changes
  useEffect(() => {
    if (!selectedSubDivision) return;
    (async () => {
      try {
        const res = await getDC(selectedSubDivision);
        setDCs(res.data.list || []);
      } catch (error) {
        console.error("Error fetching DCs:", error);
      }
    })();
  }, [selectedSubDivision]);

  // inside your component
  const regionRef = useRef(null);

  const handleSubmit = async () => {
    // Validation for region
    if (!selectedRegion) {
      alert("Region is required");
      if (regionRef.current) {
        regionRef.current.focus();
      }
      return;
    }

    setOpenBackdrop(true);
    const payload = {
      regionId: selectedRegion,
      circleId: selectedCircle,
      divisionId: selectedDivision,
      subdivisionId: selectedSubDivision,
      dcId: selectedDC,
      createdBy: sessionStorage.getItem("empCode"),
    };

    // console.log("Payload:", payload);

    try {
      const response = await updateDiscontinuationRecords(payload);
      //   console.log("API Response:", response);

      if (response?.data?.code === "200") {
        alert("Records Updated Successfully");
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response?.data?.message || "Failed to update records");
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error("Error updating records:", error);
      alert("Something went wrong while updating records.");
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
            Discontinuation of Delegation of Revenue Realisation
          </Typography>
        </Card.Header>
        <Card.Body>
          {/* Card 1 */}
          <Card>
            <Card.Header className="text-center">
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontFamily: "serif",
                  fontWeight: "bold",
                  color: "#0a1f83",
                }}
              >
                Submit Discontinuation of Delegation
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={2} md={5} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>Region </Card.Header>
                    <Card.Body>
                      <Form.Select
                        ref={regionRef}
                        value={selectedRegion}
                        id="selectedRegion"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedRegion(value);
                          setSelectedCircle("");
                          setCircles([]);
                          setSelectedDivision("");
                          setDivisions([]);
                          setSelectedSubDivision("");
                          setSubDivisions([]);
                          setSelectedDC("");
                          setDCs([]);
                        }}
                        // disabled={disabledLevels.region}
                      >
                        <option disabled value="">
                          -- select Region --
                        </option>
                        {regions.map((r) => (
                          <option key={r.regionId} value={r.regionId}>
                            {r.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Circle </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedCircle}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCircle(value);

                          setSelectedDivision("");
                          setDivisions([]);
                          setSelectedSubDivision("");
                          setSubDivisions([]);
                          setSelectedDC("");
                          setDCs([]);
                        }}
                        disabled={!selectedRegion}
                      >
                        <option disabled value="">
                          -- select Circle --
                        </option>
                        {circles.map((c) => (
                          <option key={c.circleId} value={c.circleId}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Division </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDivision}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDivision(value);
                          setSelectedSubDivision("");
                          setSubDivisions([]);
                          setSelectedDC("");
                          setDCs([]);
                        }}
                        disabled={!selectedCircle}
                      >
                        <option disabled value="">
                          -- select Division --
                        </option>
                        {divisions.map((d) => (
                          <option key={d.divisionId} value={d.divisionId}>
                            {d.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Sub Division </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubDivision}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedSubDivision(value);
                          setSelectedDC("");
                          setDCs([]);
                        }}
                        disabled={!selectedDivision}
                      >
                        <option disabled value="">
                          -- select Sub Division --
                        </option>
                        {subDivisions.map((s) => (
                          <option key={s.subdivisionId} value={s.subdivisionId}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Distribution Center </Card.Header>
                    <Card.Body>
                      <Form.Select
                        id="dc-select"
                        value={selectedDC}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDC(value);
                        }}
                        disabled={!selectedSubDivision}
                      >
                        <option disabled value="">
                          -- select DC --
                        </option>
                        {dcs.map((dc) => (
                          <option key={dc.dcId} value={dc.dcId}>
                            {dc.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button className="blue-button" onClick={handleSubmit}>
                Save
              </Button>
            </Card.Footer>
          </Card>

          <Card className="mt-3">
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
                Discontinuation of Delegation Records
              </Typography>
            </Card.Header>
            <Card.Body>
              <TableContainer component={Paper} sx={{ marginTop: "15px" }}>
                <Table ref={tableRef} tabIndex={-1}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Region</StyledTableCell>
                      <StyledTableCell>Circle</StyledTableCell>
                      <StyledTableCell>Division</StyledTableCell>
                      <StyledTableCell>Subdivision</StyledTableCell>
                      <StyledTableCell>Distribution Center</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {discontInTable && discontInTable.length > 0 ? (
                      discontInTable.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {item.regionId || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.circleId || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.divisionId || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.subDivisionId || "-"}
                          </StyledTableCell>
                          <StyledTableCell>{item.dcId || "-"}</StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title="Delete Record" arrow>
                              <Button
                                color="dark"
                                variant="contained"
                                onClick={() => deletRecords(item.id)}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </Button>
                            </Tooltip>
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

export default RRAC_Discontinuation;
