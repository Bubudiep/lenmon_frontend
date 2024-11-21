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
import _ from "lodash";
import { io } from "socket.io-client";
import api from "../../../components/api";
import Restaurant_order from "./restaurant/res-order";
const Restaurant = ({ user, setUser, token }) => {
  const [store, setStore] = useState(user.data[0]);
  const [config, setConfig] = useState(false);
  const [tabs, setTabs] = useState("dashboard");
  const COMPONENT_MAP = {
    menu: Restaurant_menu_config,
    report: Restaurant_menu_report,
    config: Restaurant_menu_gear,
    Order: Restaurant_ordering,
    Chatroom: Restaurant_chatroom,
    QRcode: Restaurant_QRcode,
  };
  const updateStore = (data) => {
    setStore((prevStore) => {
      const updatedStore = { ...prevStore };
      updatedStore.layouts = updatedStore.layouts.map((layout) => {
        layout.groups = layout.groups.map((group) => {
          group.spaces = group.spaces.map((space) => {
            if (space.id === data.id) {
              return { ...space, ...data }; // Cập nhật dữ liệu mới
            }
            return space; // Trả về space không thay đổi
          });
          return group; // Trả về group đã được cập nhật
        });
        return layout; // Trả về layout đã được cập nhật
      });
      return updatedStore; // Cập nhật state store
    });
  };
  const ComponentToRender = COMPONENT_MAP[config] || null;
  useEffect(() => {
    const newSocket = io("http://" + location.hostname + ":3009", {
      transports: ["websocket"],
    });
    const key = store.sockets[0].QRKey;
    newSocket.on("connect", () => {
      console.log("Connected to socket server on port 3009");
      newSocket.emit("join room", key, (mes) => {
        console.log(`Joined room with key: ${key}: ${mes}`);
        newSocket.on("message", (data) => {
          console.log("Received message:", data);
          if (data.data.type == "order" && data.data.data.space) {
            api
              .get(`/restaurant-space/${data.data.data.space}/`, token)
              .then((res) => {
                updateStore(res);
                setStore((prevStore) => ({
                  ...prevStore, // Giữ nguyên các thuộc tính khác
                  orders: prevStore.orders.some(
                    (preoder) => preoder.id === data.data.data.id
                  )
                    ? prevStore.orders.map(
                        (preoder) =>
                          preoder.id === data.data.data.id
                            ? { ...preoder, ...data.data.data } // Cập nhật nếu ID trùng
                            : preoder // Giữ nguyên nếu ID không trùng
                      )
                    : [...prevStore.orders, data.data.data], // Thêm mới nếu ID không trùng
                }));
              })
              .catch((er) => {
                console.log(er);
              })
              .finally(() => {});
          } else {
            setStore((prevStore) => ({
              ...prevStore, // Giữ nguyên các thuộc tính khác
              orders: prevStore.orders.some(
                (preoder) => preoder.id === data.data.data.id
              )
                ? prevStore.orders.map(
                    (preoder) =>
                      preoder.id === data.data.data.id
                        ? { ...preoder, ...data.data.data } // Cập nhật nếu ID trùng
                        : preoder // Giữ nguyên nếu ID không trùng
                  )
                : [...prevStore.orders, data.data.data], // Thêm mới nếu ID không trùng
            }));
          }
        });
        newSocket.on("private_event", (data) => {
          console.log("Private message:", data);
        });
      });
    });
    newSocket.on("disconnect", () => {
      console.log("Disconnected to socket server on port 3009");
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
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
          <Restaurant_top
            setTabs={setTabs}
            tabs={tabs}
            store={store}
            setConfig={setConfig}
          />
        </div>
        <div className="body-container">
          {tabs === "dashboard" ? (
            <Restaurant_layout store={store} />
          ) : tabs === "menu" ? (
            <Restaurant_menu
              store={store}
              updateStore={updateStore}
              token={token}
              setStore={setStore}
            />
          ) : (
            <Restaurant_order
              store={store}
              updateStore={updateStore}
              token={token}
              setStore={setStore}
            />
          )}
        </div>
      </div>
      <div className="right-hide"></div>
    </div>
  );
};

export default Restaurant;
