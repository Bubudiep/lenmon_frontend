import React, { useEffect, useState } from "react";
import api from "../../../../components/api";

const Restaurant_menu = ({ store, token, setStore }) => {
  const [groups, setGroups] = useState([]); // Initial group as an example
  const [marks, setMarks] = useState([]); // Initial group as an example
  const [items, setItems] = useState([]);
  const handleChange = (itemId, field, value) => {
    api
      .patch(`/res-items/${itemId}/`, { [field]: value }, token)
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
  };
  useEffect(() => {
    if (store && store.menu) {
      const initialGroups = store.menu[0].group
        ? store.menu[0].group.map((g) => g.name)
        : [];
      const initialMarks = store.menu[0].mark
        ? store.menu[0].mark.map((m) => m.name)
        : [];
      const initialItems = store.menu[0].items
        ? store.menu[0].items.filter((item) => item.is_active)
        : [];
      setGroups(initialGroups);
      setMarks(initialMarks);
      setItems(initialItems);
    }
  }, [store]);
  return (
    <>
      <div className="th3">Thực đơn</div>
      <div className="res-menu">
        {items?.length > 0 ? (
          <div className="menu">
            {items
              .slice() // Create a shallow copy to avoid mutating the original array
              .sort((a, b) => b.is_active - a.is_active) // Sort active items to the top
              .map((item, index) => (
                <div key={item.id} className="items">
                  <div className="image">
                    <div className="icon">
                      <img src={item.image64_mini} />
                    </div>
                  </div>
                  <div className="options">
                    <div
                      className={`status2 ${item?.is_validate ? "active" : ""}`}
                    >
                      {item?.is_validate ? (
                        <i className="fa-solid fa-circle-check"></i>
                      ) : (
                        <>Chờ duyệt</>
                      )}
                    </div>
                    <div className="name">{item.name ?? "Chưa đặt tên"}</div>
                    <div className="price">
                      {item.price.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="status">
                      {item?.is_validate ? (
                        <>
                          <select
                            value={item.is_available}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].is_available = e.target.value;
                              setItems(newItems);
                              handleChange(
                                item.id,
                                "is_available",
                                e.target.value
                              );
                            }}
                          >
                            <option value={false}>Hết</option>
                            <option value={true}>Còn</option>
                          </select>
                          <select
                            value={item.is_online}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].is_online = e.target.value;
                              setItems(newItems);
                              handleChange(
                                item.id,
                                "is_online",
                                e.target.value
                              );
                            }}
                          >
                            <option value={false}>Tắt</option>
                            <option value={true}>Online</option>
                          </select>
                          <select
                            value={item.is_ship}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].is_ship = e.target.value;
                              setItems(newItems);
                              handleChange(item.id, "is_ship", e.target.value);
                            }}
                          >
                            <option value={true}>Ship</option>
                            <option value={false}>Tắt</option>
                          </select>
                        </>
                      ) : (
                        <div className="wait">Chưa online</div>
                      )}
                    </div>
                  </div>
                  {/* <div className="config">
                  <i className="fa-solid fa-gear"></i>
                </div> */}
                </div>
              ))}
          </div>
        ) : (
          <div className="null">
            <div className="icon">
              <i className="fa-solid fa-frog"></i>
            </div>
            <div className="mes">Chưa có món nào</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Restaurant_menu;
