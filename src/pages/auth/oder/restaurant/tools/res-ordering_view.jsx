import React from "react";

const Restaurant_ordering_view = ({ option }) => {
  return (
    <div className="list-ordering">
      {option === "waiting" && (
        <>
          <div className="list-option">
            <div className="option">
              <div className="chck">
                <input type="checkbox" />
              </div>
              <div className="name">Hiện ảnh</div>
            </div>
            <div className="option">
              <div className="chck">
                <input type="checkbox" />
              </div>
              <div className="name">Auto nhận đơn</div>
            </div>
          </div>
          <div className="list-order">
            <div className="items">
              <div className="order_info">
                <div className="status first">
                  <div className="name">Bàn 1</div>
                  <div className="mes">Đặt lần đầu</div>
                </div>
                <div className="list-items">
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>SL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="c">1</td>
                        <td className="c">
                          <div className="img">
                            <img src="#" />
                          </div>
                        </td>
                        <td>Món ăn mĩ vị nhân gian</td>
                        <td className="c">2</td>
                      </tr>
                      <tr>
                        <td className="c">1</td>
                        <td className="c">
                          <div className="img">
                            <img src="#" />
                          </div>
                        </td>
                        <td>Món ăn mĩ vị nhân gian</td>
                        <td className="c">2</td>
                      </tr>
                      <tr>
                        <td className="c">1</td>
                        <td className="c">
                          <div className="img">
                            <img src="#" />
                          </div>
                        </td>
                        <td>Món ăn mĩ vị nhân gian</td>
                        <td className="c">2</td>
                      </tr>
                      <tr>
                        <td className="c">1</td>
                        <td className="c">
                          <div className="img">
                            <img src="#" />
                          </div>
                        </td>
                        <td>Món ăn mĩ vị nhân gian</td>
                        <td className="c">2</td>
                      </tr>
                      <tr>
                        <td className="c">1</td>
                        <td className="c">
                          <div className="img">
                            <img src="#" />
                          </div>
                        </td>
                        <td>Món ăn mĩ vị nhân gian</td>
                        <td className="c">2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="items-action">
                  <button className="none">Hủy</button>
                  <button className="add">Nhận đơn</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Restaurant_ordering_view;
