import React, { useRef, useState } from "react";
import api from "../../../../../components/api";

const Restaurant_chatroom = ({ onClose, store, setStore, token }) => {
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
          <div className="title">
            <div className="tname">Phòng Chat</div>
          </div>
          <div className="body-box">
            <div className="main-view-box menu-config"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_chatroom;
