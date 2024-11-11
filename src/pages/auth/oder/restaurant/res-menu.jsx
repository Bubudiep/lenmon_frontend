import React from "react";

const Restaurant_menu = ({ store }) => {
  return (
    <>
      <div className="th3">Thực đơn</div>
      <div className="res-menu">
        <div className="menu">
          <div className="items">
            <div className="image">
              <img src="#" />
            </div>
            <div className="options">
              <div className="name">Tên món</div>
              <div className="price">{(10000000).toLocaleString("vi-VN")}đ</div>
              <div className="status">
                <select>
                  <option>Còn</option>
                  <option>Hết</option>
                </select>
                <select>
                  <option>Online</option>
                  <option>Tắt</option>
                </select>
                <select>
                  <option>Ship</option>
                  <option>Tắt</option>
                </select>
                <div className="config">
                  <i className="fa-solid fa-gear"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="items">
            <div className="image">
              <img src="#" />
            </div>
            <div className="options">
              <div className="name">Tên món</div>
              <div className="price">{(10000000).toLocaleString("vi-VN")}đ</div>
              <div className="status">
                <select>
                  <option>Còn</option>
                  <option>Hết</option>
                </select>
                <select>
                  <option>Online</option>
                  <option>Tắt</option>
                </select>
                <select>
                  <option>Ship</option>
                  <option>Tắt</option>
                </select>
                <div className="config">
                  <i className="fa-solid fa-gear"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="items">
            <div className="image">
              <img src="#" />
            </div>
            <div className="options">
              <div className="name">Tên món</div>
              <div className="price">{(10000000).toLocaleString("vi-VN")}đ</div>
              <div className="status">
                <select>
                  <option>Còn</option>
                  <option>Hết</option>
                </select>
                <select>
                  <option>Online</option>
                  <option>Tắt</option>
                </select>
                <select>
                  <option>Ship</option>
                  <option>Tắt</option>
                </select>
                <div className="config">
                  <i className="fa-solid fa-gear"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="items">
            <div className="image">
              <img src="#" />
            </div>
            <div className="options">
              <div className="name">Tên món</div>
              <div className="price">{(10000000).toLocaleString("vi-VN")}đ</div>
              <div className="status">
                <select>
                  <option>Còn</option>
                  <option>Hết</option>
                </select>
                <select>
                  <option>Online</option>
                  <option>Tắt</option>
                </select>
                <select>
                  <option>Ship</option>
                  <option>Tắt</option>
                </select>
                <div className="config">
                  <i className="fa-solid fa-gear"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_menu;
