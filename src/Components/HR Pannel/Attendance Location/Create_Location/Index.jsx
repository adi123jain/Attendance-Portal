import React, { useRef, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchUtils from '../../../../Constants/Search_Utils/Index';
import { Button, Typography } from '@mui/material';
import {
  getDistrict,
  createAttendanceLocation,
} from '../../../../Services/Auth';

function CreateAttendanceLocation() {
  const regionRef = useRef(null);

  const [searchValues, setSearchValues] = useState({
    region: '',
    circle: '',
    division: '',
    subDivision: '',
    dc: '',
    subStation: '',
  });

  const [locationName, setLocationName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [districtId, setDistrictId] = useState('');

  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);

  const fetchDistricts = async () => {
    try {
      const res = await getDistrict();
      // console.log(res);
      if (res?.data) {
        setDistricts(res.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!searchValues.region) newErrors.region = '*region is required.';
    if (!locationName.trim())
      newErrors.locationName = 'Location name is required.';
    if (!longitude.trim()) newErrors.longitude = 'Longitude is required.';
    if (!latitude.trim()) newErrors.latitude = 'Latitude is required.';
    if (!districtId) newErrors.districtId = 'District is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createLocation = async () => {
    if (!validate()) {
      if (!searchValues.region && regionRef.current) {
        regionRef.current.focus();
      }
      return;
    }

    const payload = {
      regionId: searchValues.region,
      circleId: searchValues.circle,
      divisionId: searchValues.division,
      subDivisionId: searchValues.subDivision,
      dcId: searchValues.dc,
      subStationId: searchValues.subStation,
      locationName: locationName,
      longitude: longitude,
      latitude: latitude,
      districtId: districtId,
      updatedBy: sessionStorage.getItem('empCode'),
      status: true,
    };

    try {
      // console.log("Sending data:", payload);
      const response = await createAttendanceLocation(payload);
      // console.log("create response", response);
      if (response.data.code === '200' && response.data.message === 'Success') {
        alert('Location Created Successfully !!');
        // window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Card className="shadow-lg rounded">
      <Card.Header className="text-center p-3">
        <Typography
          variant="h4"
          sx={{
            color: '#0a1f83',
            mb: 2,
            fontFamily: 'serif',
            fontWeight: 'bold',
          }}
        >
          Create Attendance Location
        </Typography>
      </Card.Header>
      <Card.Body>
        <SearchUtils
          values={searchValues}
          setValues={setSearchValues}
          errors={errors}
          refs={{ region: regionRef }}
        />

        <div className="row row-cols-1 row-cols-md-4 g-3 mt-4">
          <div className="col">
            <Card>
              <Card.Header>Location Name</Card.Header>
              <Card.Body>
                <Form.Control
                  type="text"
                  placeholder="Enter Location Name"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  isInvalid={!!errors.locationName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.locationName}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>

          <div className="col">
            <Card>
              <Card.Header>Longitude</Card.Header>
              <Card.Body>
                <Form.Control
                  type="number"
                  placeholder="Enter Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  isInvalid={!!errors.longitude}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.longitude}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>

          <div className="col">
            <Card>
              <Card.Header>Lattitude</Card.Header>
              <Card.Body>
                <Form.Control
                  type="number"
                  placeholder="Enter Lattitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  isInvalid={!!errors.latitude}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.latitude}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>

          <div className="col">
            <Card>
              <Card.Header>District</Card.Header>
              <Card.Body>
                <Form.Select
                  aria-label="Select District"
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  isInvalid={!!errors.districtId}
                >
                  <option value="" disabled>
                    -- Select District --
                  </option>
                  {districts.map((dist) => (
                    <option key={dist.districtId} value={dist.districtId}>
                      {dist.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.districtId}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="text-center mt-4 mb-3">
          <Button
            onClick={createLocation}
            variant="outlined"
            sx={{
              background: 'linear-gradient(90deg, #0a1f83 0%, #3f51b5 100%)',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            Create Location
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CreateAttendanceLocation;
