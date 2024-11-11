import React, { useEffect, useState } from "react";
import Restaurant_top from "./restaurant/res-top";
import Restaurant_layout from "./restaurant/res-layout";
import Restaurant_tools from "./restaurant/res-tools";
import Restaurant_menu from "./restaurant/res-menu";
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
  return (
    <div className="store-container">
      <div className="left">
        <div className="top-container">
          <Restaurant_top store={store} />
        </div>
        <div className="body-container">
          <div className="action-tab">
            <div className="items">
              <div className="icon">00</div>
              <div className="name">Đang dùng</div>
            </div>
            <div className="items">
              <div className="icon">00</div>
              <div className="name">Đang chờ</div>
            </div>
            <div className="items">
              <div className="icon">00</div>
              <div className="name">Đang ship</div>
            </div>
            <div className="items">
              <div className="icon">00</div>
              <div className="name">Hoàn thành</div>
            </div>
          </div>
          <Restaurant_layout store={store} />
          <Restaurant_menu store={store} />
        </div>
        <Restaurant_tools />
      </div>
      <div className="right-hide"></div>
    </div>
  );
};

export default Restaurant;
