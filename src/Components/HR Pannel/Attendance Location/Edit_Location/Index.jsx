import React, { useRef, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import SearchUtils from "../../../../Constants/Search_Utils/Index";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
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

// Styled Components
// const headerBackground = "linear-gradient(to right, #1E88E5, #42A5F5)";
// const oddRowBackground = "#E3F2FD";
// const evenRowBackground = "#BBDEFB";
// const hoverBackground = "#90CAF9";
import { PropagateLoader } from "react-spinners";
import { viewAttendanceLocation } from "../../../../Services/Auth";
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
function EditLocation() {
  const regionRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [searchValues, setSearchValues] = useState({
    region: "",
    circle: "",
    division: "",
    subDivision: "",
    dc: "",
    subStation: "",
  });

  const [showTable, setShowTable] = useState(false);
  const [dataInTable, setDataInTable] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    if (showTable && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTable, dataInTable]);
  const validate = () => {
    const newErrors = {};
    if (!searchValues.region) newErrors.region = "Region is Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const viewAttendaceLocation = async () => {
    if (!validate()) {
      if (!searchValues.region && regionRef.current) {
        regionRef.current.focus();
      }
      return;
    }
    setOpenBackdrop(true);
    // console.log(searchValues);
    const payload = {
      regionId: searchValues.region,
      circleId: searchValues.circle,
      divisionId: searchValues.division,
      subDivisionId: searchValues.subDivision,
      dcId: searchValues.dc,
      substationId: searchValues.subStation,
    };
    try {
      const response = await viewAttendanceLocation(payload);
      // console.log(response);
      if (response?.data.code == "200" && response?.data.message == "Success") {
        setDataInTable(response.data.list);
        setShowTable(true);
        setOpenBackdrop(false);
      } else {
        alert(response?.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log(error);
      setOpenBackdrop(false);
    }
  };
  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="d-flex align-items-center justify-content-between  p-3">
          <Link to="/createLocation" className="text-success">
            <Tooltip title="Create New Location" arrow placement="top">
              <AddLocationAltIcon fontSize="large" />
            </Tooltip>
          </Link>
          <div className="flex-grow-1 text-center">
            <Typography
              variant="h4"
              sx={{
                mb: 0,
                fontFamily: "serif",
                fontWeight: "bold",
                color: "#0a1f83",
              }}
            >
              Attendance Locations
            </Typography>
          </div>
        </Card.Header>
        <Card.Body>
          <SearchUtils
            values={searchValues}
            setValues={setSearchValues}
            errors={errors}
            refs={{ region: regionRef }}
          />

          <div className="text-center mt-4 mb-3">
            <Button
              onClick={viewAttendaceLocation}
              variant="outlined"
              className="blue-button"
            >
              Search Location
            </Button>
          </div>
          <hr />
        </Card.Body>
      </Card>

      {showTable && (
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
              Locations
            </Typography>
          </Card.Header>

          <Card.Body>
            <TableContainer component={Paper}>
              <Table ref={tableRef}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Location Code</StyledTableCell>
                    <StyledTableCell> Location Name</StyledTableCell>
                    <StyledTableCell> Region</StyledTableCell>
                    <StyledTableCell>Circle </StyledTableCell>
                    <StyledTableCell>Division </StyledTableCell>
                    <StyledTableCell>Sub- Division </StyledTableCell>
                    <StyledTableCell> DC</StyledTableCell>
                    <StyledTableCell> Substation</StyledTableCell>
                    <StyledTableCell>District </StyledTableCell>
                    <StyledTableCell>Lattitude </StyledTableCell>
                    <StyledTableCell>Longitude </StyledTableCell>
                    <StyledTableCell>Updated By </StyledTableCell>
                    <StyledTableCell>Status </StyledTableCell>
                    <StyledTableCell>Edit Location </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInTable && dataInTable.length > 0 ? (
                    dataInTable.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {item.locationCode || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.locationName || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.regionName || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.circleName || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.divisionName || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.subdivisionName || "-"}
                        </StyledTableCell>
                        <StyledTableCell>{item.dcName || "-"}</StyledTableCell>
                        <StyledTableCell>
                          {item.substationName || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.districtId || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.latitude || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.longitude || "-"}
                        </StyledTableCell>

                        <StyledTableCell>
                          {item.updateBy || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.isActive ? "Active" : "Inactive"}
                        </StyledTableCell>

                        <StyledTableCell>
                          <Button
                            size="small"
                            component={Link}
                            to="/updateLocation"
                            state={{ item }}
                            variant="outlined"
                            className="green-button"
                          >
                            Edit
                          </Button>
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
        </Card>
      )}
      {/* Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default EditLocation;
