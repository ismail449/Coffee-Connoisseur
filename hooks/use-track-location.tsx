import { useState } from "react";

const useTrackLocation = () => {
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [latLong, setLatLong] = useState({ lat: 0, long: 0 });
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLatLong({ lat: latitude, long: longitude });
    setLocationErrorMessage("");
    setIsFindingLocation(false);
  };
  const error = () => {
    setLocationErrorMessage("Unable to retrieve your location");
    setIsFindingLocation(false);
  };
  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMessage("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      //status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return {
    latLong,
    handleTrackLocation,
    locationErrorMessage,
    isFindingLocation,
  };
};

export default useTrackLocation;
