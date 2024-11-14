import React, { useRef, useState } from "react";
import api from "../../../../components/api";

const Restaurant_menu_gear = ({ onClose, store, setStore, token }) => {
  const [item, setItem] = useState(store);
  const [isFadeout, setIsFadeout] = useState(false);
  const [isGetlocation, setIsGetlocation] = useState(false);
  const timer = useRef(null);
  const handleClose = () => {
    setIsFadeout(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };
  const handleStore = (field, value) => {
    api
      .patch(`/restaurant/${store.id}/`, { [field]: value }, token)
      .then((response) => {
        setStore(response);
        setItem(response);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  };
  const handleGPS = () => {
    setIsGetlocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await api.getAddress(latitude, longitude);
          handleStore("address", address?.display_name);
          handleStore("address_details", address);
          setIsGetlocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGetlocation(false);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ Geolocation.");
    }
  };
  return (
    <>
      <div className="bg-full">
        <div
          className={`detectOut ${isFadeout ? "fadeOut" : ""}`}
          onClick={handleClose}
        />
        <div className={`view-box ${isFadeout ? "slideOut" : ""}`}>
          <div className="body-box">
            <div className="main-view-box menu-gear">
              <div className="gear-avatar">
                <div className="img">
                  <img src={item?.avatar} />
                </div>
                <div className="gear-option">
                  <div className="name">{item?.name}</div>
                  <div className="phone">
                    <i className="fa-solid fa-square-phone-flip"></i>
                    <input
                      placeholder="Điện thoại"
                      value={item?.phone_number}
                      maxLength={10}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setItem((prevItem) => ({
                          ...prevItem,
                          phone_number: newValue,
                        }));
                        clearTimeout(timer.current);
                        timer.current = setTimeout(() => {
                          handleStore("phone_number", newValue);
                        }, 1000);
                      }}
                    />
                  </div>
                  <div className="address">
                    <i className="fa-solid fa-location-dot"></i>
                    <input
                      placeholder="Địa chỉ"
                      value={item?.address}
                      disabled={isGetlocation}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        clearTimeout(timer.current);
                        timer.current = setTimeout(() => {
                          handleStore("address", newValue);
                        }, 1000);
                      }}
                    />
                    <button onClick={handleGPS} disabled={isGetlocation}>
                      {isGetlocation ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <i className="fa-solid fa-location-crosshairs"></i>
                      )}{" "}
                      Vị trí
                    </button>
                  </div>
                </div>
              </div>
              <div className="restaurant-oa">
                <div className="level">Gian hàng cấp 1</div>
                <div className="items">Yêu cầu xác minh?</div>
                <div className="items">
                  Nâng cấp lên quán nhỏ hoặc hộ kinh doanh?
                </div>
              </div>
              <div className="gear-config">
                <div className="form-data">
                  <div className="config">
                    <div className="items">
                      <div className="name">
                        <div className="value">Hoạt động</div>
                        <div className="hint">Bật/tắt đặt hàng bằng app</div>
                      </div>
                      <div className="option">
                        <input
                          type="checkbox"
                          className="checkboxInput"
                          id="cbx_Active"
                          name="OderOnline"
                          checked={store?.is_active ?? false}
                          onChange={(e) => {
                            handleStore("is_active", e.target.checked);
                          }}
                        />
                        <label htmlFor="cbx_Active" className="toggleSwitch" />
                      </div>
                    </div>
                    <div className="items">
                      <div className="name">
                        <div className="value">Đặt hàng online</div>
                        <div className="hint">
                          Cho phép người dùng tìm và đặt hàng từ trên app
                        </div>
                      </div>
                      <div className="option">
                        <input
                          type="checkbox"
                          className="checkboxInput"
                          id="cbx_OderOnline"
                          name="OderOnline"
                          checked={store?.Oder_online ?? false}
                          onChange={(e) => {
                            handleStore("Oder_online", e.target.checked);
                          }}
                        />
                        <label
                          htmlFor="cbx_OderOnline"
                          className="toggleSwitch"
                        />
                      </div>
                    </div>
                    <div className="items">
                      <div className="name">
                        <div className="value">Order mang về</div>
                        <div className="hint">
                          Đặt hàng tại quầy mà không cần đặt bàn
                        </div>
                      </div>
                      <div className="option">
                        <input
                          type="checkbox"
                          className="checkboxInput"
                          id="cbx_Oder"
                          name="Oder"
                          checked={store?.Takeaway ?? false}
                          onChange={(e) => {
                            handleStore("Takeaway", e.target.checked);
                          }}
                        />
                        <label htmlFor="cbx_Oder" className="toggleSwitch" />
                      </div>
                    </div>
                    <div className="items">
                      <div className="name">
                        <div className="value">Tính năng trò chuyện</div>
                        <div className="hint">
                          Mở chat nhóm cho những khách hàng ngồi tại quán
                        </div>
                      </div>
                      <div className="option">
                        <input
                          type="checkbox"
                          className="checkboxInput"
                          id="cbx_Chat"
                          name="Chat"
                          checked={store?.isChat ?? false}
                          onChange={(e) => {
                            handleStore("isChat", e.target.checked);
                          }}
                        />
                        <label htmlFor="cbx_Chat" className="toggleSwitch" />
                      </div>
                    </div>
                    <div className="items">
                      <div className="name">
                        <div className="value">Đánh giá</div>
                        <div className="hint">
                          Người dùng được phép đánh giá
                        </div>
                      </div>
                      <div className="option">
                        <input
                          type="checkbox"
                          className="checkboxInput"
                          id="cbx_Rate"
                          name="Rate"
                          checked={store?.isRate ?? false}
                          onChange={(e) => {
                            handleStore("isRate", e.target.checked);
                          }}
                        />
                        <label htmlFor="cbx_Rate" className="toggleSwitch" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_menu_gear;
