import React from "react";

const Restaurant_top = ({ store }) => {
  return (
    <div className="top-nav">
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
          <div className="items">
            <div className="icon">
              <i className="fa-solid fa-bell-concierge"></i>
            </div>
          </div>
          <div className="items">
            <div className="icon">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
          </div>
          <div className="items">
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
