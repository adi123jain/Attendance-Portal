import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button, Typography, Backdrop } from '@mui/material';
import { PropagateLoader } from 'react-spinners';

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

function PaySlip() {
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth().toString(),
  );
  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear().toString(),
  );
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const DownloadPaySlip = () => {
    const empCode = sessionStorage.getItem('empCode');
    if (!empCode) return alert('Employee code not found in session!');

    setOpenBackdrop(true);

    const url = `https://attendance.mpcz.in:8888/E-Attendance/api/employee/getPaySlip?empCode=${empCode}&month=${selectedMonth}&year=${selectedYear}`;

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.target = '_blank';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

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
              Employee Pay Slip
            </Typography>
          </Card.Header>

          <Card.Body>
            <div className="row justify-content-center mt-4 mb-4">
              <div className="col-md-6 mb-3">
                <Card>
                  <Card.Header>Month</Card.Header>
                  <Card.Body>
                    <Form.Select
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
              onClick={DownloadPaySlip}
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

export default PaySlip;
