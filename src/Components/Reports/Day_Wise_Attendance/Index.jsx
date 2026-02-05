import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Backdrop, Button, Tooltip, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import {
  getCircle,
  getDayWiseAttendance,
  getRegion,
} from '../../../Services/Auth';
import { PropagateLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function DayWiseAttendace() {
  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getRegion();
        setRegions(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchRegions();
  }, []);

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCircle('');
    try {
      const circleResponse = await getCircle(regionId);
      setCircles(circleResponse?.data?.list || []);
    } catch (error) {
      console.error('Error fetching circles:', error);
      setCircles([]);
    }
  };

  const [selectedDate, setSelectedDate] = useState('');

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase();
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const DownloadDayWiseAttendance = async () => {
    const validationErrors = {};
    if (!selectedRegion) validationErrors.region = 'Region is required';
    if (!selectedDate) validationErrors.date = 'Date is required';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formattedDate = formatDate(selectedDate);
    const circle = selectedCircle || 0;

    try {
      setLoading(true);
      const response = await getDayWiseAttendance(
        selectedRegion,
        circle,
        formattedDate,
      );
      // console.log(response);
      const list = response?.data?.list || [];

      if (list.length === 0) {
        alert('No employee data found.');
        return;
      }

      // Prepare data for Excel
      const excelData = list.map((item, index) => ({
        'S.No': index + 1,
        'Reporting Officer': item.reportingOfficer || '-',
        Employee: item.employee || '-',
        'Punch Date': item.punchDate || '-',
        'In Time': item.inTime
          ? new Date(item.inTime).toLocaleTimeString('en-GB')
          : '-',
        'Out Time': item.outTime
          ? new Date(item.outTime).toLocaleTimeString('en-GB')
          : '-',
        Status: item.status || '-',
        Location: item.attendanceLocation || '-',
        'Correction Status': item.correctionStatus || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'DayWiseAttendance');

      const circleName = circles.find(
        (c) => c.circleId == selectedCircle,
      )?.name;
      const regionName = regions.find(
        (r) => r.regionId == selectedRegion,
      )?.name;
      const fileName = `${
        circleName || regionName
      }_${formattedDate}_DayWise_Attendance.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Something went wrong while downloading the Excel file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="p-3 d-flex align-items-center position-relative">
          <Tooltip title="Back" arrow placement="top">
            <Button className="position-absolute start-2">
              <Link to="/humanResourceDashboard">
                <ArrowLeftIcon fontSize="large" color="warning" />
              </Link>
            </Button>
          </Tooltip>

          <Typography
            variant="h4"
            sx={{
              flex: 1,
              textAlign: 'center',
              color: '#0a1f83',
              mb: 0,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Day Wise Attendance Sheet
          </Typography>
        </Card.Header>
        <Card.Body>
          <div className="row row-cols-1 row-cols-md-3 g-3 mt-4 mb-4">
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
                <Card.Header>Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    isInvalid={!!errors.date}
                  />
                  {errors.date && (
                    <div className="text-danger"> &nbsp;*{errors.date}</div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-center p-3">
          <Button
            onClick={DownloadDayWiseAttendance}
            variant="outlined"
            className="blue-button"
          >
            Download Sheet
          </Button>
        </Card.Footer>
      </Card>

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default DayWiseAttendace;
