import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Button, Typography } from "@mui/material";
import { getCircle, getRegion } from "../../../Services/Auth";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = [2022, 2023, 2024, 2025, 2026];

function MonthlyAttendanceView() {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentYear = currentDate.getFullYear().toString();

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCircle, setSelectedCircle] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [errors, setErrors] = useState({});

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

    try {
      const circleResponse = await getCircle(regionId);
      setCircles(circleResponse?.data?.list || []);
    } catch (error) {
      console.error("Error fetching circles:", error);
      setCircles([]);
    }
  };

  const handleDownloadSheet = () => {
    const validationErrors = {};
    if (!selectedRegion) validationErrors.region = "Region is required";
    if (!selectedMonth) validationErrors.month = "Month is required";
    if (!selectedYear) validationErrors.year = "Year is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const circle = selectedCircle || 0;
    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/attendance/getAttendanceMis?regionId=${selectedRegion}&circleId=${circle}&month=${selectedMonth}&year=${selectedYear}`;

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.target = "_blank";
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      <Card>
        <Card.Header className="text-center text-primary p-3">
          <Typography
            variant="h4"
            sx={{
              color: "#0a1f83",
              mb: 2,
              fontFamily: "serif",
              fontWeight: "bold",
            }}
          >
            Monthly Attendance Sheet
          </Typography>
        </Card.Header>

        <Card.Body>
          <div className="row row-cols-1 row-cols-md-4 g-3 mt-4 mb-4">
            {/* Region */}
            <div className="col">
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

            {/* Month */}
            <div className="col">
              <Card>
                <Card.Header>Month</Card.Header>
                <Card.Body>
                  <Form.Select
                    aria-label="Select Month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    isInvalid={!!errors.month}
                  >
                    <option value="" disabled>
                      -- select Month --
                    </option>
                    {months.map((month, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {month}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.month && (
                    <div className="text-danger">&nbsp; *{errors.month}</div>
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
                    aria-label="Select Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    isInvalid={!!errors.year}
                  >
                    <option value="" disabled>
                      -- select Year --
                    </option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.year && (
                    <div className="text-danger">&nbsp; *{errors.year}</div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button
            onClick={handleDownloadSheet}
            variant="outlined"
            className="blue-button"
          >
            Download Sheet
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}

export default MonthlyAttendanceView;
