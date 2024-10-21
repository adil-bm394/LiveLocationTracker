import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import LocationControls from "../components/LocationControls";

const socket = io("http://localhost:8000");

const LocationTracker: React.FC = () => {
  const [tracking, setTracking] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<NodeJS.Timeout | null>(null);
  const [prevCoords, setPrevCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [totalDistance, setTotalDistance] = useState<number>(0);

  const trackLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(
          `[LocationTracker] Current lat:lon => ${latitude},${longitude}`
        );

        setPrevCoords((prev) => {
          const newCoords = { latitude, longitude };

          if (
            !prev ||
            prev.latitude !== latitude ||
            prev.longitude !== longitude
          ) {
            console.log(
              `[LocationTracker] Sending updated coordinates: lat:lon => ${latitude},${longitude}`
            );
            socket.emit("location", newCoords);
            return newCoords; 
          }

          return prev;
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const startTracking = () => {
    if (!tracking) {
      setTracking(true);
      trackLocation();

      const intervalId = setInterval(trackLocation, 4000);
      setWatchId(intervalId);
    }
  };

  const stopTracking = () => {
    if (tracking && watchId !== null) {
      clearInterval(watchId);
      socket.emit("stopTracking");
      setTracking(false);
      setWatchId(null);
      setPrevCoords(null);
    }
  };

  useEffect(() => {
    socket.on("totalDistance", (distance: number) => {
      setTotalDistance(distance);
      console.log(`Total distance: ${distance} km`);
    });

    return () => {
      socket.off("totalDistance");
      if (watchId) {
        clearInterval(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    console.log("Updated prevCoords:", prevCoords);
  }, [prevCoords]);

  return (
    <LocationControls
      tracking={tracking}
      startTracking={startTracking}
      stopTracking={stopTracking}
      totalDistance={totalDistance}
    />
  );
};

export default LocationTracker;

