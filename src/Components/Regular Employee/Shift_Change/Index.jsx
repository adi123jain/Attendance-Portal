import React, { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import {
  getEmpShiftByCode,
  getEmpShiftByRo,
  getShifts,
  updateEmpShift,
} from "../../../Services/Auth";

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
  Stack,
  Box,
  Backdrop,
} from "@mui/material";
import Modal from "react-bootstrap/Modal";

import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Divider } from "@mui/material";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ImageIcon from "@mui/icons-material/Image";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
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

function ShiftChange() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const tableRef = useRef();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const getEmpByRO = async () => {
      setOpenBackdrop(true);
      try {
        const response = await getEmpShiftByRo();
        console.log(response);
        if (response.data.code == "200") {
          setDetails(response.data.list);
          setOpenBackdrop(false);
        } else {
          alert(response.data.message);
          setOpenBackdrop(false);
        }
      } catch (error) {
        console.log("Error", error);
        setOpenBackdrop(false);
      } finally {
        setOpenBackdrop(false);
      }
    };

    getEmpByRO();
  }, []);

  const [shiftData, setShiftData] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");

  useEffect(() => {
    const fetchAllShifts = async () => {
      try {
        const response = await getShifts();
        console.log(response);
        setShiftData(response?.data?.list || []);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };
    fetchAllShifts();
  }, []);

  const [modalShow, setModalShow] = useState(false);
  // const [openBackdrop, setOpenBackdrop] = useState(false);

  const modalClose = () => setModalShow(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");

  const modalOpen = async (items) => {
    setEmployeeName(items.fullName);
    setEmployeeCode(items.empCode);
    setModalShow(true);
    setOpenBackdrop(true);

    try {
      const response = await getEmpShiftByCode(items.empCode);
      console.log("empResponse", response.data.list[0]);

      if (
        response?.data.code === "200" &&
        response?.data.message === "Success"
      ) {
        setSelectedShift(response.data.list[0].id);
        setOpenBackdrop(false);
      } else {
        alert(response?.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log("Error", error);
      setOpenBackdrop(false);
    }
  };

  const updateEmployeeShift = async () => {
    setOpenBackdrop(true);

    const payload = {
      empCode: employeeCode,
      shiftId: selectedShift,
      roEmpCode: sessionStorage.getItem("empCode"),
    };

    try {
      const response = await updateEmpShift(payload);
      console.log("response", response.data.list[0]);

      if (
        response?.data.code === "200" &&
        response?.data.message === "Success"
      ) {
        alert("Shift Updated Successfully !!");
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response?.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log("Error", error);
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          {/* Back button on left */}
          <Tooltip title="Back" arrow>
            <Button className="position-absolute start-2">
              <Link to="/">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>

          {/* Centered Title */}
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
            Employee's Shift Change
          </Typography>
        </Card.Header>
        <Card.Body>
          <TableContainer component={Paper}>
            <Table ref={tableRef} tabIndex={-1}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S. No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Designation</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Employee Type </StyledTableCell>
                  <StyledTableCell>Action </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {details && details.length > 0 ? (
                  details.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.empCode}</StyledTableCell>
                      <StyledTableCell>{item.fullName}</StyledTableCell>
                      <StyledTableCell>{item.designation}</StyledTableCell>
                      <StyledTableCell>{item.department}</StyledTableCell>
                      <StyledTableCell>{item.empType}</StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="View Images" arrow>
                          <Button
                            // className="green-button"
                            variant="contained"
                            color="dark"
                            onClick={() => modalOpen(item)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={7}>
                      Data Not Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer className="text-center mt-3"></Card.Footer>
      </Card>

      <Modal
        show={modalShow}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h6"
              sx={{
                color: "#0a1f83",
                fontFamily: "serif",
                fontWeight: "bold",
              }}
            >
              Employee Shift Update
              <br /> {employeeName}
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Shift Select */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", mb: 1, color: "#0a1f83" }}
            >
              Select Shift
            </Typography>
            <Form.Select
              aria-label="Select Shift"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option disabled value="">
                -- select Shift --
              </option>
              {shiftData.map((item, index) => (
                <option key={index} value={item.shiftId}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Box>
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
            onClick={updateEmployeeShift}
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

export default ShiftChange;
