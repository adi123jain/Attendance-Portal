import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button, Typography, Backdrop } from '@mui/material';
import { PropagateLoader } from 'react-spinners';

// Year options
const yearOptions = [2022, 2023, 2024, 2025, 2026, 2027];

function EmployeeForm16() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const employeeCode = sessionStorage.getItem('empCode');

  // Download Form-16 for employee
  const handleDownloadForm16 = () => {
    if (!employeeCode) {
      alert('Employee code not found in session!');
      return;
    }

    setOpenBackdrop(true);

    const downloadUrl = `https://attendance.mpcz.in:8888/E-Attendance/api/employee/getForm16?empCode=${employeeCode}&year=${selectedYear}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Hide loader after 1 second
    setTimeout(() => {
      setOpenBackdrop(false);
    }, 1000);
  };

  return (
    <>
      <div className="container d-flex justify-content-center">
        <Card style={{ width: '100%', maxWidth: '1000px' }}>
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
              Employee Form-16
            </Typography>
          </Card.Header>

          <Card.Body>
            <div className="row justify-content-center mt-4 mb-4">
              <div className="col-md-6 mb-3">
                <Card>
                  <Card.Header>Employee Code</Card.Header>
                  <Card.Body>
                    <Form.Control value={employeeCode} disabled />
                  </Card.Body>
                </Card>
              </div>

              <div className="col-md-6 mb-3">
                <Card>
                  <Card.Header>Year</Card.Header>
                  <Card.Body>
                    <Form.Select
                      aria-label="Select Year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="" disabled>
                        -- select Year --
                      </option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
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
              onClick={handleDownloadForm16}
              variant="outlined"
              className="blue-button"
            >
              Download
            </Button>
          </Card.Footer>
        </Card>
      </div>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader color="#0a1f83" />
      </Backdrop>
    </>
  );
}

export default EmployeeForm16;
