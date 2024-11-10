import React, { useEffect, useState } from "react";
import table from "../../../assets/icon/table.png";
const Restaurant = ({ user, setUser, token, socket }) => {
  const [store, setStore] = useState(user.data[0]);
  useEffect(() => {
    console.log(store);
    if (socket) {
      socket.on("order-update", (data) => {
        console.log("Order update received:", data);
      });
      return () => {
        socket.off("order-update");
      };
    }
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setStartPosition({
      x: position.x, // Giữ nguyên vị trí X ban đầu
      y: touch.clientY - position.y, // Lấy tọa độ Y ban đầu
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition((prev) => ({
      x: prev.x, // Giữ nguyên vị trí X
      y: touch.clientY - startPosition.y, // Cập nhật vị trí Y
    }));
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };
  return (
    <div className="store-container">
      <div className="left">
        <div className="top-container">
          <div className="top-nav">
            <div className="left-nav">
              <div className="logo">
                <div className="icon">
                  <img src={store?.avatar} />
                </div>
              </div>
              <div className="name">
                <div className="name-store">{store?.name}</div>
                <div className="name-rate">{store?.mohinh}</div>
                <div className="name-location">
                  <i className="fa-solid fa-location-dot"></i>
                  {store?.address}
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
        </div>
        <div className="body-container">
          <div className="layout">
            {store?.layouts.map((layout) => (
              <div key={layout.id} className="layout">
                {layout.groups.map((group) => (
                  <div key={group.id} className="room">
                    <div className="room-name">
                      <div className="name">{group.name}</div>
                    </div>
                    <div className="room-layout">
                      {group.spaces.map((space) => (
                        <div key={space.id} className="table">
                          <div className="status">
                            {space.is_ordering ? "Đã đặt" : "Trống"}
                          </div>
                          <div className="icon">
                            <img src={table} alt="Table Icon" />
                          </div>
                          <div className="name">{space.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="tools-bar"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            position: "absolute",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="items">
            <div className="icon">
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <div className="items">
            <div className="icon">
              <i className="fa-solid fa-comments"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="right-hide"></div>
    </div>
  );
};

export default Restaurant;
