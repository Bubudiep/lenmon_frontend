import React, { useRef, useState } from "react";

const Restaurant_QRcode = ({ onClose, store, setStore, token }) => {
  const [isFadeout, setIsFadeout] = useState(false);
  const timer = useRef(null);
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
            <div className="tname">QRCode</div>
            <div className="tools">
              <button>QR Quán</button>
              <button>QR Bàn</button>
            </div>
          </div>
          <div className="body-box">
            <div className="main-view-box menu-config"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_QRcode;
