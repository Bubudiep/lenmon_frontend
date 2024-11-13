import React from "react";
import api from "../../../../../components/api";

const Items_inactive = ({ item, setStore, token }) => {
  const handleActive = (itemId) => {
    const userConfirmed = confirm("Món này sẽ hiển thị lại trên menu đặt món!");
    if (userConfirmed) {
      api
        .patch(`/res-items/${itemId}/`, { is_active: true }, token)
        .then((response) => {
          setStore((prevStore) => ({
            ...prevStore,
            menu: prevStore.menu.map((menu) => ({
              ...menu,
              items: menu.items.map((item) =>
                item.id === itemId ? response : item
              ),
            })),
          }));
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    }
  };
  return (
    <>
      <div
        className="mask"
        onClick={() => {
          handleActive(item.id);
        }}
      ></div>
      <div className="status-mark">Đã gỡ xuống</div>
      <div className="logo">
        <label className="img">
          <img
            src={item.image64_mini || "placeholder-image.png"}
            alt="item"
            style={{ cursor: "pointer" }}
          />
        </label>
      </div>
      <div className="config">
        <div className="c-name">
          <input
            type="text"
            className="name"
            value={item.name}
            placeholder="Tên món"
            disabled
          />
        </div>
        <div className="c-name">
          <input
            type="text"
            className="price"
            value={item.price.toLocaleString("vi-VN")}
            placeholder="Giá"
            disabled
          />
          <div className="init">VNĐ</div>
        </div>
        <div className="c-group">
          <select value={item.group_names[0]} disabled>
            <option value={item.group_names[0]}>{item.group_names[0]}</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Items_inactive;
