import React, { useState, useRef } from "react";
import { Backdrop, Typography } from "@mui/material";
import { Modal, Button, Card, Form, Row, Col } from "react-bootstrap";
import { deleteWiremanCertificate } from "../../../../Services/Auth";
import { PropagateLoader } from "react-spinners";

export default function DeleteCertificateModal({ open, onClose, empCode }) {
    const [openBackdrop, setOpenBackdrop] = useState(false);

    // Form states
    const [certificateNumber, setCertificateNumber] = useState("");
    const [cancelDate, setCancelDate] = useState("");
    const [cancelRemark, setCancelRemark] = useState("");
    const [cancelFile, setCancelFile] = useState(null);

    const [errors, setErrors] = useState({});

    // Refs for focusing on invalid fields
    const certificateRef = useRef();
    const dateRef = useRef();
    const fileRef = useRef();
    const remarkRef = useRef();

    // Validate form
    const validateForm = () => {
        let newErrors = {};

        if (!certificateNumber.trim()) newErrors.certificateNumber = "Certificate number is required";
        if (!cancelDate) newErrors.cancelDate = "Date is required";

        if (!cancelFile) {
            newErrors.cancelFile = "Document is required";
        } else if (cancelFile.type !== "application/pdf") {
            newErrors.cancelFile = "Only PDF files are allowed";
        }

        if (!cancelRemark.trim()) newErrors.cancelRemark = "Remark is required";

        setErrors(newErrors);

        // focus on first error field
        if (Object.keys(newErrors).length > 0) {
            if (newErrors.certificateNumber) certificateRef.current.focus();
            else if (newErrors.cancelDate) dateRef.current.focus();
            else if (newErrors.cancelFile) fileRef.current.focus();
            else if (newErrors.cancelRemark) remarkRef.current.focus();
            return false;
        }
        return true;
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("certificateNo", certificateNumber);
        formData.append("cancelledOn", cancelDate);
        formData.append("cancelPdf", cancelFile);
        formData.append("cancelRemark", cancelRemark);
        formData.append("cancelledBy", sessionStorage.getItem("empCode"));

        try {
            setOpenBackdrop(true);
            const response = await deleteWiremanCertificate(formData);
            if (response.data.code === "200") {
                alert("Certificate deleted successfully!");
                setOpenBackdrop(false);
                onClose();
            } else {
                alert(response.data.message || "Failed to delete certificate.");
                setOpenBackdrop(false);
            }
        } catch (err) {
            console.error("Error deleting certificate:", err);
            alert("Something went wrong!");
            setOpenBackdrop(false);
        }
    };

    return (
        <>
            <Modal show={open} onHide={onClose} backdrop="static" centered keyboard={false} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary fw-bold">
                        <Typography
                            variant="h5"
                            sx={{ color: "#0a1f83", fontFamily: "serif", fontWeight: "bold" }}
                        >
                            Delete Certificate - ({empCode})
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
                                            ref={certificateRef}
                                            placeholder="Enter Certificate Number"
                                            value={certificateNumber}
                                            onChange={(e) => setCertificateNumber(e.target.value)}
                                            isInvalid={!!errors.certificateNumber}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.certificateNumber}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Select Cancel Date</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            ref={dateRef}
                                            type="date"
                                            value={cancelDate}
                                            onChange={(e) => setCancelDate(e.target.value)}
                                            isInvalid={!!errors.cancelDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cancelDate}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Upload Document (PDF Only)</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            ref={fileRef}
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setCancelFile(e.target.files[0])}
                                            isInvalid={!!errors.cancelFile}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cancelFile}
                                        </Form.Control.Feedback>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-semibold">Enter Remark</Card.Header>
                                    <Card.Body>
                                        <Form.Control
                                            as="textarea"
                                            rows={1}
                                            placeholder="Enter Remark"
                                            value={cancelRemark}
                                            onChange={(e) => setCancelRemark(e.target.value)}
                                            ref={remarkRef}
                                            isInvalid={!!errors.cancelRemark}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.cancelRemark}</Form.Control.Feedback>
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
                        {openBackdrop ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop}>
                <PropagateLoader />
            </Backdrop>
        </>
    );
}
