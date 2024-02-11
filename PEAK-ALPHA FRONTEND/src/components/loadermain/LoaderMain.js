import React from 'react';
import './LoaderMain.css'; // You can define your loader styles in Loader.css
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";

// import AnimationSVG from "../../assets/loader gitf.gif";

function LoaderMain() {
  return (
      <div className='loader-container1'>
        <div className="loader"></div>
        <div>
        </div>
      </div>
  );
}

export default LoaderMain;
