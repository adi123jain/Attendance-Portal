import React, { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  getBlackListedEmp,
  getCircle,
  getEmpMasterData,
  getRegion,
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
  Backdrop,
} from "@mui/material";
import { PropagateLoader } from "react-spinners";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
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

function ViewBlacklistedEmployee() {
  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCircle, setSelectedCircle] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getRegion();
        setRegions(response?.data?.list || []);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, []);

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCircle("");
    try {
      const circleResponse = await getCircle(regionId);
      setCircles(circleResponse?.data?.list || []);
    } catch (error) {
      console.error("Error fetching circles:", error);
      setCircles([]);
    }
  };

  const [blacklistedEmployees, setBlacklistedEmployees] = useState([]);
  const [showTableCard, setShowTableCard] = useState(false);

  useEffect(() => {
    if (showTableCard && blacklistedEmployees.length > 0 && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTableCard, blacklistedEmployees]);

  const viewBlacklistedEmp = async () => {
    const validationErrors = {};
    if (!selectedRegion) validationErrors.region = "Region is required";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const circle = selectedCircle || 0;

    try {
      setLoading(true);
      const response = await getBlackListedEmp(selectedRegion, circle);
      if (response.data.code == "200" && response.data.message == "Success") {
        const list = response?.data?.list || [];
        console.log("123", list);

        setBlacklistedEmployees(list);
        setShowTableCard(list.length > 0);

        // if (list.length > 0 && tableRef.current) {
        //   setTimeout(() => {
        //     tableRef.current.scrollIntoView({ behavior: "smooth" });
        //   }, 300);
        // } else {
        //   alert("No employee data found.");
        // }
      } else {
        alert(response.data.message);
        setShowTableCard(false);
      }
    } catch (error) {
      console.error("Error fetching blacklisted employees:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow">
        <Card.Header className="text-center text-primary p-3">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: "serif",
              fontWeight: "bold",
              color: "#0a1f83",
            }}
          >
            View Blacklisted Employee Information
          </Typography>
        </Card.Header>

        <Card.Body>
          {/* Row 1 */}
          <div className="row row-cols-1 row-cols-md-3 g-3 mt-4 mb-4">
            <div className="col">
              <Card>
                <Card.Header>*Region</Card.Header>
                <Card.Body>
                  <Form.Select
                    aria-label="Select Region"
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    isInvalid={!!errors.region}
                  >
                    <option disabled value="">
                      -- select Region --
                    </option>
                    {regions.map(({ regionId, name }) => (
                      <option key={regionId} value={regionId}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.region && (
                    <div className="text-danger"> &nbsp;*{errors.region}</div>
                  )}
                </Card.Body>
              </Card>
            </div>

            <div className="col">
              <Card>
                <Card.Header>Circle</Card.Header>
                <Card.Body>
                  <Form.Select
                    aria-label="Select Circle"
                    value={selectedCircle}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                  >
                    <option value="" disabled>
                      -- select Circle --
                    </option>
                    {circles.map(({ circleId, name }) => (
                      <option key={circleId} value={circleId}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </div>

            <div className="col">
              <Card>
                <Card.Header>Click button to see records</Card.Header>
                <Card.Body>
                  <button
                    className="blue-button p-1 w-100"
                    onClick={viewBlacklistedEmp}
                  >
                    Search Records
                  </button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-center"></Card.Footer>
      </Card>

      {showTableCard && (
        <Card className="mt-4" ref={tableRef}>
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
              Blacklisted Records
            </Typography>
            <TextField
              label="Search by Employee Name or Adhaar Number"
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
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Adhaar Number</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Remark</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {blacklistedEmployees.length > 0 ? (
                    blacklistedEmployees
                      .filter((item) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          String(item.aadharNo || "")
                            .toLowerCase()
                            .includes(query) ||
                          String(item.fullName || "")
                            .toLowerCase()
                            .includes(query)
                        );
                      })
                      .map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{item.fullName}</StyledTableCell>
                          <StyledTableCell>{item.aadharNo}</StyledTableCell>
                          <StyledTableCell>
                            {item.dateOfBlacklist}
                          </StyledTableCell>
                          <StyledTableCell>{item.remarks}</StyledTableCell>
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default ViewBlacklistedEmployee;
