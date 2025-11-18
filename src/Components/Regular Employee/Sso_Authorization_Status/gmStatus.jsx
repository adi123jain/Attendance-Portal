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
import { getSsoSatusByGm, updateSsoSatusByGm } from "../../../Services/Auth";
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

function GmAuthorizationStatus() {
  const tableRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [records, setRecords] = useState([]);
  const sessionEmp = sessionStorage.getItem("empCode");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getSsoSatusByGm(sessionEmp);
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
  const [errors, setErrors] = useState({});
  const [remarkValues, setRemarkValues] = useState({});

  const selectRefs = useRef({});

  // Handle select change
  // const handleSelectChange = (index, value) => {
  //   setActionValues((prev) => ({ ...prev, [index]: value }));
  //   setErrors((prev) => ({ ...prev, [index]: false }));
  // };

  const handleSelectChange = (index, value) => {
    setActionValues((prev) => ({ ...prev, [index]: value }));

    setErrors((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        select: false,
      },
    }));
  };

  const handleRemarkChange = (index, value) => {
    setRemarkValues((prev) => ({
      ...prev,
      [index]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        remark: false, // clear remark error
      },
    }));
  };

  // On update click
  const updateGmStatus = async (index, id) => {
    // const selectedValue = actionValues[index];

    // //  Validation check
    // if (!selectedValue) {
    //   setErrors((prev) => ({ ...prev, [index]: true }));
    //   const ref = selectRefs.current[index];
    //   if (ref) ref.focus();
    //   return;
    // }

    const selectedValue = actionValues[index];
    const remarkValue = remarkValues[index];

    let hasError = false;

    // ---- Validate Select ----
    if (!selectedValue) {
      hasError = true;
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          select: true,
        },
      }));

      const ref = selectRefs.current[index];
      if (ref) ref.focus();
    }

    // ---- Validate Remark ----
    if (!remarkValue || remarkValue.trim() === "") {
      hasError = true;
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || {}),
          remark: true,
        },
      }));
    }

    if (hasError) return;

    try {
      setOpenBackdrop(true);

      const response = await updateSsoSatusByGm(selectedValue, id, remarkValue);
      console.log("Update API Response:", response);

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
            SSO Authorization Status by GM
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
                    <StyledTableCell>S.NO</StyledTableCell>
                    <StyledTableCell>SSO Name</StyledTableCell>
                    <StyledTableCell>JE Name</StyledTableCell>
                    <StyledTableCell>DGM Name</StyledTableCell>
                    <StyledTableCell>DGM Status</StyledTableCell>
                    <StyledTableCell>GM Name</StyledTableCell>
                    <StyledTableCell>GM Status</StyledTableCell>
                    <StyledTableCell>11KV</StyledTableCell>
                    <StyledTableCell>33KV</StyledTableCell>
                    <StyledTableCell>JE Remark</StyledTableCell>
                    <StyledTableCell>DGM Remark</StyledTableCell>
                    {/* <StyledTableCell>GM Remark</StyledTableCell> */}
                    <StyledTableCell>DC Name</StyledTableCell>
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
                        <StyledTableCell>{item.ssoName || "-"}</StyledTableCell>
                        <StyledTableCell>{item.jeName || "-"}</StyledTableCell>
                        <StyledTableCell>{item.dgmName || "-"}</StyledTableCell>
                        <StyledTableCell>
                          {item.dgmStatus || "-"}
                        </StyledTableCell>
                        <StyledTableCell>{item.gmName || "-"}</StyledTableCell>

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
                          {item.jeRemark || "-"}
                        </StyledTableCell>

                        <StyledTableCell>
                          {item.dgmRemark || "-"}
                        </StyledTableCell>

                        {/* <StyledTableCell>
                          {item.gmRemark || "-"}
                        </StyledTableCell> */}

                        <StyledTableCell>{item.dcName || "-"}</StyledTableCell>

                        {/* Action Select */}
                        <StyledTableCell>
                          <FormControl
                            fullWidth
                            error={errors[index]}
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
                              <MenuItem value="" disabled selected>
                                Select Status
                              </MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                            {errors[index] && (
                              <FormHelperText>
                                Please select a status before updating
                              </FormHelperText>
                            )}
                          </FormControl>
                        </StyledTableCell>

                        <StyledTableCell>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter remark"
                            value={remarkValues[index] || ""}
                            error={errors[index]?.remark}
                            helperText={
                              errors[index]?.remark ? "Remark is required" : ""
                            }
                            onChange={(e) =>
                              handleRemarkChange(index, e.target.value)
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
                              onClick={() => updateGmStatus(index, item.id)}
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

export default GmAuthorizationStatus;
