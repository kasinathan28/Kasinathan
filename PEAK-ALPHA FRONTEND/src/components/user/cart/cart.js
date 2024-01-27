import React from "react";
import "./cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { Navigate, useNavigate } from "react-router-dom";
export default function Cart() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="cart">
      <div className="navbar">
        <div className="left-section">
          <button className="backbtn" onClick={handleBack}>
            Back
          </button>
          <h1>
            PEAK
            <FontAwesomeIcon icon={faAtlassian} style={{ color: "#132e35" }} />
            LPHA
          </h1>
        </div>
      </div>

      <div className="main">
        <div className="heading">
            <h1>
                Your cart
            </h1>
        </div>
            <div className="bar"/>
      </div>
    </div>
  );
}
