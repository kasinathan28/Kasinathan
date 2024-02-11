import React from "react";
import "./Loader.css"; // You can define your loader styles in Loader.css
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";

import AnimationSVG from "../../assets/loader gitf.gif";

function Loader() {
  return (
    <div className="loaderPage">
      <div className="loader-container">
        <div className="logo">
          <h1>
            PEAK
            <FontAwesomeIcon
              icon={faAtlassian}
              className="icon"
              style={{ color: "#dfc8ea" }}
            />
            LPHA
          </h1>
        </div>
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loader;
