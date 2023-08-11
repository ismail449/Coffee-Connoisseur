import { useState } from "react";
import { ACTION_TYPES, useStoreContext } from "../context/store-context";

const useTrackLocation = () => {
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const { dispatch } = useStoreContext();
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    dispatch({
      payload: { lat: latitude, long: longitude },
      type: ACTION_TYPES.SET_LAT_LONG,
    });
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
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return {
    handleTrackLocation,
    locationErrorMessage,
    isFindingLocation,
  };
};

export default useTrackLocation;
