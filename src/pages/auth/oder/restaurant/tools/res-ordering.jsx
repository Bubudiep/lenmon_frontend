import React, { useRef, useState } from "react";
import api from "../../../../../components/api";
import Restaurant_ordering_view from "./res-ordering_view";

const Restaurant_ordering = ({ onClose, store, setStore, token }) => {
  const [isFadeout, setIsFadeout] = useState(false);
  const [activeTab, setActiveTab] = useState("waiting");
  const timer = useRef(null);
  const handleClose = () => {
    setIsFadeout(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };
  // Hàm chuyển đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div className="bg-full">
        <div
          className={`detectOut ${isFadeout ? "fadeOut" : ""}`}
          onClick={handleClose}
        />
        <div className={`view-box ${isFadeout ? "slideOut" : ""}`}>
          <div className="title3">
            <div className="tname">Đơn hàng</div>
            <div className="tab">
              <div
                className={`items ${activeTab === "waiting" ? "active" : ""}`}
                onClick={() => handleTabChange("waiting")}
              >
                Đơn thường
              </div>
              <div
                className={`items ${activeTab === "unpaid" ? "active" : ""}`}
                onClick={() => handleTabChange("unpaid")}
              >
                Đơn online
              </div>
              <div
                className={`items ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => handleTabChange("completed")}
              >
                Đã xong
              </div>
            </div>
          </div>
          <div className="body-box">
            <div className="main-view-box menu-order">
              <Restaurant_ordering_view option={activeTab} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_ordering;
