import React from "react";
import Restaurant_tools from "./res-tools";

const Restaurant_top = ({ store, setConfig }) => {
  return (
    <div className="top-nav">
      <Restaurant_tools setConfig={setConfig} />
      <div className="left-nav">
        <div className="logo">
          <div className="icon">
            <img src={store?.avatar} />
          </div>
        </div>
        <div className="name">
          <div className="name-store">{store?.name}</div>
          <div className="name-rate">{store?.mohinh ?? "Quán mới"}</div>
          <div className="name-location">
            <i className="fa-solid fa-location-dot"></i>
            <div className="address">{store?.address}</div>
          </div>
        </div>
      </div>
      <div className="right-nav">
        <div className="tools">
          <div
            className="items"
            onClick={() => {
              setConfig("menu");
            }}
          >
            <div className="icon">
              <i className="fa-solid fa-bell-concierge"></i>
            </div>
          </div>
          <div
            className="items"
            onClick={() => {
              setConfig("report");
            }}
          >
            <div className="icon">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
          </div>
          <div
            className="items"
            onClick={() => {
              setConfig("config");
            }}
          >
            <div className="icon">
              <i className="fa-solid fa-gears"></i>
            </div>
          </div>
        </div>

        <div className="options-nav">
          <div></div>
          <div className="options">
            {store?.isChat && (
              <div className="items">
                <div className="icon">
                  <i className="fa-solid fa-comments"></i>
                </div>
              </div>
            )}
            {store?.Takeaway && (
              <div className="items">
                <div className="icon">
                  <i className="fa-solid fa-motorcycle"></i>
                </div>
              </div>
            )}
            {store?.Oder_online && (
              <div className="items">
                <div className="icon">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
              </div>
            )}
            {store?.isRate && (
              <div className="items">
                <div className="icon">
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant_top;
