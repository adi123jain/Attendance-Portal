import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Form } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Modal from "react-bootstrap/Modal";

import {
  Typography,
  Tooltip,
  Button,
  Backdrop,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Paper,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { PropagateLoader } from "react-spinners";
import {
  getEmpMedicalClaim,
  updateFamilyInfoMedical,
} from "../../../Services/Auth";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../Constants/TableStyles/Index";

function MedicalHealthInsuranceView() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [claimedData, setClaimedData] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setOpenBackdrop(true);
        const response = await getEmpMedicalClaim();
        console.log(response);
        if (response.data.code === "200") {
          setClaimedData(response.data.list[0]);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setOpenBackdrop(false);
      }
    };
    fetchDetails();
  }, []);

  const [modalShow, setModalShow] = useState(false);
  const modalClose = () => setModalShow(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form states
  const [relation, setRelation] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [status, setStatus] = useState("");
  const [dependent, setDependent] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [memberId, setMemberId] = useState("");

  const handleView = (item) => {
    setRelation(item.relation || "");
    setFullName(item.fullName || "");
    setDob(item.dateOfBirth || "");
    setGender(item.gender || "");
    setBloodGroup(item.bloodGroup || "");
    setStatus(item.status || "");
    setDependent(item.isDependent || "");
    setAadhaar(item.adhaarNumber || "");
    setMemberId(item.id || "");

    setModalShow(true);
  };
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async () => {
    setErrorMsg("");

    // Check required fields
    if (
      !fullName ||
      !dob ||
      !gender ||
      !bloodGroup ||
      !status ||
      !dependent ||
      !aadhaar
    ) {
      setErrorMsg("Please fill all the required fields.");
      return;
    }

    //  Aadhaar validation (12 digits only)
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(aadhaar)) {
      setErrorMsg("Aadhaar number must be exactly 12 digits.");
      return;
    }

    // If valid → prepare object

    const payload = {
      id: memberId,
      relation: relation,
      fullName: fullName,
      dateOfBirth: dob,
      status: status,
      isDependent: dependent,
      gender: gender,
      bloodGroup: bloodGroup,
      adhaarNumber: aadhaar,
      empCode: sessionStorage.getItem("empCode"),
    };

    // console.log("Updated data:", payload);
    setOpenBackdrop(true);
    try {
      const response = await updateFamilyInfoMedical(payload);

      if (response.data.code === "200" && response.data.message === "Success") {
        alert("Family Detailed Updated Successfully");
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setOpenBackdrop(false);
      setModalShow(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded mt-4">
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
            MP Power Company Cashless Health Scheme
          </Typography>
        </Card.Header>

        <Card.Body>
          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2">
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
                Employee Information
              </Typography>
            </Card.Header>

            <Card.Body>
              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Employee Code
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0a1f83" }}
                  >
                    {claimedData?.empCode || "-"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0a1f83" }}
                  >
                    {claimedData?.empName || "-"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Designation
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0a1f83" }}
                  >
                    {claimedData?.designationName || "-"}
                  </Typography>
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Department
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0a1f83" }}
                  >
                    {claimedData?.departmentName || "-"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Option
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0a1f83" }}
                  >
                    {claimedData?.optionOpt || "-"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Blood Group
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#0a1f83" }}
                  >
                    {claimedData?.bloodGroup || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Header className="p-2">
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
                Family Information
              </Typography>
            </Card.Header>
            <Card.Body>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Relation</StyledTableCell>
                      <StyledTableCell>Full Name</StyledTableCell>
                      <StyledTableCell>DOB</StyledTableCell>
                      <StyledTableCell>Gender</StyledTableCell>
                      <StyledTableCell>Blood Group </StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Dependent</StyledTableCell>
                      <StyledTableCell>Adhaar Number</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {claimedData.familyDetails &&
                    claimedData.familyDetails.length > 0 ? (
                      claimedData.familyDetails.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>

                          <StyledTableCell>
                            {item.relation || "-"}
                          </StyledTableCell>
                          <StyledTableCell>{item.fullName}</StyledTableCell>
                          <StyledTableCell>
                            {item.dateOfBirth || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.gender || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.bloodGroup || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.status || "-"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.isDependent || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            {item.adhaarNumber || "-"}
                          </StyledTableCell>

                          <StyledTableCell>
                            <Tooltip title="View" arrow placement="top">
                              <Button
                                variant="contained"
                                color="dark"
                                onClick={() => handleView(item)}
                              >
                                <VisibilityIcon
                                  fontSize="small"
                                  color="success"
                                />
                              </Button>
                            </Tooltip>
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
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button
            className="cancel-button"
            variant="outlined"
            component={Link}
            to="/"
          >
            Close
          </Button>
        </Card.Footer>
      </Card>

      <Modal
        show={modalShow}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h6"
              sx={{ color: "#0a1f83", fontFamily: "serif", fontWeight: "bold" }}
            >
              Update Family Member
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Relation</Form.Label>
                  <Form.Control type="text" value={relation} disabled />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>
                      -- select Gender --
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="" disabled>
                      -- select Blood Group --
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Current Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="" disabled>
                      -- select --
                    </option>
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dependent</Form.Label>
                  <Form.Select
                    value={dependent}
                    onChange={(e) => setDependent(e.target.value)}
                  >
                    <option value="" disabled>
                      -- select --
                    </option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Aadhaar Number</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>

          {errorMsg && (
            <div
              style={{
                backgroundColor: "#ffd8d8",
                color: "#b30000",
                padding: "8px 12px",
                borderRadius: "5px",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {errorMsg}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="cancel-button"
            variant="outlined"
            onClick={modalClose}
          >
            Close
          </Button>
          &nbsp; &nbsp;
          <Button
            className="green-button"
            variant="outlined"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default MedicalHealthInsuranceView;
