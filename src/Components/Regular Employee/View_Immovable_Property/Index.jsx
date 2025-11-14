import React, { useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { viewImmProperty } from "../../../Services/Auth";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { PropagateLoader } from "react-spinners";
import { motion } from "framer-motion";
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
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
} from "@mui/material";
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

// const StyledTableRow = styled(TableRow)(() => ({
//   "&:nth-of-type(odd)": { backgroundColor: oddRowBackground },
//   "&:nth-of-type(even)": { backgroundColor: evenRowBackground },
//   "&:hover": { backgroundColor: hoverBackground },
// }));

const years = [2022, 2023, 2024, 2025, 2026];

const fieldCard = (label, value, index) => (
  <Grid item xs={12} sm={6} md={3} key={index}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 3,
          textAlign: "center",
          transition: "all 0.3s ease",
          background: "linear-gradient(135deg,#f8fbff,#ffffff)",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: "#3949ab", mb: 1 }}
        >
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: "#333" }}>
          {value || "—"}
        </Typography>
      </Paper>
    </motion.div>
  </Grid>
);

function ImmovablePropertyView() {
  const [immovableData, setImmovableData] = useState([]);
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [open, setOpen] = useState(false);

  const empCode = sessionStorage.getItem("empCode");

  const viewImmovable = async () => {
    try {
      setOpenBackdrop(true);
      const response = await viewImmProperty(selectedYear);
      console.log(response);
      if (response?.data.code == "200") {
        setImmovableData(response.data.list);
        setOpenBackdrop(false);
      } else {
        setImmovableData([]);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.error(err);
      setImmovableData([]);
      setOpenBackdrop(false);
    }
  };

  const [selectedRow, setSelectedRow] = useState(null);

  const handlePreview = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  return (
    <>
      <Card className="shadow">
        <Card.Header className="text-center text-primary p-3">
          <Typography
            variant="h4"
            sx={{ fontFamily: "serif", fontWeight: "bold", color: "#0a1f83" }}
          >
            Immovable Property View
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row className="g-3 mt-3 mb-3">
            {/* Employee Code */}
            <Col xs={12} md={4}>
              <Card className="h-100">
                <Card.Header>Employee Code</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    value={empCode || ""}
                    disabled
                    readOnly
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Year */}
            <Col xs={12} md={4}>
              <Card className="h-100">
                <Card.Header>Year</Card.Header>
                <Card.Body>
                  <Form.Select
                    id="year"
                    aria-label="Select Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      -- Select Year --
                    </option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            {/* View Button */}
            <Col xs={12} md={4}>
              <Card className="h-100">
                <Card.Header>Details</Card.Header>
                <Card.Body className="d-flex align-items-center">
                  <Button className="blue-button w-100" onClick={viewImmovable}>
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Data Table */}
          <TableContainer component={Paper}>
            <Table ref={tableRef} tabIndex={-1}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Designation</StyledTableCell>
                  <StyledTableCell>Preview</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {immovableData && immovableData.length > 0 ? (
                  immovableData.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.empCode}</StyledTableCell>
                      <StyledTableCell>{item.empName}</StyledTableCell>
                      <StyledTableCell>{item.designation}</StyledTableCell>

                      <StyledTableCell>
                        <Tooltip title="Preview" arrow>
                          <Button
                            variant="contained"
                            color="dark"
                            //sx={{ backgroundColor: "#37474F", color: "#fff" }}
                            onClick={() => handlePreview(item)}
                          >
                            <VisibilityIcon fontSize="small" />
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

        <Card.Footer className="text-center p-3"></Card.Footer>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(135deg, #f9f9ff 0%, #ffffff 100%)",
            boxShadow: "0px 15px 45px rgba(0,0,0,0.25)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            textAlign: "center",
            bgcolor: "#e2e3e5",
            py: 2,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: "serif", fontWeight: "bold", color: "#0a1f83" }}
          >
            Property Details Preview
          </Typography>
        </DialogTitle>

        {/* Body */}
        <DialogContent
          dividers
          sx={{
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            maxHeight: "80vh",
          }}
        >
          {selectedRow && (
            <Grid container spacing={3}>
              {fieldCard("Employee Code", selectedRow.empCode, 0)}
              {fieldCard("Employee Name", selectedRow.empName, 1)}
              {fieldCard("Designation", selectedRow.designation, 2)}
              {fieldCard("Year", selectedRow.year, 3)}
              {fieldCard("Acquisition Date", selectedRow.acquisitionDate, 4)}
              {fieldCard("Acquisition Mode", selectedRow.acquisitionMode, 5)}
              {fieldCard("From Whom Acquired", selectedRow.fromWhomAcquired, 6)}
              {fieldCard("Ownership Status", selectedRow.ownershipStatus, 7)}
              {fieldCard(
                "Relation With Board",
                selectedRow.relationWithBoard,
                8
              )}
              {fieldCard(
                "Private Business Details",
                selectedRow.privateBusinessDetails,
                9
              )}
              {fieldCard("Remarks", selectedRow.remarks, 10)}
              {fieldCard(
                "Agricultural Location",
                selectedRow.agriculturalLocation,
                11
              )}
              {fieldCard(
                "Agricultural Size Area",
                selectedRow.agriculturalSizeArea,
                12
              )}
              {fieldCard(
                "Agricultural Present Value",
                selectedRow.agriculturalPresentValue,
                13
              )}
              {fieldCard("Housing Location", selectedRow.housingLocation, 14)}
              {fieldCard(
                "Housing Size Build-Up Area",
                selectedRow.housingSizeBuildUpArea,
                15
              )}
              {fieldCard(
                "Housing Present Value",
                selectedRow.housingPresentValue,
                16
              )}
              {fieldCard(
                "Residential Location",
                selectedRow.residentialLocation,
                17
              )}
              {fieldCard(
                "Residential Size Area",
                selectedRow.residentialSizeArea,
                18
              )}
              {fieldCard(
                "Residential Present Value",
                selectedRow.residentialPresentValue,
                19
              )}
              {fieldCard("Shop Location", selectedRow.shopLocation, 20)}
              {fieldCard(
                "Shop Size Build-Up Area",
                selectedRow.shopSizeBuildUpArea,
                21
              )}
              {fieldCard(
                "Shop Present Value",
                selectedRow.shopPresentValue,
                22
              )}
              {fieldCard("District", selectedRow.district, 23)}
              {fieldCard("Sub-District", selectedRow.subDistrict, 24)}
              {fieldCard("Taluka/Village", selectedRow.talukaVillage, 25)}
              {fieldCard("Annual Income", selectedRow.annualIncome, 26)}
              {fieldCard("GPF / PRAN / EPF No", selectedRow.gpfPranEpfNo, 27)}
              {/* {fieldCard("Is Active", selectedRow.isActive ? "Yes" : "No", 28)}
              {fieldCard("Created On", selectedRow.created, 29)}
              {fieldCard("Created By", selectedRow.createdBy, 30)}
              {fieldCard("Record ID", selectedRow.id, 31)} */}
            </Grid>
          )}
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              onClick={handleClose}
              variant="contained"
              className="cancel-button"
            >
              Close
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ImmovablePropertyView;
