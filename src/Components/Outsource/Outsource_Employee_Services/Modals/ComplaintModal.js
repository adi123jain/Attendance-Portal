import React, { useEffect, useState, useRef } from "react";
import { Backdrop, Typography } from "@mui/material";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { getComplaintType, updateComplaint, } from "../../../../Services/Auth";
import { PropagateLoader } from "react-spinners";

export default function ComplaintModal({ open, onClose, empCode }) {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState("");
    const [remark, setRemark] = useState("");
    const [errors, setErrors] = useState({});
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const complaintRef = useRef(null);
    const remarkRef = useRef(null);

    // Fetch ComplaintType  on mount
    useEffect(() => {
        const fetchComplaintType = async () => {
            try {
                const response = await getComplaintType();
                setComplaints(response.data.list || []);
            } catch (err) {
                console.error("Error fetching complaints:", err);
            }
        };
        fetchComplaintType();
    }, []);

    const complaintSubmit = async () => {
        const newErrors = {};

        if (!selectedComplaint) newErrors.selectedComplaint = "*Please select a complaint.";
        if (!remark.trim()) newErrors.remark = "*Please enter remarks.";

        setErrors(newErrors);

        // Focus on first invalid field
        if (Object.keys(newErrors).length > 0) {
            if (newErrors.selectedComplaint) {
                complaintRef.current.focus();
            } else if (newErrors.remark) {
                remarkRef.current.focus();
            }
            return;
        }

        setOpenBackdrop(true);

        try {
            const payload = {
                empCode,
                complaintTypeId: selectedComplaint,
                remark: remark,
                hrEmpCode: sessionStorage.getItem("empCode"),
            };
            console.log(payload);

            const response = await updateComplaint(payload);
            console.log(response);
            if (response.data.code == "200") {
                alert("Complaint Updated !!")
                onClose();
            } else {
                alert(response.data.message)
                setOpenBackdrop(false);
            }

        } catch (err) {
            console.error(err);
            setErrors({ submit: "Failed to update complaint." });
            setOpenBackdrop(false);
        }
    };
    return (
        <>
            <Modal show={open} onHide={onClose} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary fw-bold">
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#0a1f83",
                                fontFamily: "serif",
                                fontWeight: "bold",
                            }}
                        >
                            Register Complaint - ({empCode})
                        </Typography>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="container">
                        {/* Select Complaint */}
                        <Card className="mb-3">
                            <Card.Header className="bg-light fw-semibold">Select Complaint</Card.Header>
                            <Card.Body>
                                <Form.Select
                                    value={selectedComplaint}
                                    onChange={(e) => setSelectedComplaint(e.target.value)}
                                    ref={complaintRef}
                                    isInvalid={!!errors.selectedComplaint}
                                >
                                    <option value="" disabled>
                                        -- select Complaint --
                                    </option>
                                    {complaints.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">

                                    <Typography variant="caption">
                                        {errors.selectedComplaint}
                                    </Typography>
                                </Form.Control.Feedback>
                            </Card.Body>
                        </Card>

                        {/* Remarks */}
                        <Card>
                            <Card.Header className="bg-light fw-semibold">Remarks</Card.Header>
                            <Card.Body>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Enter Remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    ref={remarkRef}
                                    isInvalid={!!errors.remark}
                                />
                                <Form.Control.Feedback type="invalid">{errors.remark}</Form.Control.Feedback>
                            </Card.Body>
                        </Card>

                        {/* Submit error */}
                        {errors.submit && (
                            <div className="text-danger mt-2" style={{ fontSize: "0.9rem" }}>
                                <Typography variant="caption">
                                    {errors.submit}
                                </Typography>
                            </div>
                        )}
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
                        onClick={complaintSubmit}
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

            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <PropagateLoader />
            </Backdrop>
        </>
    );
}
