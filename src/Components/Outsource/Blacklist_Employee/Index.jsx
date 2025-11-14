import React, { useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Typography, Button } from "@mui/material";
import SearchUtils from "../../../Constants/Search_Utils/Index";
import { employeeBlacklist } from "../../../Services/Auth";

function BlacklistEmployee() {
  const regionRef = useRef(null);
  const fullNameRef = useRef(null);
  const aadharRef = useRef(null);
  const dateRef = useRef(null);
  const remarkRef = useRef(null);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    aadharNo: "",
    dateOfBlacklist: "",
    remarks: "",
  });

  const [searchValues, setSearchValues] = useState({
    region: "",
    circle: "",
    division: "",
    subDivision: "",
    dc: "",
    subStation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "*Full Name is required";
    if (!formData.aadharNo.trim())
      newErrors.aadharNo = "*Aadhaar Number is required";
    else if (formData.aadharNo.length !== 12)
      newErrors.aadharNo = "*Aadhaar must be 12 digits";
    if (!formData.dateOfBlacklist)
      newErrors.dateOfBlacklist = "*Date is required";
    if (!formData.remarks.trim()) newErrors.remarks = "*Remark is required";
    if (!searchValues.region) newErrors.region = "*Region is required";

    setErrors(newErrors);

    // Focus on first invalid field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.fullName) fullNameRef.current?.focus();
      else if (newErrors.aadharNo) aadharRef.current?.focus();
      else if (newErrors.dateOfBlacklist) dateRef.current?.focus();
      else if (newErrors.region) regionRef.current?.focus();
      else if (newErrors.remarks) remarkRef.current?.focus();
      return false;
    }

    return true;
  };

  const formatDateToCustom = (inputDate) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleBlackList = async () => {
    if (!validateForm()) return;

    const payload = {
      aadharNo: formData.aadharNo,
      fullName: formData.fullName,
      dateOfBlacklist: formatDateToCustom(formData.dateOfBlacklist),
      regionId: searchValues.region,
      circleId: searchValues.circle,
      divisionId: searchValues.division,
      subDivisionId: searchValues.subDivision,
      dcId: searchValues.dc,
      substationId: searchValues.subStation,
      remarks: formData.remarks,
      updatedBy: sessionStorage.getItem("empCode"),
    };

    try {
      const response = await employeeBlacklist(payload);
      console.log("Response:", response);
      if (response.code == "200") {
        alert(response.data.message);
        window.location.reload();
      } else {
        alert(response.data.message);
      }
      // Reset form if needed
    } catch (err) {
      console.error("Error while blacklisting:", err);
      alert("Error during submission. Please try again.");
    }
  };

  return (
    <Card>
      <Card.Header className="text-center text-primary">
        <Typography
          variant="h4"
          sx={{
            color: "#0a1f83",
            mb: 2,
            fontFamily: "serif",
            fontWeight: "bold",
          }}
        >
          Blacklist Employee's (Outsource)
        </Typography>
      </Card.Header>
      <Card.Body>
        <div className="row row-cols-1 row-cols-md-3 g-3 mt-2">
          <div className="col">
            <Card>
              <Card.Header>Full Name</Card.Header>
              <Card.Body>
                <Form.Control
                  ref={fullNameRef}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Full Name"
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>

          <div className="col">
            <Card>
              <Card.Header>Aadhaar Number</Card.Header>
              <Card.Body>
                <Form.Control
                  ref={aadharRef}
                  name="aadharNo"
                  value={formData.aadharNo}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter Aadhaar Number"
                  isInvalid={!!errors.aadharNo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.aadharNo}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>

          <div className="col">
            <Card>
              <Card.Header>Date of Blacklist</Card.Header>
              <Card.Body>
                <Form.Control
                  ref={dateRef}
                  name="dateOfBlacklist"
                  value={formData.dateOfBlacklist}
                  onChange={handleChange}
                  type="date"
                  isInvalid={!!errors.dateOfBlacklist}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateOfBlacklist}
                </Form.Control.Feedback>
              </Card.Body>
            </Card>
          </div>
        </div>

        <SearchUtils
          values={searchValues}
          setValues={setSearchValues}
          errors={errors}
          refs={{ region: regionRef }}
        />

        <Card className="mt-2">
          <Card.Header>Enter Remark</Card.Header>
          <Card.Body>
            <Form.Control
              ref={remarkRef}
              as="textarea"
              rows={5}
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remark"
              isInvalid={!!errors.remarks}
            />
            <Form.Control.Feedback type="invalid">
              {errors.remarks}
            </Form.Control.Feedback>
          </Card.Body>
        </Card>
      </Card.Body>

      <Card.Footer className="justify-content-center d-flex gap-2 p-3">
        <Button variant="outlined" className="cancel-button">
          Cancel
        </Button>
        <Button
          variant="outlined"
          className="blue-button"
          onClick={handleBlackList}
        >
          Submit
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default BlacklistEmployee;
