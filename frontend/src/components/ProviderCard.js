import React from "react";

function ProviderCard({ name, service, rating }) {
  return (
    <div className="provider-card">
      <h4>{name}</h4>
      <p>{service}</p>
      <span>⭐ {rating}</span>
      <button className="btn small">Book Now</button>
    </div>
  );
}

export default ProviderCard;
