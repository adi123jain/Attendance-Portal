import React, { useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import {
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
  OutlinedInput,
} from '@mui/material';
import { Link } from 'react-router-dom';

function HigherPayScale() {
  function submitImmovableForm() {
    const emp = '9754712687';
    const encoded = btoa(emp);
    // console.log(encoded);
  }

  const [selectedOption, setSelectedOption] = useState('option1');

  return (
    <>
      <Card className="shadow-lg rounded mt-4">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            Service Particulars of Employees Seeking Benefit Under 9/18/25 Years
            Rules (To be sumitted in triplicate)
          </Typography>
        </Card.Header>

        <Card.Body>
          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  mb: 0,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Basic Information
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>Employee Code</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Employee Code"
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Empoloyee Name</Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter Name" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Designation</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Designation"
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Region</Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter Region" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>Circle</Card.Header>
                    <Card.Body>
                      <Form.Control type="number" placeholder="Enter Circle" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Division</Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter Division" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Sub-Division</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        placeholder="Enter Sub Division"
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>DC</Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter DC" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  mb: 0,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Appointment on the Present Post
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row xs={1} sm={2} md={5} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>
                      Date of appointment on the present post
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Date of Confirmation</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Gradation list Order No</Card.Header>
                    <Card.Body>
                      <Form.Control type="number" placeholder="Enter Number" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Gradation list Order Date</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>SL. no in the Gradation list</Card.Header>
                    <Card.Body>
                      <Form.Control type="number" placeholder="Enter Number" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  mb: 0,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Appointment in the Preceding Cadre
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row xs={1} sm={2} md={5} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>
                      Date of appointment in the preceding cadre (indicate the
                      name of the post on Regular basis.)
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Date of Confirmation</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Gradation list Order No</Card.Header>
                    <Card.Body>
                      <Form.Control type="number" placeholder="Enter Number" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Gradation list Order Date</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>SL. no in the Gradation list</Card.Header>
                    <Card.Body>
                      <Form.Control type="number" placeholder="Enter Number" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  mb: 0,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                Other
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>
                      Whether any Deptt. Enquiry is pending or show cause notice
                      issued.
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      Whether undergoing any punishment awarded.
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      Any adverse remarks conveyed during the last five years.
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Date of Increment</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={3} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>
                      Period of supersession if, any in the lower cadre within
                      the preview of Regional selection committee.
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      Dt. of exercise of undertaking option (Dt. of application
                      for above benefit)
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>HPS Type</Card.Header>
                    <Card.Body>
                      <Form.Select>
                        <option value=""> -- select --</option>
                        <option value=""></option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2">
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#0a1f83',
                  mb: 0,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}
              >
                DETAILS FOR SEEKING THE BENEFIT OF NEXT HIGHER PAY SCALE FILLED
                BY THE EMPLOYEE IN ADDITION TO THE REQUIRED FORMS
              </Typography>
            </Card.Header>

            <Card.Body>
              <Row xs={1} sm={2} md={4} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>Father's/Husband's Name</Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Date of Birth</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Education Qualification</Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      Date from which exercising the option for grant of higher
                      pay scale.
                    </Card.Header>
                    <Card.Body>
                      <Form.Select>
                        <option value="">Yes</option>
                        <option value="">Yes</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={3} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>
                      Date from which the HPS was granted
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>HPS Granted Order No.</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        placeholder="Enter Number..."
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>HPS Granted Order Date</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>
                      Whether refused promotion earlier to the post for which
                      applied for higher pay scale.
                    </Card.Header>
                    <Card.Body>
                      <Form.Control type="text" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      During the period of service whether leave Without pay has
                      been sanctioned Order No.& Dated.
                    </Card.Header>
                    <Card.Body>
                      <Form.Select>
                        <option value=""></option>
                        <option value=""></option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Current Grade Pay</Card.Header>
                    <Card.Body>
                      <Form.Select>
                        <option value=""></option>
                        <option value=""></option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Apply for</Card.Header>
                    <Card.Body>
                      <Form.Select>
                        <option value="">Yes</option>
                        <option value="">Yes</option>
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row xs={1} sm={2} md={4} className="g-3 mb-2">
                <Col>
                  <Card>
                    <Card.Header>Without Pay Sanctioned Order No.</Card.Header>
                    <Card.Body>
                      <Form.Control type="number" placeholder="Enter..." />
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>Without Pay Sanctioned Order Date</Card.Header>
                    <Card.Body>
                      <Form.Control type="date" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2 text-center bg-light">
              <Typography
                variant="h6"
                sx={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  mb: 0,
                }}
              >
                OPTION - FORM
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#626264',
                  fontFamily: 'serif',
                  fontWeight: 500,
                }}
              >
                (Under Order No. 01/05/I/WC/143 dated 19-7-1990)
              </Typography>
            </Card.Header>

            <Card.Body style={{ padding: '24px' }}>
              <Box display="flex" justifyContent="center" mb={3}>
                <RadioGroup
                  row
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <FormControlLabel
                    value="option1"
                    control={<Radio size="small" />}
                    label="Option 1"
                  />
                  <FormControlLabel
                    value="option2"
                    control={<Radio size="small" />}
                    label="Option 2"
                  />
                </RadioGroup>
              </Box>

              {selectedOption === 'option1' && (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'serif',
                      lineHeight: 1.9,
                      textAlign: 'justify',
                    }}
                  >
                    I <b>Virat VK Kohli</b> working as <b>Junior Engineer</b> in
                    the office of <b>MD Office</b>, have gone through the
                    contents of the provisions of the Order No.{' '}
                    <b>01/05/I/WC/143</b> dated <b>19-7-1990</b>.
                  </Typography>

                  <Box mt={2}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'serif',
                        lineHeight: 1.9,
                        textAlign: 'justify',
                      }}
                    >
                      I hereby opt for the benefit of the next higher pay scale
                      with effect from{' '}
                      <FormControl
                        size="small"
                        sx={{ mx: 1, width: 160, verticalAlign: 'middle' }}
                      >
                        <OutlinedInput type="date" />
                      </FormControl>{' '}
                      as per the aforesaid order. I hereby declare that I have
                      not availed the benefit of higher pay scale in my service
                      period.
                    </Typography>
                  </Box>
                </>
              )}

              {selectedOption === 'option2' && (
                <Box mt={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'serif',
                      lineHeight: 1.9,
                      textAlign: 'justify',
                    }}
                  >
                    I have availed the benefit of higher pay scale earlier
                    w.e.f. sanctioned to me vide order dated
                    <FormControl
                      size="small"
                      sx={{ mx: 1, width: 160, verticalAlign: 'middle' }}
                    >
                      <OutlinedInput
                        type="number"
                        placeholder="Enter Number..."
                      />
                    </FormControl>
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'serif',
                      lineHeight: 1.9,
                      textAlign: 'justify',
                      mt: 2,
                    }}
                  >
                    Now I hereby opt for the second option for the benefit of
                    the higher pay scale with effect from
                    <FormControl
                      size="small"
                      sx={{ mx: 1, width: 160, verticalAlign: 'middle' }}
                    >
                      <OutlinedInput type="date" />
                    </FormControl>
                    as per the aforesaid order.
                  </Typography>
                </Box>
              )}
            </Card.Body>
          </Card>

          <Card className="mt-3 shadow-sm">
            <Card.Header className="p-2 text-center bg-light">
              <Typography
                variant="h6"
                sx={{
                  color: '#0a1f83',
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  mb: 0,
                }}
              >
                FORM OF UNDERTAKING
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#626264',
                  fontFamily: 'serif',
                  fontWeight: 500,
                }}
              >
                (Under Order No. 01/05/I/WC/143 dated 19-7-1990)
              </Typography>
            </Card.Header>

            <Card.Body style={{ padding: '32px' }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'serif',
                  lineHeight: 2,
                  textAlign: 'justify',
                  mb: 3,
                  color: '#1f1f1f',
                }}
              >
                I <b>Virat VK Kohli</b>, working as <b>Junior Engineer</b> in
                the office of <b>MD Office</b> , have gone through the
                provisions of the Order No. 01/05/I/WC/143 dated 19-7-1990.
                While accepting the benefit of the option of higher pay scale
                under this order, I hereby agree to the terms and conditions as
                stated therein.
              </Typography>

              {/* -------- DATE + DECLARATION -------- */}
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'serif',
                  lineHeight: 2,
                  textAlign: 'justify',
                  color: '#1f1f1f',
                }}
              >
                I further hereby give an undertaking that on my absorption
                against the regular post, I shall join the post at the place of
                my posting. On my refusal to do so, I shall forfeit the benefit
                under the aforesaid order and shall stand reverted to my
                original lower grade of
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    mx: 1,
                    verticalAlign: 'middle',
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{ mx: 1, width: 160, verticalAlign: 'middle' }}
                  >
                    <OutlinedInput type="text" placeholder="Enter Remark" />
                  </FormControl>{' '}
                </Box>
                and shall draw the pay which I would have drawn had I not been
                given the benefit of this order.
              </Typography>
            </Card.Body>
          </Card>
        </Card.Body>
        <Card.Footer className="text-center mt-3">
          <Button
            className="cancel-button"
            variant="outlined"
            component={Link}
            to="/"
          >
            Close
          </Button>
          &nbsp;
          <Button
            variant="contained"
            className="green-button"
            onClick={submitImmovableForm}
          >
            Submit
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}

export default HigherPayScale;
