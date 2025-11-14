// import React from "react";
// import Card from "react-bootstrap/Card";
// import Form from "react-bootstrap/Form";
// import { Link } from "react-router-dom";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
// import Tooltip from "@mui/material/Tooltip";
// import Table from "react-bootstrap/Table";

// function OutsourceEmpAttendaceView() {
//   return (
//     <>
//       <Card>
//         <Card.Header className="text-primary text-center p-3">
//           <h4 className="mb-0 font-bold" style={{ fontFamily: "serif" }}>
//             Outsource Employee Attendance Records
//           </h4>
//         </Card.Header>
//         <Card.Body>
//           {/* Row 1 */}
//           <div className="row row-cols-1 row-cols-md-3 g-3">
//             <div className="col">
//               <Card>
//                 <Card.Header>Employee Code</Card.Header>
//                 <Card.Body>
//                   <Form.Control
//                     type="number"
//                     placeholder="Enter Employee Code"
//                   />
//                 </Card.Body>
//               </Card>
//             </div>

//             <div className="col">
//               <Card>
//                 <Card.Header>Month</Card.Header>
//                 <Card.Body>
//                   <Form.Select
//                     aria-label="Default select example"
//                     defaultValue="selected"
//                   >
//                     <option value="selected" disabled>
//                       -- select month --
//                     </option>
//                     <option value="1">One</option>
//                     <option value="2">Two</option>
//                     <option value="3">Three</option>
//                   </Form.Select>
//                 </Card.Body>
//               </Card>
//             </div>

//             <div className="col">
//               <Card>
//                 <Card.Header>Year</Card.Header>
//                 <Card.Body>
//                   <Form.Select
//                     aria-label="Default select example"
//                     defaultValue="selected"
//                   >
//                     <option value="selected" disabled>
//                       -- select year --
//                     </option>
//                     <option value="1">One</option>
//                     <option value="2">Two</option>
//                     <option value="3">Three</option>
//                   </Form.Select>
//                 </Card.Body>
//               </Card>
//             </div>
//           </div>
//         </Card.Body>
//         <Card.Footer className="text-center p-3">
//           <button className="btn btn-primary ">View Attendance</button>
//         </Card.Footer>
//       </Card>
//       <hr />

//       <Table
//         responsive
//         striped
//         bordered
//         hover
//         variant="primary"
//         className="text-center mt-4"
//       >
//         <thead>
//           <tr>
//             <th scope="col">S.No.</th>
//             <th scope="col">Employee Code</th>
//             <th scope="col">Punch Date</th>
//             <th scope="col">In Time</th>
//             <th scope="col">Out Time</th>
//             <th scope="col">Duration</th>
//             <th scope="col">Remark</th>
//             <th scope="col">Impression </th>
//             <th scope="col">Images </th>
//             <th scope="col">Status</th>
//             <th scope="col">Leave Type</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//             <td>1</td>
//           </tr>
//         </tbody>
//       </Table>
//     </>
//   );
// }

// export default OutsourceEmpAttendaceView;

import React, { useState, useRef, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import {
  employeeAttendaceView,
  getImpressionImage,
} from "../../../Services/Auth";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Modal from "react-bootstrap/Modal";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

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

function OutsourceEmpAttendaceView() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [empCode, setEmpCode] = useState("");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [showTable, setShowTable] = useState(false);
  const [dataInTable, setDataInTable] = useState([]);

  const [errors, setErrors] = useState({});
  const empCodeRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (showTable && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTable, dataInTable]);

  const empAttendanceView = async () => {
    const newErrors = {};
    if (!empCode.trim()) newErrors.empCode = " *Employee code is required";
    if (!month) newErrors.month = "*Month is required";
    if (!year) newErrors.year = "*Year is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.empCode) empCodeRef.current.focus();
      else if (newErrors.month) monthRef.current.focus();
      else if (newErrors.year) yearRef.current.focus();
      return;
    }
    setOpenBackdrop(true);
    try {
      const response = await employeeAttendaceView(empCode, month, year);
      // console.log("Response", response);
      if (response?.data.code == "200" && response?.data.message == "Success") {
        setShowTable(true);
        setOpenBackdrop(false);
        setDataInTable(response?.data.list);
      } else {
        alert(response?.data.message);
        setShowTable(false);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log("Error", error);
      setOpenBackdrop(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataInTable);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "AttendanceRecords.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "S.No",
      "Emp Code",
      "Punch Date",
      "In Time",
      "Out Time",
      "Duration",
      "Remark",
      "Impressions",
      "Status",
      "Leave Type",
      "Inactive Source",
      "Inactive Remark",
    ];

    const tableRows = dataInTable.map((item, index) => [
      index + 1,
      item.empCode,
      item.punchDate,
      item.inTime ? item.inTime.split("T")[1]?.split(".")[0] : "",
      item.outTime ? item.outTime.split("T")[1]?.split(".")[0] : "",
      item.duration,
      item.remark,
      item.impressions,
      item.status,
      item.leaveType,
      item.inactiveSource,
      item.inactiveRemark,
    ]);

    // 👇 Correct way to call it now
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 10,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(month + "_" + year + "_" + empCode + "_AttendanceRecords.pdf");
  };

  const [modalShow, setModalShow] = useState(false);
  const [showImpressionTable, setShowImpressionTable] = useState(false);
  const [impressionData, setImpressionData] = useState([]);
  const modalClose = () => setModalShow(false);

  const modalOpen = async (items) => {
    // console.log(items);
    setModalShow(true);
    // setImpressionData(items);
    setOpenBackdrop(true);
    const parts = items.punchDate.split("/");
    const inputDate = new Date(parts[2], parts[1] - 1, parts[0]);
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const formattedDate = `${("0" + inputDate.getDate()).slice(-2)}-${
      months[inputDate.getMonth()]
    }-${inputDate.getFullYear().toString().slice(-2)}`;

    try {
      const response = await getImpressionImage(items.empCode, formattedDate);
      // console.log("impResponse", response);
      if (response?.data.code == "200" && response?.data.message == "Success") {
        setImpressionData(response?.data.list);
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

  const downloadImage = (imgUrl) => {
    window.location.href =
      `https://attendance.mpcz.in:8888/E-Attendance/api/attendance/dw_f/` +
      imgUrl;
  };

  return (
    <>
      <Card>
        <Card.Header className="text-primary text-center p-3">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: "serif",
              fontWeight: "bold",
              color: "#0a1f83",
            }}
          >
            Employee Attendance View (Outsource)
          </Typography>
        </Card.Header>
        <Card.Body>
          {/* Row 1 */}
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {/* Employee Code */}
            <div className="col">
              <Card>
                <Card.Header>Employee Code</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="number"
                    placeholder="Enter Employee Code"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    ref={empCodeRef}
                  />
                  {errors.empCode && (
                    <small className="text-danger">{errors.empCode}</small>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Month */}
            <div className="col">
              <Card>
                <Card.Header>Month</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    ref={monthRef}
                  >
                    <option value="" disabled>
                      --Select--
                    </option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Form.Select>
                  {errors.month && (
                    <small className="text-danger">{errors.month}</small>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Year */}
            <div className="col">
              <Card>
                <Card.Header>Year</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    ref={yearRef}
                  >
                    <option value="" disabled>
                      --Select--
                    </option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </Form.Select>
                  {errors.year && (
                    <small className="text-danger">{errors.year}</small>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button className="blue-button" onClick={empAttendanceView}>
            View Attendance
          </Button>
        </Card.Footer>
      </Card>
      <hr />

      {showTable && (
        <>
          <div className="d-flex justify-content-start mb-3">
            <Button
              // color="secondary"
              // variant="contained"
              className="purple-button me-2"
              onClick={exportToExcel}
            >
              Download Excel
            </Button>
            <Button className="cancel-button" onClick={exportToPDF}>
              Download PDF
            </Button>
          </div>

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
                Attendance Records by Employee Code
              </Typography>
            </Card.Header>

            <Card.Body>
              <TableContainer component={Paper}>
                <Table ref={tableRef}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Punch Date</StyledTableCell>
                      <StyledTableCell>In Time</StyledTableCell>
                      <StyledTableCell>Out Time</StyledTableCell>
                      <StyledTableCell>Duration</StyledTableCell>
                      <StyledTableCell>Remark</StyledTableCell>
                      <StyledTableCell>Impression</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Leave Type</StyledTableCell>
                      <StyledTableCell>Inactive Source</StyledTableCell>
                      <StyledTableCell>Inactive Remark</StyledTableCell>
                      <StyledTableCell>Images</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {dataInTable && dataInTable.length > 0 ? (
                      dataInTable.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{item.empCode}</StyledTableCell>
                          <StyledTableCell>{item.punchDate}</StyledTableCell>
                          <StyledTableCell>
                            {item.inTime
                              ? item.inTime.split("T")[1]?.split(".")[0]
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.outTime
                              ? item.outTime.split("T")[1]?.split(".")[0]
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell>{item.duration}</StyledTableCell>
                          <StyledTableCell>{item.remark}</StyledTableCell>
                          <StyledTableCell>{item.impressions}</StyledTableCell>

                          <StyledTableCell>{item.status}</StyledTableCell>
                          <StyledTableCell>{item.leaveType}</StyledTableCell>
                          <StyledTableCell>
                            {item.inactiveSource}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.inactiveRemark}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.impressions > 0 ? (
                              <Button
                                className="green-button"
                                size="small"
                                onClick={() => modalOpen(item)}
                              >
                                View
                              </Button>
                            ) : (
                              "-"
                            )}
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
        </>
      )}

      <Modal
        show={modalShow}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h5"
              sx={{
                color: "#0a1f83",
                // mb: 2,
                fontFamily: "serif",
                fontWeight: "bold",
              }}
            >
              Employee Impressions (Outsource)
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TableContainer component={Paper}>
            <Table className="overflow-hidden">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell>Employee Name</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Punch Time</StyledTableCell>
                  <StyledTableCell>LogType</StyledTableCell>
                  <StyledTableCell>Source</StyledTableCell>
                  <StyledTableCell>Impression</StyledTableCell>
                  <StyledTableCell>Longitude</StyledTableCell>
                  <StyledTableCell>Lattitude</StyledTableCell>
                  {/* <StyledTableCell>Status</StyledTableCell> */}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {impressionData && impressionData.length > 0 ? (
                  impressionData.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{item.empCode}</StyledTableCell>
                      <StyledTableCell>{item.empName}</StyledTableCell>
                      <StyledTableCell>
                        {item.punchTime ? item.punchTime.split("T")[0] : "--"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.punchTime
                          ? item.punchTime.split("T")[1].split(".")[0]
                          : "--"}
                      </StyledTableCell>
                      <StyledTableCell>{item.logType}</StyledTableCell>
                      <StyledTableCell>{item.source}</StyledTableCell>
                      <StyledTableCell>
                        {item.source === "BIOMETRIC" || !item.imgPath ? (
                          <Button color="secondary" size="small" disabled>
                            View
                          </Button>
                        ) : (
                          <Button
                            className="blue-button"
                            size="small"
                            onClick={() => downloadImage(item.imgPath)}
                          >
                            <CloudDownloadIcon />
                          </Button>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{item.longitude}</StyledTableCell>
                      <StyledTableCell>{item.latitude}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={10} align="center">
                      No Impression Data Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal.Body>

        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
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

export default OutsourceEmpAttendaceView;
