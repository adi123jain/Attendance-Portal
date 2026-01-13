import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Typography, Button, Backdrop, Tooltip } from '@mui/material';
import { PropagateLoader } from 'react-spinners';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import '../../../Constants/Style/styles.css';
import {
  getCircle,
  getDC,
  getDivision,
  getFeederBySubstation,
  getFeederInchargeByDc,
  getFeederManagerByDc,
  getPostedOfficerByFeeder,
  getRegion,
  getSubDivision,
  getSubstationByDivision,
  submitFeederManagement,
} from '../../../Services/Auth';

function FeederManagement() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [dcs, setDCs] = useState([]);
  const [subStations, setSubStations] = useState([]);
  const [feeder, setFeeder] = useState([]);
  const [feederManager, setFeederManager] = useState([]);
  const [feederIncharge, setFeederIncharge] = useState([]);
  const [errors, setErrors] = useState({});

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubDivision, setSelectedSubDivision] = useState('');
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedSubstation, setSelectedSubstation] = useState('');
  const [selectedFeeder, setSelectedFeeder] = useState('');

  const [selectedFeederManager, setSelectedFeederManager] = useState('');
  const [selectedFeederIncharge, setSelectedFeederIncharge] = useState('');

  const [managerJoiningDate, setManagerJoiningDate] = useState('');
  const [inchargeJoiningDate, setInchargeJoiningDate] = useState('');

  // Load Regions
  useEffect(() => {
    (async () => {
      try {
        const response = await getRegion();
        setRegions(response.data.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  // Fetch Circles when Region changes
  useEffect(() => {
    if (!selectedRegion) return;
    (async () => {
      try {
        const res = await getCircle(selectedRegion);
        setCircles(res.data.list || []);
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    })();
  }, [selectedRegion]);

  // Fetch Divisions when Circle changes
  useEffect(() => {
    if (!selectedCircle) return;
    (async () => {
      try {
        const res = await getDivision(selectedCircle);
        setDivisions(res.data.list || []);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    })();
  }, [selectedCircle]);

  // Fetch SubDivisions when Division changes
  useEffect(() => {
    if (!selectedDivision) return;
    (async () => {
      try {
        const res = await getSubDivision(selectedDivision);
        setSubDivisions(res.data.list || []);
      } catch (error) {
        console.error('Error fetching subdivisions:', error);
      }
    })();
  }, [selectedDivision]);

  // Fetch DCs when SubDivision changes
  useEffect(() => {
    if (!selectedSubDivision) return;
    (async () => {
      try {
        const res = await getDC(selectedSubDivision);
        setDCs(res.data.list || []);
      } catch (error) {
        console.error('Error fetching DCs:', error);
      }
    })();
  }, [selectedSubDivision]);

  // Fetch Substation when Division changes
  useEffect(() => {
    if (!selectedDivision) return;
    (async () => {
      try {
        const res = await getSubstationByDivision(selectedDivision);
        setSubStations(res.data.list || []);
      } catch (error) {
        console.error('Error fetching substations:', error);
      }
    })();
  }, [selectedDivision]);

  // Fetch Feeder when Substation changes
  useEffect(() => {
    if (!selectedSubstation) return;
    (async () => {
      try {
        const res = await getFeederBySubstation(selectedSubstation);
        setFeeder(res.data || []);
      } catch (error) {
        console.error('Error fetching feeders:', error);
      }
    })();
  }, [selectedSubstation]);

  // Fetch Extra Data when DC changes
  useEffect(() => {
    if (!selectedDC) return;
    (async () => {
      try {
        const [res1, res2] = await Promise.all([
          getFeederManagerByDc(selectedDC),
          getFeederInchargeByDc(selectedDC),
        ]);

        console.log(res1);
        console.log(res2);

        setFeederManager(res1.data.list || []);
        setFeederIncharge(res2.data.list || []);
      } catch (error) {
        console.error('Error fetching extra options for DC:', error);
      }
    })();
  }, [selectedDC]);

  useEffect(() => {
    if (!selectedFeeder) return;

    (async () => {
      try {
        const res = await getPostedOfficerByFeeder(selectedFeeder);
        const data = res.data?.list?.[0];

        if (!data) return;

        const managerEmp = {
          empCode: data.fdrManagerEmpCode,
          fullName: data.fdrManagerName,
          designationName: data.fdrManagerDesignation,
        };

        const inchargeEmp = {
          empCode: data.fdrInchargeEmpCode,
          fullName: data.fdrInchargeName,
          designationName: data.fdrInchargeDesignation,
        };

        setFeederManager((prev) => ensureOptionExists(prev, managerEmp));
        setFeederIncharge((prev) => ensureOptionExists(prev, inchargeEmp));

        // Set selected values
        setSelectedFeederManager(managerEmp.empCode || '');
        setSelectedFeederIncharge(inchargeEmp.empCode || '');

        // Set dates
        setManagerJoiningDate(data.managerFromDate?.split(' ')[0] || '');
        setInchargeJoiningDate(data.inchargeFromDate?.split(' ')[0] || '');
      } catch (error) {
        console.error('Error fetching feeder assignment:', error);

        setSelectedFeederManager('');
        setSelectedFeederIncharge('');
        setManagerJoiningDate('');
        setInchargeJoiningDate('');
      }
    })();
  }, [selectedFeeder]);

  const ensureOptionExists = (list, emp) => {
    if (!emp) return list;

    const exists = list.some((item) => item.empCode === emp.empCode);
    if (exists) return list;

    return [...list, emp];
  };

  // Refs for focusing
  const regionRef = useRef(null);
  const circleRef = useRef(null);
  const divisionRef = useRef(null);
  const subDivisionRef = useRef(null);
  const dcRef = useRef(null);
  const subStationRef = useRef(null);
  const feederRef = useRef(null);
  const feederManagerRef = useRef(null);
  const feederManagerPostingRef = useRef(null);
  const feederInchargeRef = useRef(null);
  const feederInchargePostingRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    if (!selectedRegion) {
      newErrors.region = '*region is required.';
      regionRef.current?.focus();
    } else if (!selectedCircle) {
      newErrors.circle = '*circle is required.';
      circleRef.current?.focus();
    } else if (!selectedDivision) {
      newErrors.division = '*division is required.';
      divisionRef.current?.focus();
    } else if (!selectedSubDivision) {
      newErrors.subDivision = '*subDivision is required.';
      subDivisionRef.current?.focus();
    } else if (!selectedDC) {
      newErrors.dc = '*dc is required.';
      dcRef.current?.focus();
    } else if (!selectedSubstation) {
      newErrors.subStation = '*subStation is required.';
      subStationRef.current?.focus();
    } else if (!selectedFeeder) {
      newErrors.feeder = '*feeder is required.';
      feederRef.current?.focus();
    } else if (!selectedFeederManager) {
      newErrors.feederManager = '*feeder manager is required.';
      feederManagerRef.current?.focus();
    } else if (!managerJoiningDate) {
      newErrors.feederManagerPosting = '*manager posting date is required.';
      feederManagerPostingRef.current?.focus();
    } else if (!selectedFeederIncharge) {
      newErrors.feederIncharge = '*feeder incharge is required.';
      feederInchargeRef.current?.focus();
    } else if (!inchargeJoiningDate) {
      newErrors.feederInchargePosting = '*incharge posting date is required.';
      feederInchargePostingRef.current?.focus();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setOpenBackdrop(true);
    const feederObj = feeder.find(
      (f) => String(f.feederCode) === String(selectedFeeder),
    );
    console.log(feederObj);
    try {
      const payload = {
        dc: selectedDC,
        subStation: selectedSubstation,
        feederCode: selectedFeeder,
        feederName: feederObj ? feederObj.feederName : '',
        fdrManagerEmpCode: selectedFeederManager,
        managerFromDate: managerJoiningDate,
        fdrInchargeEmpCode: selectedFeederIncharge,
        inchargeFromDate: inchargeJoiningDate,
        createdBy: sessionStorage.getItem('empCode'),
      };

      const response = await submitFeederManagement(payload);
      if (response.data.code === '200') {
        alert('SuccessFully Updated !!');
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error('API Error:', error);
      setOpenBackdrop(false);
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded mt-4">
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
            Feeder Management System (Regular Employee's)
          </Typography>
        </Card.Header>

        <Card.Body>
          <Row xs={1} sm={2} md={3} className="mt-2">
            <Col>
              <Card>
                <Card.Header>Region</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={regionRef}
                    value={selectedRegion}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedRegion(value);

                      // clear dependent
                      setSelectedCircle('');
                      setCircles([]);
                      setSelectedDivision('');
                      setDivisions([]);
                      setSelectedSubDivision('');
                      setSubDivisions([]);
                      setSelectedDC('');
                      setDCs([]);
                      setSelectedSubstation('');
                      setSubStations([]);
                      setSelectedFeeder('');
                      setFeeder([]);
                      setSelectedFeederManager('');
                      setFeederManager([]);
                      setSelectedFeederIncharge('');
                      setFeederIncharge([]);
                      setManagerJoiningDate('');
                      setInchargeJoiningDate('');
                    }}
                  >
                    <option disabled value="">
                      -- select Region --
                    </option>
                    {regions.map((r) => (
                      <option key={r.regionId} value={r.regionId}>
                        {r.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.region && (
                    <div className="text-danger">{errors.region}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Circle</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={selectedCircle}
                    ref={circleRef}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCircle(value);
                      setSelectedDivision('');
                      setDivisions([]);
                      setSelectedSubDivision('');
                      setSubDivisions([]);
                      setSelectedDC('');
                      setDCs([]);
                      setSelectedSubstation('');
                      setSubStations([]);
                      setSelectedFeeder('');
                      setFeeder([]);
                      setSelectedFeederManager('');
                      setFeederManager([]);
                      setSelectedFeederIncharge('');
                      setFeederIncharge([]);
                      setManagerJoiningDate('');
                      setInchargeJoiningDate('');
                    }}
                  >
                    <option disabled value="">
                      -- select Circle --
                    </option>
                    {circles.map((c) => (
                      <option key={c.circleId} value={c.circleId}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.circle && (
                    <div className="text-danger">{errors.circle}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Division</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={selectedDivision}
                    ref={divisionRef}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedDivision(value);
                      setSelectedSubDivision('');
                      setSubDivisions([]);
                      setSelectedDC('');
                      setDCs([]);
                      setSelectedSubstation('');
                      setSubStations([]);
                      setSelectedFeeder('');
                      setFeeder([]);
                      setSelectedFeederManager('');
                      setFeederManager([]);
                      setSelectedFeederIncharge('');
                      setFeederIncharge([]);
                      setManagerJoiningDate('');
                      setInchargeJoiningDate('');
                    }}
                  >
                    <option disabled value="">
                      -- select Division --
                    </option>
                    {divisions.map((d) => (
                      <option key={d.divisionId} value={d.divisionId}>
                        {d.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.division && (
                    <div className="text-danger">{errors.division}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row xs={1} sm={2} md={4} className="mt-2 g-3">
            <Col>
              <Card>
                <Card.Header>Sub Division</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={subDivisionRef}
                    value={selectedSubDivision}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedSubDivision(value);
                      setSelectedDC('');
                      setDCs([]);
                      // setSelectedSubstation("");
                      // setSubStations([]);
                      setSelectedFeeder('');
                      setFeeder([]);
                      setSelectedFeederManager('');
                      setFeederManager([]);
                      setSelectedFeederIncharge('');
                      setFeederIncharge([]);
                      setManagerJoiningDate('');
                      setInchargeJoiningDate('');
                    }}
                  >
                    <option disabled value="">
                      -- select Sub Division --
                    </option>
                    {subDivisions.map((s) => (
                      <option key={s.subdivisionId} value={s.subdivisionId}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.subDivision && (
                    <div className="text-danger">{errors.subDivision}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Distribution Center</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={dcRef}
                    value={selectedDC}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedDC(value);
                      // setSelectedSubstation("");
                      // setSubStations([]);
                      setSelectedFeeder('');
                      setFeeder([]);
                      setSelectedFeederManager('');
                      setFeederManager([]);
                      setSelectedFeederIncharge('');
                      setFeederIncharge([]);
                      setSelectedFeederManager('');
                      setFeederManager([]);
                      setSelectedFeederIncharge('');
                      setFeederIncharge([]);
                      setManagerJoiningDate('');
                      setInchargeJoiningDate('');
                    }}
                  >
                    <option disabled value="">
                      -- select DC --
                    </option>
                    {dcs.map((dc) => (
                      <option key={dc.dcId} value={dc.dcId}>
                        {dc.name}
                      </option>
                    ))}
                  </Form.Select>
                  {<errors className="dc"></errors> && (
                    <div className="text-danger">{errors.dc}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Sub Station</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={subStationRef}
                    value={selectedSubstation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedSubstation(value);
                      setSelectedFeeder('');
                      setFeeder([]);
                    }}
                  >
                    <option disabled value="">
                      -- select Substation --
                    </option>
                    {subStations.map((ss) => (
                      <option key={ss.substationId} value={ss.substationId}>
                        {ss.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.subStation && (
                    <div className="text-danger">{errors.subStation}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Feeder</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={feederRef}
                    value={selectedFeeder}
                    onChange={(e) => setSelectedFeeder(e.target.value)}
                  >
                    <option disabled value="">
                      -- select Feeder --
                    </option>
                    {feeder.map((f) => (
                      <option key={f.feederCode} value={f.feederCode}>
                        {f.feederName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.feeder && (
                    <div className="text-danger">{errors.feeder}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row xs={1} sm={2} md={4} className="g-3 mt-2">
            <Col>
              <Card>
                <Card.Header>Feeder Manager</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={feederManagerRef}
                    value={selectedFeederManager}
                    onChange={(e) => setSelectedFeederManager(e.target.value)}
                  >
                    <option disabled value="">
                      -- select Manager --
                    </option>
                    {feederManager.map((item) => (
                      <option key={item.empCode} value={item.empCode}>
                        {item.empCode} - {item.fullName} -{' '}
                        {item.designationName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.feederManager && (
                    <div className="text-danger">{errors.feederManager}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Feeder Incharge</Card.Header>
                <Card.Body>
                  <Form.Select
                    ref={feederInchargeRef}
                    value={selectedFeederIncharge}
                    onChange={(e) => setSelectedFeederIncharge(e.target.value)}
                  >
                    <option disabled value="">
                      -- select Incharge --
                    </option>
                    {feederIncharge.map((item) => (
                      <option key={item.empCode} value={item.empCode}>
                        {item.empCode} - {item.fullName} -{' '}
                        {item.designationName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.feederIncharge && (
                    <div className="text-danger">{errors.feederIncharge}</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Feeder Manager Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    ref={feederManagerPostingRef}
                    type="date"
                    value={managerJoiningDate}
                    onChange={(e) => setManagerJoiningDate(e.target.value)}
                  />
                  {errors.feederManagerPosting && (
                    <div className="text-danger">
                      {errors.feederManagerPosting}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Header>Feeder Incharge Date</Card.Header>
                <Card.Body>
                  <Form.Control
                    ref={feederInchargePostingRef}
                    type="date"
                    value={inchargeJoiningDate}
                    onChange={(e) => setInchargeJoiningDate(e.target.value)}
                  />
                  {errors.feederInchargePosting && (
                    <div className="text-danger">
                      {errors.feederInchargePosting}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <div className="text-center mt-4 mb-3">
            <Button
              className="cancel-button"
              variant="outlined"
              style={{ borderRadius: '20px', padding: '6px 20px' }}
              component={Link}
              to="/"
            >
              Close
            </Button>
            &nbsp;
            <Button
              onClick={handleSubmit}
              className="green-button"
              variant="outlined"
              style={{
                borderRadius: '20px',
                backgroundColor: '#0a1f83',
                color: '#fff',
                padding: '6px 20px',
                border: 'none',
              }}
            >
              Submit
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Backdrop Loader */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default FeederManagement;
