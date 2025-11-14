import React, { useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { Backdrop, Button, Typography } from "@mui/material";
import { PropagateLoader } from "react-spinners";
import { updateLocationCordinate } from "../../../../Services/Auth";
import { Link } from "react-router-dom";

function UpdateLocation() {
  const location = useLocation();
  const item = location.state?.item;
  const navigate = useNavigate();
  // console.log(item);

  const [locationName, setLocationName] = useState(item?.locationName || "");
  const [latitude, setLatitude] = useState(item?.latitude || "");
  const [longitude, setLongitude] = useState(item?.longitude || "");
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [errors, setErrors] = useState({});

  // Refs for focusing
  const locationRef = useRef(null);
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    let firstInvalidField = null;

    if (!locationName.trim()) {
      newErrors.locationName = "*Location Name is required.";
      firstInvalidField = locationRef;
    }
    if (!latitude.toString().trim()) {
      newErrors.latitude = "*Latitude is required.";
      if (!firstInvalidField) firstInvalidField = latitudeRef;
    }
    if (!longitude.toString().trim()) {
      newErrors.longitude = "*Longitude is required.";
      if (!firstInvalidField) firstInvalidField = longitudeRef;
    }

    setErrors(newErrors);

    // Focus first invalid input
    if (firstInvalidField?.current) {
      firstInvalidField.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const updateCordinates = async () => {
    if (!validate()) return;
    setOpenBackdrop(true);
    const payload = {
      locationName: locationName,
      locationCode: item.locationCode,
      latitude: latitude,
      longitude: longitude,
      regionId: item.regionId,
      circleId: item.circleId,
      divisionId: item.divisionId,
      subdivisionId: item.subdivisionId,
      dcId: item.dcId,
      updatedBy: item.updateBy,
      status: item.isActive,
    };

    try {
      //console.log("Payload to be sent:", payload);
      const response = await updateLocationCordinate(payload);
      //console.log(response);
      if (response.data?.code == "200" && response.data.message == "Success") {
        alert("Location Updated Successfully");
        setOpenBackdrop(false);
        navigate("/editLocation");
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location.");
      setOpenBackdrop(false);
    }
  };

  return (
    <Card>
      <Card.Header className="text-center p-3">
        <Typography
          variant="h5"
          sx={{
            mb: 0,
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#0a1f83",
          }}
        >
          Update Attendance Location
        </Typography>
      </Card.Header>

      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        {/* Location Name */}
        <Card style={{ width: "30rem", marginTop: "20px" }}>
          <Card.Header>Attendance Location Name</Card.Header>
          <Card.Body className="d-flex flex-column align-items-center">
            <Form.Control
              ref={locationRef}
              type="text"
              placeholder="Enter Location Name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            {errors.locationName && (
              <small className="text-danger mt-1">{errors.locationName}</small>
            )}
          </Card.Body>
        </Card>

        {/* Latitude */}
        <Card style={{ width: "30rem", marginTop: "20px" }}>
          <Card.Header>Latitude</Card.Header>
          <Card.Body className="d-flex flex-column align-items-center">
            <Form.Control
              ref={latitudeRef}
              type="number"
              placeholder="Enter Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            {errors.latitude && (
              <small className="text-danger mt-1">{errors.latitude}</small>
            )}
          </Card.Body>
        </Card>

        {/* Longitude */}
        <Card style={{ width: "30rem", marginTop: "20px" }}>
          <Card.Header>Longitude</Card.Header>
          <Card.Body className="d-flex flex-column align-items-center">
            <Form.Control
              ref={longitudeRef}
              type="number"
              placeholder="Enter Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            {errors.longitude && (
              <small className="text-danger mt-1">{errors.longitude}</small>
            )}
          </Card.Body>
        </Card>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-center gap-2">
        <Button component={Link} to="/editLocation" className="cancel-button">
          Cancel
        </Button>
        <Button onClick={updateCordinates} className="blue-button">
          Update
        </Button>
      </Card.Footer>
      {/* Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </Card>
  );
}

export default UpdateLocation;
