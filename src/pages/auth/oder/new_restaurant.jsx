import React, { useState } from "react";
import defaul_res from "../../../assets/icon/logo.png";
import api from "../../../components/api";

const New_restaurant = () => {
  const [avatarLabel, setAvatarLabel] = useState("Ảnh đại diện (chưa chọn)"); // Để hiển thị tên ảnh
  const [step, setStep] = useState(1);
  const [isGetlocation, setIsGetlocation] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    avatar: defaul_res,
    address: "",
    address_details: "",
    phone: "",
    accountNumber: "",
    bankName: "",
    tables: [],
    menu: [],
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
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  return (
    <div className="new_res">
      {/* Thanh tiến trình */}
      <div className="step-progress">
        <div
          className={`step ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}
          onClick={() => setStep(1)}
        >
          <div className="circle">1</div>
          <span className="label">Thông tin</span>
        </div>
        <div
          className={`step ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}
          onClick={() => setStep(2)}
        >
          <div className="circle">2</div>
          <span className="label">Bàn ăn</span>
        </div>
        <div
          className={`step ${step === 3 ? "active" : step > 3 ? "completed" : ""}`}
          onClick={() => setStep(3)}
        >
          <div className="circle">3</div>
          <span className="label">Thực đơn</span>
        </div>
        <div
          className={`step ${step === 4 ? "active" : step > 4 ? "completed" : ""}`}
          onClick={() => setStep(4)}
        >
          <div className="circle">4</div>
          <span className="label">Hoàn thành</span>
        </div>
      </div>
      <div className="step-body">
        <div className="step-content">
          {step === 1 && (
            <div className="step-form">
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
                <div className="input">
                  <input
                    type="text"
                    name="name"
                    className="name"
                    placeholder="Tên quán của bạn"
                    value={restaurantData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="input">
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ (chọn định vị)"
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
                    <option value="">Chọn ngân hàng</option>
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
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-form">
              <h2>Thông tin Bàn ăn</h2>
              <p>Gồm số tầng, số bàn, tên bàn, etc...</p>
            </div>
          )}

          {step === 3 && (
            <div className="step-form">
              <h2>Thực đơn</h2>
              <p>Danh sách món ăn: tên, ảnh, mô tả ngắn, mô tả chi tiết</p>
            </div>
          )}

          {step === 4 && (
            <div className="step-form">
              <h2>Hoàn thành</h2>
              <p>Xem lại thông tin nhà hàng trước khi lưu.</p>
              <pre>{JSON.stringify(restaurantData, null, 2)}</pre>
            </div>
          )}
        </div>

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
            <button className="next" onClick={() => alert("Hoàn tất!")}>
              Hoàn tất
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default New_restaurant;
