import React from "react";

const Card = ({ card }) => {
  const imagePath = `/images/${card}.png`;

  return (
    <img
      src={imagePath}
      alt={`${card}`}
      className="card-image"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
      }}
    />
  );
};

export default Card;
