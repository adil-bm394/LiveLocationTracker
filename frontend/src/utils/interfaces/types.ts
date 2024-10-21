export interface LocationControlsProps {
  tracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  totalDistance: number;
}
