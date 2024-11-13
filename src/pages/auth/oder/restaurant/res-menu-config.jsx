import React, { useState } from "react";
import Restaurant from "../restaurant";

const Restaurant_menu_config = ({ onClose }) => {
  const [isFadeout, setIsFadeout] = useState(false);
  const handleClose = () => {
    setIsFadeout(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };
  return (
    <>
      <div className="bg-full">
        <div
          className={`detectOut ${isFadeout ? "fadeOut" : ""}`}
          onClick={handleClose}
        />
        <div className={`view-box ${isFadeout ? "slideOut" : ""}`}>
          <div className="title2">
            <div className="tname">Thực đơn</div>
            <div className="tools">
              <button className="add">Thêm món</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_menu_config;
