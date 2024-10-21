import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { LocationControlsProps } from "../utils/interfaces/types";

const LocationControls: React.FC<LocationControlsProps> = ({
  tracking,
  startTracking,
  stopTracking,
  totalDistance,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw", 
        textAlign: "center",
        bgcolor: "#f9f9f9",
      }}
    >
      <Typography variant="h6">Tracking location.......</Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={startTracking}
          disabled={tracking}
          sx={{ mr: 1 }}
        >
          Start Tracking
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopTracking}
          disabled={!tracking}
        >
          Stop Tracking
        </Button>
      </Box>
      {totalDistance >= 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Total distance traveled: {totalDistance.toFixed(2)} km
        </Typography>
      )}
    </Box>
  );
};

export default LocationControls;
