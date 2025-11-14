import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { Link } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WeekendIcon from "@mui/icons-material/Weekend";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Correction Application",
    link: "/correctionApplication",
    icon: <EditNoteIcon fontSize="large" color="primary" />,
  },
  {
    title: "Shift Change",
    link: "/shiftChange",
    icon: <ScheduleIcon fontSize="large" color="secondary" />,
  },
  {
    title: "Weekly Rest (Outsource)",
    link: "/outsourceWeeklyRest",
    icon: <WeekendIcon fontSize="large" color="success" />,
  },
];

function ReportingOfficerDashboard() {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          gutterBottom
          variant="h3"
          sx={{
            textAlign: "center",
            color: "#0d47a1",
            fontWeight: "bold",
            mb: 4,
            fontFamily: "serif",
          }}
        >
          Reporting Officer
        </Typography>
      </motion.div>
      <div style={{ marginBottom: "30px" }}>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 2 }}
        >
          {cards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Link to={card.link} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    height: "100%",
                    p: 2,
                    textAlign: "center",
                    boxShadow: 3,
                    borderRadius: 3,
                    transition: "0.3s",
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #e8ebef 100%)",
                    color: "#0d47a1",
                    "&:hover": {
                      boxShadow: 6,
                      backgroundColor: "#f1f8ff",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 48,
                      color: "#1a237e",
                      mb: 1,
                      "& svg": { fontSize: 48 },
                    }}
                  >
                    {card.icon}
                  </Box>

                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#1a237e" }}
                    >
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
}

export default ReportingOfficerDashboard;
