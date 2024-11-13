import React, { useEffect, useRef, useState } from "react";
import Restaurant from "../restaurant";
import api from "../../../../components/api";

const Restaurant_menu_config = ({ onClose, store, setStore, token }) => {
  const [isFadeout, setIsFadeout] = useState(false);
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]); // Initial group as an example
  const [marks, setMarks] = useState([]); // Initial group as an example
  const timer = useRef(null);
  const handleClose = () => {
    setIsFadeout(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  // Function to handle adding a new item
  const handleAddItem = () => {
    api
      .post(
        "/res-items/",
        {
          menu: store.menu[0].id,
          name: null,
          group: [groups[0]],
          mark: ["Mới"],
        },
        token
      )
      .then((response) => {
        setStore((prevStore) => ({
          ...prevStore,
          menu: prevStore.menu.map((menu, index) =>
            index === 0
              ? {
                  items: [response, ...menu.items], // Append the new item to menu items
                  ...menu,
                }
              : menu
          ),
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("Done");
      });
  };

  // Function to handle adding a new group
  const handleAddGroup = () => {
    const newGroup = prompt("Enter group name:");
    if (newGroup) {
      setGroups([...groups, newGroup]);
    }
  };

  const handleImageChange = (e, index, itemId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const fullImageBase64 = api.resizeImage(img, 500);
          const miniImageBase64 = api.resizeImage(img, 250);
          const newItems = [...items];
          newItems[index].image64_mini = miniImageBase64;
          setItems(newItems);
          api
            .patch(
              `/res-items/${itemId}/`,
              { image64_mini: miniImageBase64, image64_full: fullImageBase64 },
              token
            )
            .then((response) => {
              // Update the store with the new data
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
      };

      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (store && store.menu) {
      const initialGroups = store.menu[0].group
        ? store.menu[0].group.map((g) => g.name)
        : [];
      const initialMarks = store.menu[0].mark
        ? store.menu[0].mark.map((m) => m.name)
        : [];
      const initialItems = store.menu[0].items ? store.menu[0].items : [];
      setGroups(initialGroups);
      setMarks(initialMarks);
      setItems(initialItems);
    }
  }, [store]);
  const handleDelete = (itemId) => {
    const userConfirmed = confirm("Món ăn sẽ bị xóa khỏi menu!");
    if (userConfirmed) {
      api
        .patch(`/res-items/${itemId}/`, { is_delete: true }, token)
        .then((response) => {
          setStore((prevStore) => ({
            ...prevStore,
            menu: prevStore.menu.map((menu) => ({
              ...menu,
              items: menu.items.filter((item) => item.id !== response.id),
            })),
          }));
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    }
  };
  const handleDeactive = (itemId) => {
    const userConfirmed = confirm("Món ăn sẽ bị gỡ xuống khỏi menu!");
    if (userConfirmed) {
      api
        .patch(`/res-items/${itemId}/`, { is_active: false }, token)
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
  return (
    <>
      <div className="bg-full">
        <div
          className={`detectOut ${isFadeout ? "fadeOut" : ""}`}
          onClick={handleClose}
        />
        <div className={`view-box ${isFadeout ? "slideOut" : ""}`}>
          <div className="title2">
            <div className="tname">Thực đơn</div>
            <div className="tools">
              <button className="add" onClick={handleAddItem}>
                Thêm món
              </button>
              <button className="add" onClick={handleAddGroup}>
                Thêm nhóm
              </button>
            </div>
          </div>
          <div className="body-box">
            <div className="main-view-box menu-config">
              <div className="hint">Bấm vào ảnh để cài đặt chi tiết</div>
              {items
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => b.is_active - a.is_active) // Sort active items to the top
                .map((item, index) =>
                  item.is_active ? (
                    <div key={index} className="items">
                      <div className="logo">
                        <label className="img">
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleImageChange(e, index, item.id)
                            }
                          />
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
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newItems = [...items];
                              newItems[index].name = newValue;
                              setItems(newItems); // Update local state immediately for user feedback
                              clearTimeout(timer.current);
                              timer.current = setTimeout(() => {
                                handleChange(item.id, "name", newValue);
                              }, 1000); // 1000ms delay
                            }}
                            placeholder="Tên món"
                          />
                        </div>
                        <div className="c-name">
                          <input
                            type="text"
                            className="price"
                            value={item.price.toLocaleString("vi-VN")}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              let numericValue =
                                parseInt(newValue.replaceAll(".", "")) || 0;
                              if (numericValue > 1000000) {
                                numericValue = 1000000;
                              }
                              const formattedValue =
                                numericValue.toLocaleString("vi-VN");
                              const newItems = [...items];
                              newItems[index].price = numericValue;
                              setItems(newItems);
                              clearTimeout(timer.current);
                              timer.current = setTimeout(() => {
                                handleChange(item.id, "price", numericValue);
                              }, 1000);
                            }}
                            placeholder="Giá"
                          />
                          <div className="init">VNĐ</div>
                        </div>
                        <div className="c-group">
                          <select
                            value={item.group_names[0]}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].group_names[0] = e.target.value;
                              setItems(newItems);
                              handleChange(item.id, "group", [e.target.value]);
                            }}
                          >
                            {groups.map((group, idx) => (
                              <option key={idx} value={group}>
                                {group}
                              </option>
                            ))}
                          </select>
                          <button
                            className="down"
                            onClick={() => {
                              handleDeactive(item.id);
                            }}
                          >
                            Gỡ
                          </button>
                          <button
                            className="remove"
                            onClick={() => {
                              handleDelete(item.id);
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="items inactive">
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
                            {groups.map((group, idx) => (
                              <option key={idx} value={group}>
                                {group}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_menu_config;
