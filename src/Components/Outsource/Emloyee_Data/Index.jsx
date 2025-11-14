import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  getCircle,
  getEmpMasterOutsource,
  getRegion,
} from "../../../Services/Auth";
import { Backdrop, Button, Typography } from "@mui/material";
import { PropagateLoader } from "react-spinners";
import * as XLSX from "xlsx";

function OutsourceEmployeeData() {
  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCircle, setSelectedCircle] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const DownloadEmpMaster = async () => {
    const validationErrors = {};
    if (!selectedRegion) validationErrors.region = "Region is required";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const circle = selectedCircle || 0;

    try {
      setLoading(true);
      const response = await getEmpMasterOutsource(selectedRegion, circle);
      console.log(response);

      const list = response?.data?.list || [];

      if (list.length === 0) {
        alert("No employee data found.");
        return;
      }

      // Add serial number (S.No) to each record
      const transformedList = list.map((item, index) => ({
        "S.No": index + 1,
        "Full Name": item.FULL_NAME || "-",
        Region: item.REGION || "-",
        Circle: item.CIRCLE || "-",
        Division: item.DIVISION || "-",
        "Sub Division": item.SUB_DIVISION || "-",
        DC: item.DC || "-",
        Designation: item.DESIGNATION || "-",
        "Emp Code": item.EMP_CODE || "-",
        "Mobile No": item.MOBILE_NO || "-",
        "Aadhaar Number": item.ADHAAR_NUMBER || "-",
        "Date of Birth": item.DATE_OF_BIRTH || "-",
        "Date of Joining": item.DATE_OF_JOINING || "-",
        "Contract Start Date": item.CONTRACT_START_DATE || "-",
        "Contract End Date": item.CONTRACT_END_DATE || "-",
        "Father Name": item.FATHER_NAME || "-",
        "Mother Name": item.MOTHER_NAME || "-",
        Gender: item.GENDER || "-",
        "Marital Status": item.MARITAL_STATUS || "-",
        "PAN No": item.PAN_NO || "-",
        "PF Number": item.PF_NUMBER || "-",
        "Physically Handicapped": item.PHYSICALLY_HANDICAPED || "-",
        Email: item.EMAIL || "-",
        City: item.CITY || "-",
        Address: item.ADDRESS || "-",
        "Bank Name": item.BANK_NAME || "-",
        "Bank Account": item.BANK_ACCOUNT || "-",
        "Bank IFSC": item.BANK_IFSC || "-",
        "Reporting Officer": item.REPORTING_OFFICER || "-",
        "Skill Type": item.SKILL_TYPE || "-",
        Status: item.STATUS || "-",
        "HR Verified": item.HR_VERIFIED || "-",
        "Vendor Name": item.VENDOR_NAME || "-",
        Created: item.CREATED || "-",
      }));

      // Convert to worksheet
      const worksheet = XLSX.utils.json_to_sheet(transformedList);

      // Create a new workbook and append worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "EmployeeMasterOutsource"
      );

      // Get selected circle name
      const selectedCircleName = circles.find(
        (c) => c.circleId == selectedCircle
      )?.name;

      // Get selected region name
      const selectedRegionName = regions.find(
        (r) => r.regionId == selectedRegion
      )?.name;

      // Build file name
      let fileName =
        selectedCircleName || selectedRegionName || "EmployeeMasterOutsource";

      // Trigger download
      XLSX.writeFile(workbook, `${fileName}_Outsource_Employee_MIS.xlsx`);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Something went wrong while downloading the Excel file.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container d-flex justify-content-center">
        <Card style={{ width: "100%", maxWidth: "1000px" }}>
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
              Employee Master's Outsource
            </Typography>
          </Card.Header>

          <Card.Body>
            <div className="row justify-content-center mt-4 mb-4">
              {/* Region */}
              <div className="col-md-6 mb-3">
                <Card>
                  <Card.Header>Region</Card.Header>
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

              {/* Circle */}
              <div className="col-md-6 mb-3">
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
            </div>
          </Card.Body>

          <Card.Footer className="text-center p-3">
            <Button
              onClick={DownloadEmpMaster}
              variant="outlined"
              className="blue-button"
            >
              Download Sheet
            </Button>
          </Card.Footer>
        </Card>
      </div>

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default OutsourceEmployeeData;
