import React, { useState } from "react";
import defaul_res from "../../../assets/icon/logo.png";
import api from "../../../components/api";
import table from "../../../assets/icon/table.png";
import Oder from "./../Oder";

const New_restaurant = ({ user, setUser, token }) => {
  const [avatarLabel, setAvatarLabel] = useState("Ảnh đại diện (chưa chọn)"); // Để hiển thị tên ảnh
  const [direction, setDirection] = useState("forward"); // Tracks transition direction
  const [step, setStep] = useState(1);
  const [room, setRoom] = useState(1); // Number of rooms
  const [tablesPerRoom, setTablesPerRoom] = useState({}); // Store table count per room
  const [isGetlocation, setIsGetlocation] = useState(false);
  const [errorMes, setErrorMes] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: "Tên quán ăn",
    avatar: defaul_res,
    address: "Vĩnh Phúc",
    address_details: "",
    phone: "0123456789",
    accountNumber: "",
    bankName: "",
    mohinh: "Nước",
    room: 1,
    table: { 1: 5 },
    option: {
      OderOnline: true,
      Oder: true,
      Chat: true,
      Rate: true,
    },
  }); // Danh sách ngân hàng ở Việt Nam
  // Hàm lấy vị trí hiện tại của người dùng
  const getCurrentLocation = () => {
    setIsGetlocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await api.getAddress(latitude, longitude);
          setIsGetlocation(false);
          setRestaurantData({
            ...restaurantData,
            address: address?.display_name,
            address_details: address,
          });
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
  // Hàm để xử lý dữ liệu đầu vào
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      // Nếu người dùng chọn file ảnh, tạo URL tạm thời cho ảnh
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const maxDimension = 250;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxDimension) {
                height *= maxDimension / width;
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width *= maxDimension / height;
                height = maxDimension;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const resizedBase64 = canvas.toDataURL("image/png", 0.8);
            setRestaurantData({
              ...restaurantData,
              avatar: resizedBase64,
            });
          };
        };
        reader.readAsDataURL(file);
      }
    } else {
      setRestaurantData({
        ...restaurantData,
        [name]: value,
      });
    }
  };
  // Hàm để xử lý dữ liệu đầu vào
  const handleChangeOption = (e) => {
    const { name, checked } = e.target;
    console.log(name, checked, restaurantData.option.Rate);
    setRestaurantData((prevData) => ({
      ...prevData,
      option: {
        ...prevData.option,
        [name]: checked,
      },
    }));
  };
  const nextStep = () => {
    if (step === 1) {
      if (restaurantData.name === "") {
        setErrorMes("Chưa nhập tên quán!");
        return;
      }
      if (restaurantData.phone === "") {
        setErrorMes("Chưa nhập số điện thoại!");
        return;
      }
    }
    setErrorMes(false);
    setDirection("forward");
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setErrorMes(false);
    setDirection("backward");
    setStep((prev) => prev - 1);
  };
  // Handle change in the number of rooms
  const handleRoomChange = (e) => {
    const roomCount = parseInt(e.target.value);
    setRoom(roomCount);
    setRestaurantData((prevData) => ({
      ...prevData,
      room: roomCount,
    }));
    const initialTables = {};
    for (let i = 1; i <= roomCount; i++) {
      initialTables[i] = tablesPerRoom[i] || 5; // default to 1 table if not set
    }
    setTablesPerRoom(initialTables);
    setRestaurantData((prevData) => ({
      ...prevData,
      table: initialTables,
    }));
  };

  // Handle change in the number of tables per specific room
  const handleTableChange = (roomNumber, tableCount) => {
    setTablesPerRoom((prevTables) => ({
      ...prevTables,
      [roomNumber]: parseInt(tableCount),
    }));
    setRestaurantData((prevData) => ({
      ...prevData,
      table: {
        ...prevData.table,
        [roomNumber]: parseInt(tableCount),
      },
    }));
  };
  const handleComplete = async () => {
    setIsCreating(true);
    setErrorMes(false);
    await api
      .post("/create-res/", restaurantData, token)
      .then((response) => {
        setIsCreated(true);
        setTimeout(() => {
          setUser(response);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setErrorMes("Có lỗi khi tạo nhà hàng! vui lòng thử lại sau!");
        }, 1000);
      })
      .finally(() => {
        setTimeout(() => {
          setIsCreating(false);
        }, 1000);
      });
  };
  return (
    <div className="new_res">
      {/* Thanh tiến trình */}
      <div className="step-progress">
        <div
          className={`step ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}
        >
          <div className="circle">1</div>
          <span className="label">Thông tin</span>
        </div>
        <div
          className={`step ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}
        >
          <div className="circle">2</div>
          <span className="label">Bàn ăn</span>
        </div>
        <div
          className={`step ${step === 3 ? "active" : step > 3 ? "completed" : ""}`}
        >
          <div className="circle">3</div>
          <span className="label">Tùy chỉnh</span>
        </div>
        <div
          className={`step ${step === 4 ? "active" : step > 4 ? "completed" : ""}`}
        >
          <div className="circle">4</div>
          <span className="label">Hoàn thành</span>
        </div>
      </div>
      <div className="navigation">
        <div></div>
        <div className="navigation-buttons">
          {step > 1 && (
            <button className="back" onClick={prevStep}>
              Quay lại
            </button>
          )}
          {step < 4 && (
            <button className="next" onClick={nextStep}>
              Tiếp tục
            </button>
          )}
          {step === 4 && (
            <button className="next" onClick={handleComplete}>
              {isCreating ? (
                <div className="loading-spinner"></div>
              ) : (
                <i className="fa-solid fa-check"></i>
              )}
              Hoàn thành
            </button>
          )}
        </div>
      </div>
      <div className="step-body">
        <div className="step-content">
          {step === 1 && (
            <div className="step-form slide-top">
              <div className="title">Thông tin nhà hàng</div>
              <div className="form-data">
                <div className="avatar">
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    onChange={handleChange}
                    accept="image/*"
                    className="display-none"
                  />
                  {restaurantData.avatar && (
                    <label className="image-preview" htmlFor="avatar">
                      <img src={restaurantData.avatar} alt="Avatar Preview" />
                    </label>
                  )}
                </div>
                <div className="mes">
                  {errorMes && <div className="error">{errorMes}</div>}
                </div>
                <div className="input">
                  <input
                    type="text"
                    name="name"
                    className="name"
                    placeholder="Tên quán"
                    value={restaurantData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="input">
                  <select
                    name="mohinh"
                    value={restaurantData.mohinh}
                    onChange={handleChange}
                    className="full"
                  >
                    <option value="">Chọn loại hình</option>
                    <option value="Cafe">Quán cafe</option>
                    <option value="Nước">Quán nước</option>
                    <option value="Buffe">Buffe</option>
                    <option value="Lẩu">Tiệm lẩu</option>
                    <option value="Nướng">Đồ nướng</option>
                    <option value="Nem">Ăn vặt</option>
                    <option value="Bún">Bún, miến, ăn sáng</option>
                    <option value="Cơm">Cơm rang, cơm bình dân</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="input">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={restaurantData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="input">
                  <select
                    name="bankName"
                    value={restaurantData.bankName}
                    onChange={handleChange}
                  >
                    <option value="">Ngân hàng</option>
                    {api.banks.map((bank, index) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Số tài khoản"
                    value={restaurantData.accountNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="input">
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    value={restaurantData.address}
                    onChange={handleChange}
                  />
                  <button onClick={getCurrentLocation}>
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
          )}

          {step === 2 && (
            <div className="step-form slide-top">
              <div className="title">Bàn ăn và phòng</div>
              <div className="form-data">
                <div className="option-config">
                  <select value={room} onChange={handleRoomChange}>
                    {[...Array(2)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1} Phòng
                      </option>
                    ))}
                  </select>
                </div>
                <div className="layout">
                  {[...Array(room)].map((_, index) => {
                    const roomNumber = index + 1;
                    return (
                      <div key={roomNumber} className="room">
                        <div className="room-name">
                          <div className="name">Phòng {roomNumber}</div>
                          <div className="config">
                            <select
                              value={tablesPerRoom[roomNumber] || 5}
                              onChange={(e) =>
                                handleTableChange(roomNumber, e.target.value)
                              }
                            >
                              {[...Array(10)].map((_, tableIndex) => (
                                <option key={tableIndex} value={tableIndex + 1}>
                                  {tableIndex + 1} Bàn
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="room-layout">
                          {[...Array(tablesPerRoom[roomNumber] || 5)].map(
                            (_, tableIndex) => (
                              <div key={tableIndex} className="table">
                                <div className="icon">
                                  <img src={table} />
                                </div>
                                <div className="name">Bàn {tableIndex + 1}</div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="step-form slide-top">
              <div className="title">Tùy chỉnh</div>
              <div className="form-data">
                <div className="config">
                  <div className="items">
                    <div
                      className="name"
                      onClick={() => {
                        setRestaurantData((prevData) => ({
                          ...prevData,
                          option: {
                            ...prevData.option,
                            OderOnline: !restaurantData.option.OderOnline,
                          },
                        }));
                      }}
                    >
                      Đặt hàng online
                    </div>
                    <div className="option">
                      <input
                        type="checkbox"
                        className="checkboxInput"
                        id="cbx_OderOnline"
                        name="OderOnline"
                        checked={restaurantData.option.OderOnline}
                        onChange={handleChangeOption}
                      />
                      <label
                        htmlFor="cbx_OderOnline"
                        className="toggleSwitch"
                      />
                    </div>
                  </div>
                  <div className="items">
                    <div
                      className="name"
                      onClick={() => {
                        setRestaurantData((prevData) => ({
                          ...prevData,
                          option: {
                            ...prevData.option,
                            Oder: !restaurantData.option.Oder,
                          },
                        }));
                      }}
                    >
                      Order mang về
                    </div>
                    <div className="option">
                      <input
                        type="checkbox"
                        className="checkboxInput"
                        id="cbx_Oder"
                        name="Oder"
                        checked={restaurantData.option.Oder}
                        onChange={handleChangeOption}
                      />
                      <label htmlFor="cbx_Oder" className="toggleSwitch" />
                    </div>
                  </div>
                  <div className="items">
                    <div
                      className="name"
                      onClick={() => {
                        setRestaurantData((prevData) => ({
                          ...prevData,
                          option: {
                            ...prevData.option,
                            Chat: !restaurantData.option.Chat,
                          },
                        }));
                      }}
                    >
                      Tính năng trò chuyện
                    </div>
                    <div className="option">
                      <input
                        type="checkbox"
                        className="checkboxInput"
                        id="cbx_Chat"
                        name="Chat"
                        checked={restaurantData.option.Chat}
                        onChange={handleChangeOption}
                      />
                      <label htmlFor="cbx_Chat" className="toggleSwitch" />
                    </div>
                  </div>
                  <div className="items">
                    <div
                      className="name"
                      onClick={() => {
                        setRestaurantData((prevData) => ({
                          ...prevData,
                          option: {
                            ...prevData.option,
                            Rate: !restaurantData.option.Rate,
                          },
                        }));
                      }}
                    >
                      Bật tính năng đánh giá
                    </div>
                    <div className="option">
                      <input
                        type="checkbox"
                        className="checkboxInput"
                        id="cbx_Rate"
                        name="Rate"
                        checked={restaurantData.option.Rate}
                        onChange={handleChangeOption}
                      />
                      <label htmlFor="cbx_Rate" className="toggleSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="step-form slide-top">
              <div className="title">Hoàn thành</div>
              <div className="mes">
                {errorMes && <div className="error">{errorMes}</div>}
              </div>
              <div className="hint">
                Kiểm tra lại thông tin trước khi hoàn thành, đây là bản xem
                trước!
              </div>
              <div className="form-data">
                <div className="preview">
                  {isCreating && (
                    <div className="loading">
                      {isCreated ? (
                        <div className="ok">
                          <div className="icon">
                            <i className="fa-solid fa-check"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="loading-spinner"></div>
                      )}
                    </div>
                  )}
                  <div className="res-head">
                    <div className="hotline">
                      <i className="fa-solid fa-phone"></i>
                      {0 +
                        parseInt(restaurantData.phone).toLocaleString("vi-VN")}
                    </div>
                    <div className="logo">
                      <img src={restaurantData.avatar} />
                    </div>
                    <div className="name">
                      <div className="namet">
                        {restaurantData.name}
                        <div className="loaihinh">
                          Tiệm {restaurantData.mohinh}
                        </div>
                      </div>
                      <div className="rate">Chưa có đánh giá</div>
                      <div className="location">
                        <div className="icon">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="value">{restaurantData.address}</div>
                      </div>
                    </div>
                  </div>
                  <div className="body">
                    <div className="options">
                      {restaurantData.option.Chat && (
                        <div className="items">
                          <div className="icon">
                            <i className="fa-solid fa-comments"></i>
                          </div>
                          <div className="name">Trò chuyện</div>
                        </div>
                      )}
                      {restaurantData.option.Oder && (
                        <div className="items">
                          <div className="icon">
                            <i className="fa-solid fa-motorcycle"></i>
                          </div>
                          <div className="name">Mang về</div>
                        </div>
                      )}
                      {restaurantData.option.OderOnline && (
                        <div className="items">
                          <div className="icon">
                            <i className="fa-solid fa-truck-fast"></i>
                          </div>
                          <div className="name">Đặt online</div>
                        </div>
                      )}
                      {restaurantData.option.Rate && (
                        <div className="items">
                          <div className="icon">
                            <i className="fa-solid fa-star"></i>
                          </div>
                          <div className="name">Đánh giá</div>
                        </div>
                      )}
                    </div>
                    <div className="layout">
                      {[...Array(room)].map((_, index) => {
                        const roomNumber = index + 1;
                        return (
                          <div key={roomNumber} className="room">
                            <div className="room-name">
                              <div className="name">Phòng {roomNumber}</div>
                            </div>
                            <div className="room-layout">
                              {[...Array(tablesPerRoom[roomNumber] || 5)].map(
                                (_, tableIndex) => (
                                  <div key={tableIndex} className="table">
                                    <div className="status">Trống</div>
                                    <div className="icon">
                                      <img src={table} />
                                    </div>
                                    <div className="name">
                                      Bàn {tableIndex + 1}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default New_restaurant;
