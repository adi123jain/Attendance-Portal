import React, { useState, useEffect } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import {
  Typography,
  Tooltip,
  Paper,
  Button,
  TextField,
  Backdrop,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Box,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { Link } from "react-router-dom";

function HigherPayScale() {
  return (
    <>
      <Card className="shadow-lg rounded mt-4">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontFamily: "serif",
              fontWeight: "bold",
              color: "#0a1f83",
            }}
          >
            Service Particulars of Employees Seeking Benefit Under 9/18/25 Years
            Rules (To be sumitted in triplicate)
          </Typography>
        </Card.Header>

        <Card.Body></Card.Body>
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
            // onClick={submitImmovableForm}
          >
            Submit
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}

export default HigherPayScale;
