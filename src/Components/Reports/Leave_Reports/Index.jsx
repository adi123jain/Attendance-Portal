import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Backdrop, Button, Tooltip, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import { PropagateLoader } from 'react-spinners';
import { getCircle, getRegion, getLeaveReports } from '../../../Services/Auth';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

function LeaveReports() {
  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await getRegion();
        setRegions(response?.data?.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
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

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const downloadLeaveReport = async () => {
    const newErrors = {};
    if (!selectedRegion) newErrors.region = 'Region is required';

    if (!fromDate) newErrors.fromDate = 'From Date is required';
    if (!toDate) newErrors.toDate = 'To Date is required';

    if (new Date(fromDate) > new Date(toDate)) {
      newErrors.toDate = 'To Date must be after From Date';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      regionId: selectedRegion,
      circleId: selectedCircle || 0,
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
    };

    setLoading(true);
    try {
      const response = await getLeaveReports(payload);
      if (response?.data?.list?.length) {
        exportToExcel(response.data.list);
      } else {
        alert('No data found.');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
    setLoading(false);
  };

  const exportToExcel = (data) => {
    const sheetData = data.map((item, index) => ({
      'S. No': index + 1,
      REGION: item.REGION,
      CIRCLE: item.CIRCLE,
      'Employee Code': item.EMP_CODE,
      'Full Name': item.FULL_NAME,
      'Casual Leave': item.CASUAL_LEAVE,
      'Earn Leave': item.EARN_LEAVE,
      'Commuted Leave': item.COMMUTED_LEAVE,
      'Optional Leave': item.OPTIONAL_LEAVE,
      'Paternity Leave': item.PATERNITY_LEAVE,
      'Special Leave': item.SPECIAL_LEAVE,
      'Maternity Leave': item.MATERNITY_LEAVE,
      'Child Care Leave': item.CHILD_CARE_LEAVE,
      LWP: item.LWP,
      'Study Leave': item.STUDY_LEAVE,
      'Total Leave': item.TOTAL,
    }));

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leave Report');

    // Format: 04-AUG-25
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = String(d.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    };

    const formattedDate = formatDate(new Date());

    // Get proper region/circle names
    const regionObj = regions.find(
      (r) => String(r.regionId) === String(selectedRegion),
    );
    const circleObj = circles.find(
      (c) => String(c.circleId) === String(selectedCircle),
    );

    const regionName = regionObj?.name?.trim().replace(/\s+/g, '_') || '';
    const circleName = circleObj?.name?.trim().replace(/\s+/g, '_') || '';

    // Choose circle > region > fallback
    const baseName = circleName || regionName || 'Leave_Report';
    const fileName = `${baseName}_Leave_Report_${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
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
            Employee's Leave Reports
          </Typography>
        </Card.Header>
        <Card.Body>
          <div className="row row-cols-1 row-cols-md-4 g-3 mt-4 mb-5">
            <div className="col">
              <Card>
                <Card.Header>Region</Card.Header>
                <Card.Body>
                  <Form.Select
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
                    <div className="text-danger">* {errors.region}</div>
                  )}
                </Card.Body>
              </Card>
            </div>

            <div className="col">
              <Card>
                <Card.Header>Circle</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={selectedCircle}
                    onChange={(e) => setSelectedCircle(e.target.value)}
                  >
                    <option value="">-- select Circle --</option>
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
                <Card.Header>From Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    isInvalid={!!errors.fromDate}
                  />
                  {errors.fromDate && (
                    <div className="text-danger">* {errors.fromDate}</div>
                  )}
                </Card.Body>
              </Card>
            </div>

            <div className="col">
              <Card>
                <Card.Header>To Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    isInvalid={!!errors.toDate}
                  />
                  {errors.toDate && (
                    <div className="text-danger">* {errors.toDate}</div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button
            onClick={downloadLeaveReport}
            variant="outlined"
            className="blue-button"
          >
            Download Sheet
          </Button>
        </Card.Footer>
      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default LeaveReports;
