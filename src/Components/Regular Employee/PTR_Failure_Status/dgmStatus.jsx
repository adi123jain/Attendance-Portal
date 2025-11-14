import React, { useState, useEffect, useRef } from "react";
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
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

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
  getLineSatusByDgm,
  getPtrSatusByDgm,
  updateLineSatusByDgm,
  updatePtrSatusByDgm,
} from "../../../Services/Auth";
import {
  StyledTableRow,
  StyledTableCell,
} from "../../../Constants/TableStyles/Index";

// const headerBackground = "linear-gradient(135deg, #4F77AA, #1E3C72)";
// const oddRowBackground = "#F8FAFF";
// const evenRowBackground = "#EEF2F6";
// const hoverBackground = "#E3F2FD";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     background: headerBackground,
//     color: theme.palette.common.white,
//     fontWeight: 600,
//     textAlign: "center",
//     fontSize: "15px",
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
//     transition: "background-color 0.3s ease",
//   },
// }));

function DgmPtrStatus() {
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [records, setRecords] = useState([]);
  const sessionEmp = sessionStorage.getItem("empCode");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getPtrSatusByDgm(sessionEmp);
        console.log(response);
        if (response.data.code === "200") {
          setRecords(response.data.list);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching SSO status:", error);
      } finally {
        setOpenBackdrop(false);
      }
    };
    fetchDetails();
  }, [sessionEmp]);

  const [actionValues, setActionValues] = useState({});
  const [remarks, setRemarks] = useState({});
  const [errors, setErrors] = useState({});
  const selectRefs = useRef({});

  // Handle select change
  const handleSelectChange = (index, value) => {
    setActionValues((prev) => ({ ...prev, [index]: value }));
    setErrors((prev) => ({ ...prev, [`status-${index}`]: false }));
  };

  // Handle remark change
  const handleRemarkChange = (index, value) => {
    setRemarks((prev) => ({ ...prev, [index]: value }));
    setErrors((prev) => ({ ...prev, [`remark-${index}`]: false }));
  };

  // On update click
  const updateStatus = async (index, id) => {
    const selectedValue = actionValues[index];
    const remarkValue = remarks[index];

    //  Validation check
    let hasError = false;
    const newErrors = { ...errors };

    if (!selectedValue) {
      newErrors[`status-${index}`] = true;
      hasError = true;
      const ref = selectRefs.current[index];
      if (ref) ref.focus();
    }

    if (!remarkValue || remarkValue.trim() === "") {
      newErrors[`remark-${index}`] = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setOpenBackdrop(true);

      const payload = {
        id: id,
        dgmStatus: selectedValue,
        dgmRemark: remarkValue,
        dgmUpdatedBy: sessionEmp,
      };

      const response = await updatePtrSatusByDgm(payload);
      //console.log("Update API Response:", response);

      if (response?.data?.code === "200") {
        alert("Successfully Updated!");
        window.location.reload();
      } else {
        alert(response?.data?.message || "Update failed!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setOpenBackdrop(false);
    }
  };

  function downloadDocument(path) {
    if (!path) {
      alert("Document path is missing.");
      return;
    }

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/OnM/downPtrDoc/${encodeURIComponent(
      path
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

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
            Power Transformer Report Status by DGM
          </Typography>
        </Card.Header>

        <Card.Body className="px-4 pb-4">
          <Paper
            elevation={3}
            sx={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <TableContainer>
              <Table ref={tableRef} stickyHeader>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>JE Name</StyledTableCell>
                    <StyledTableCell>DGM Name</StyledTableCell>
                    <StyledTableCell>DGM Status</StyledTableCell>
                    <StyledTableCell>PTR Capacity</StyledTableCell>
                    <StyledTableCell>Date of Failure</StyledTableCell>
                    <StyledTableCell>DC Name</StyledTableCell>
                    <StyledTableCell>Substation Name</StyledTableCell>
                    <StyledTableCell>Document</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                    <StyledTableCell>Remark</StyledTableCell>
                    <StyledTableCell>Update Status</StyledTableCell>
                  </StyledTableRow>
                </TableHead>

                <TableBody>
                  {records && records.length > 0 ? (
                    records.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{item.jeName || "-"}</StyledTableCell>
                        <StyledTableCell>{item.dgmName || "-"}</StyledTableCell>
                        <StyledTableCell>
                          {item.dgmStatus || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.capacityOfPtr || "-"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.dateOfFailure || "-"}
                        </StyledTableCell>
                        <StyledTableCell>{item.dcName || "-"}</StyledTableCell>
                        <StyledTableCell>
                          {item.substationName || "-"}
                        </StyledTableCell>

                        {/* Document column can stay same */}
                        <StyledTableCell>
                          <Tooltip title="Download Document" arrow>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                background:
                                  "linear-gradient(90deg, #2E7D32, #66BB6A)", // green gradient
                                color: "#fff",
                                boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #1B5E20, #43A047)",
                                  boxShadow: "0px 3px 7px rgba(0,0,0,0.2)",
                                },
                              }}
                              onClick={() => downloadDocument(item.docPath)}
                            >
                              <CloudDownloadIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </StyledTableCell>

                        {/* Action Select */}
                        <StyledTableCell>
                          <FormControl
                            fullWidth
                            error={errors[`status-${index}`]}
                            variant="outlined"
                            size="small"
                          >
                            <Select
                              value={actionValues[index] || ""}
                              onChange={(e) =>
                                handleSelectChange(index, e.target.value)
                              }
                              displayEmpty
                              inputRef={(el) =>
                                (selectRefs.current[index] = el)
                              }
                            >
                              <MenuItem value="" disabled>
                                Select Status
                              </MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                            {errors[`status-${index}`] && (
                              <FormHelperText>
                                Please select a status
                              </FormHelperText>
                            )}
                          </FormControl>
                        </StyledTableCell>

                        {/* Remark TextArea */}
                        <StyledTableCell>
                          <TextField
                            value={remarks[index] || ""}
                            onChange={(e) =>
                              handleRemarkChange(index, e.target.value)
                            }
                            placeholder="Enter remark"
                            multiline
                            rows={0}
                            fullWidth
                            error={errors[`remark-${index}`]}
                            helperText={
                              errors[`remark-${index}`]
                                ? "Please enter a remark"
                                : ""
                            }
                          />
                        </StyledTableCell>

                        {/* Update Button */}
                        <StyledTableCell>
                          <Tooltip title="Update Status" arrow>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                background:
                                  "linear-gradient(90deg, #2196F3, #21CBF3)",
                                color: "#fff",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #1E88E5, #1AA7E5)",
                                },
                              }}
                              onClick={() => updateStatus(index, item.id)}
                            >
                              <VerifiedIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={12}>
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No data found
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
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

export default DgmPtrStatus;
