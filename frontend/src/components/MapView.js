import React from "react";
import config from "../config";

function MapView() {
  return (
    <div className="map">
      <iframe
        title="google-map"
        width="100%"
        height="300"
        loading="lazy"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${config.GOOGLE_MAPS_KEY}&q=Hyderabad`}
      ></iframe>
    </div>
  );
}

export default MapView;
