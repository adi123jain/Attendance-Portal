import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button, Typography } from '@mui/material';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const years = [2022, 2023, 2024, 2025, 2026, 2027];

function MonthlyAttendannceOfficer() {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentYear = currentDate.getFullYear().toString();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const empCode = sessionStorage.getItem('empCode');

  const downloadOfficerWise = () => {
    if (!selectedMonth || !selectedYear) {
      alert('Please select both Month and Year.');
      return;
    }

    const API = `https://attendance.mpcz.in:8888/E-Attendance/api/attendance/getAttendanceMisHrWise?hrEmpCode=${empCode}&month=${selectedMonth}&year=${selectedYear}`;

    const downloadLink = document.createElement('a');
    downloadLink.href = API;
    downloadLink.style.display = 'none';
    downloadLink.target = '_blank';
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
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            Monthly Sheet Attendance Officer Wise
          </Typography>
        </Card.Header>
        <Card.Body>
          <div className="row row-cols-1 row-cols-md-3 g-3 mt-4 mb-4">
            {/* Employee Code (disabled) */}
            <div className="col">
              <Card>
                <Card.Header>Employee Code</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    value={empCode || ''}
                    disabled
                    readOnly
                  />
                </Card.Body>
              </Card>
            </div>

            {/* Month */}
            <div className="col">
              <Card>
                <Card.Header>Month</Card.Header>
                <Card.Body>
                  <Form.Select
                    id="month"
                    aria-label="Select Month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
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
                </Card.Body>
              </Card>
            </div>

            {/* Year */}
            <div className="col">
              <Card>
                <Card.Header>Year</Card.Header>
                <Card.Body>
                  <Form.Select
                    id="year"
                    aria-label="Select Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
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
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="text-center p-3">
          <Button
            onClick={downloadOfficerWise}
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

export default MonthlyAttendannceOfficer;
