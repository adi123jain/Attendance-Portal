import React, { useEffect, useState, useRef } from "react";
import { Backdrop, Typography } from "@mui/material";
import { Modal, Button, Card, Form, Row, Col } from "react-bootstrap";
import { getRegion, getCircle, uploadWiremanCertificate } from "../../../../Services/Auth";
import { PropagateLoader } from "react-spinners";

export default function UploadCertificateModal({ open, onClose, empCode }) {
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [regions, setRegions] = useState([]);
    const [circles, setCircles] = useState([]);

    const [certificateNo, setCertificateNo] = useState("");
    const [date, setDate] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCircle, setSelectedCircle] = useState("");
    const [file, setFile] = useState(null);

    const [errors, setErrors] = useState({});

    // refs for focusing invalid fields
    const certRef = useRef();
    const dateRef = useRef();
    const regionRef = useRef();
    const circleRef = useRef();
    const fileRef = useRef();

    // Fetch Regions on Mount
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await getRegion();
                setRegions(response.data.list || []);
            } catch (err) {
                console.error("Error fetching regions:", err);
            }
        };
        fetchRegions();
    }, []);

    // Fetch Circles on Region Change
    useEffect(() => {
        const fetchCircles = async () => {
            if (!selectedRegion) return;
            try {
                const response = await getCircle(selectedRegion);
                setCircles(response.data.list || []);
            } catch (err) {
                console.error("Error fetching circles:", err);
            }
        };
        fetchCircles();
    }, [selectedRegion]);

    const validateForm = () => {
        let newErrors = {};

        if (!certificateNo.trim()) newErrors.certificateNo = "Certificate number is required";
        if (!date) newErrors.date = "Date is required";
        if (!selectedRegion) newErrors.region = "Region is required";
        if (!selectedCircle) newErrors.circle = "Circle is required";
        if (!file) {
            newErrors.file = "Document is required";
        } else if (file.type !== "application/pdf") {
            newErrors.file = "Only PDF files are allowed";
        }

        setErrors(newErrors);

        // focus on first error field
        if (Object.keys(newErrors).length > 0) {
            if (newErrors.certificateNo) certRef.current.focus();
            else if (newErrors.date) dateRef.current.focus();
            else if (newErrors.region) regionRef.current.focus();
            else if (newErrors.circle) circleRef.current.focus();
            else if (newErrors.file) fileRef.current.focus();
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("empCode", empCode);
        formData.append("certificateNo", certificateNo);
        formData.append("dateOfIssue", date);
        formData.append("circleId", selectedCircle);
        formData.append("pdf", file);
        formData.append('createdBy', sessionStorage.getItem('empCode'));

        try {
            setOpenBackdrop(true);
            const response = await uploadWiremanCertificate(formData);
            if (response.data.code == "200") {
                alert("Certificate uploaded successfully!");
                setOpenBackdrop(false);
                onClose();
            } else {
                alert(response.data.message)
                setOpenBackdrop(false);
            }

        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Something went wrong!");
            setOpenBackdrop(false);

        } finally {
            setOpenBackdrop(false);
        }
    };

    return (
        <>
            <Modal show={open} onHide={onClose} backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary fw-bold">
                        <Typography
                            variant="h5"
                            sx={{ color: "#0a1f83", fontFamily: "serif", fontWeight: "bold" }}
                        >
                            Upload Certificate - ({empCode})
                        </Typography>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="container">
                        <Row>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Enter Certificate Number</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            ref={certRef}
                                            placeholder="Enter Number"
                                            value={certificateNo}
                                            onChange={(e) => setCertificateNo(e.target.value)}
                                            isInvalid={!!errors.certificateNo}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.certificateNo}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Select Date</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            ref={dateRef}
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            isInvalid={!!errors.date}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.date}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Region</Card.Header>
                                    <Card.Body>
                                        <Form.Select
                                            ref={regionRef}
                                            value={selectedRegion}
                                            onChange={(e) => setSelectedRegion(e.target.value)}
                                            isInvalid={!!errors.region}
                                        >
                                            <option value="" disabled>-- select Region --</option>
                                            {regions.map((item) => (
                                                <option key={item.regionId} value={item.regionId}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.region}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Circle</Card.Header>
                                    <Card.Body>
                                        <Form.Select
                                            ref={circleRef}
                                            value={selectedCircle}
                                            onChange={(e) => setSelectedCircle(e.target.value)}
                                            isInvalid={!!errors.circle}
                                        >
                                            <option value="" disabled>-- select Circle --</option>
                                            {circles.map((item) => (
                                                <option key={item.circleId} value={item.circleId}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.circle}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Upload Document (PDF Only)</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            ref={fileRef}
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            isInvalid={!!errors.file}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.file}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="cancel-button"
                        variant="outlined"
                        onClick={onClose}
                        style={{ borderRadius: "20px", padding: "6px 20px" }}
                        disabled={openBackdrop}
                    >
                        Close
                    </Button>

                    <Button
                        className="green-button"
                        variant="outlined"
                        onClick={handleSubmit}
                        style={{
                            borderRadius: "20px",
                            backgroundColor: "#0a1f83",
                            color: "#fff",
                            padding: "6px 20px",
                            border: "none",
                        }}
                        disabled={openBackdrop}
                    >
                        {openBackdrop ? "Updating..." : "Update"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop}>
                <PropagateLoader />
            </Backdrop>
        </>
    );
}
