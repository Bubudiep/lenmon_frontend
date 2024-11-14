import React, { useEffect, useState } from "react";
import Restaurant_top from "./restaurant/res-top";
import Restaurant_layout from "./restaurant/res-layout";
import Restaurant_tools from "./restaurant/res-tools";
import Restaurant_menu from "./restaurant/res-menu";
import Restaurant_menu_config from "./restaurant/res-menu-config";
import Restaurant_menu_report from "./restaurant/res-menu-report";
import Restaurant_menu_gear from "./restaurant/res-menu-gear";
import Restaurant_ordering from "./restaurant/tools/res-ordering";
import Restaurant_chatroom from "./restaurant/tools/res-chat-room";
import Restaurant_QRcode from "./restaurant/tools/res-QRcode";
const Restaurant = ({ user, setUser, token, socket }) => {
  const [store, setStore] = useState(user.data[0]);
  const [config, setConfig] = useState(false);
  const COMPONENT_MAP = {
    menu: Restaurant_menu_config,
    report: Restaurant_menu_report,
    config: Restaurant_menu_gear,
    Order: Restaurant_ordering,
    Chatroom: Restaurant_chatroom,
    QRcode: Restaurant_QRcode,
  };
  const ComponentToRender = COMPONENT_MAP[config] || null;
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
      {config && (
        <ComponentToRender
          store={store}
          setStore={setStore}
          token={token}
          onClose={() => setConfig(false)}
        />
      )}
      <div className="left">
        <div className="top-container">
          <Restaurant_top store={store} setConfig={setConfig} />
        </div>
        <div className="body-container">
          <div className="db-box">
            <div className="action-tab">
              <div className="items">
                <div className="name">Đang dùng</div>
                <div className="icon">00</div>
              </div>
              <div className="items">
                <div className="name">Đang chờ</div>
                <div className="icon">00</div>
              </div>
              <div className="items">
                <div className="name">Đang ship</div>
                <div className="icon">00</div>
              </div>
              <div className="items">
                <div className="name">Hoàn thành</div>
                <div className="icon">00</div>
              </div>
            </div>
          </div>
          <Restaurant_layout store={store} />
          <Restaurant_menu store={store} token={token} setStore={setStore} />
        </div>
      </div>
      <div className="right-hide"></div>
    </div>
  );
};

export default Restaurant;
