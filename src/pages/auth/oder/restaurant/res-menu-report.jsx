import React, { useState } from "react";
import Chart from "react-apexcharts";

const Restaurant_menu_report = ({ onClose }) => {
  const [isFadeout, setIsFadeout] = useState(false);
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false, // ẩn thanh công cụ nếu không cần thiết
      },
      stacked: true, // sử dụng stacked để hiển thị dạng cột chồng
    },
    plotOptions: {
      bar: {
        borderRadius: 4, // bo tròn các cột bar
        columnWidth: "18px", // đặt kích thước cột bar là 15px
        dataLabels: {
          position: "center", // đặt nhãn dữ liệu ở đỉnh của cột bar
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`, // hiển thị giá trị trên đỉnh cột
      style: {
        fontSize: "12px",
        colors: ["#3e3e44"], // màu trắng cho số
      },
    },
    xaxis: {
      categories: [
        new Date().getDate() - 6 + "-" + (new Date().getMonth() + 1),
        new Date().getDate() - 5 + "-" + (new Date().getMonth() + 1),
        new Date().getDate() - 4 + "-" + (new Date().getMonth() + 1),
        new Date().getDate() - 3 + "-" + (new Date().getMonth() + 1),
        new Date().getDate() - 2 + "-" + (new Date().getMonth() + 1),
        new Date().getDate() - 1 + "-" + (new Date().getMonth() + 1),
        "Hôm nay",
      ],
    },
    yaxis: {
      show: false, // ẩn trục y bên trái
    },
    fill: {
      opacity: 1, // độ đậm nhạt cho cột
    },
    colors: ["#00ee9f", "#00eeff", "#86c5ff"], // màu sắc cho từng series
    legend: {
      position: "bottom", // đặt nhãn series ở bên phải
      horizontalAlign: "right",
      offsetY: 0,
      offsetX: 0,
    },
  });

  const [series, setSeries] = useState([
    {
      name: "Đơn online",
      data: [10, 15, 20, 25, 30, 35, 40],
    },
    {
      name: "Mang về",
      data: [5, 10, 15, 10, 20, 25, 30],
    },
    {
      name: "Tại bàn",
      data: [8, 12, 18, 22, 28, 33, 38],
    },
  ]);
  const handleClose = () => {
    setIsFadeout(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };
  return (
    <>
      <div className="bg-full">
        <div
          className={`detectOut ${isFadeout ? "fadeOut" : ""}`}
          onClick={handleClose}
        />
        <div className={`view-box ${isFadeout ? "slideOut" : ""}`}>
          <div className="title">
            <div className="tname">Thống kê</div>
          </div>
          <div className="body-box">
            <div className="main-view-box menu-report">
              <div className="main-db">
                <div className="item online">
                  <div className="name">Đơn online</div>
                  <div className="value">00</div>
                </div>
                <div className="item take">
                  <div className="name">Mang về</div>
                  <div className="value">00</div>
                </div>
                <div className="item stay">
                  <div className="name">Tại bàn</div>
                  <div className="value">00</div>
                </div>
              </div>
              <div className="main-chart">
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  width="100%"
                  height="220px"
                />
              </div>
              <div className="th3">Lượng đơn hàng theo menu</div>
              <div className="list-table">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Tên món</th>
                      <th>Doanh số</th>
                      <th>Đơn giá</th>
                      <th>Tổng thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1</td>
                      <td>Món 1</td>
                      <td>999 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Món 1</td>
                      <td>888 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Món 1</td>
                      <td>777 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Món 1</td>
                      <td>777 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>
                        Món 1 dsa dsadsa dsad sa dsa dsa dsa dsa dsa dsa dsa dsa
                        ds
                      </td>
                      <td>777 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Món 1</td>
                      <td>777 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Món 1</td>
                      <td>777 suất</td>
                      <td>{(100000).toLocaleString("vi-VN")}đ</td>
                      <td>{(999 * 100000).toLocaleString("vi-VN")}đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="th3">Theo lượng khách đặt</div>
              <div className="list-table">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Tên</th>
                      <th>Avatar</th>
                      <th>Đơn hàng</th>
                      <th>Tổng thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td>#1</td>
                      <td>Hùng</td>
                      <td>
                        <img src="#" />
                      </td>
                      <td>10</td>
                      <td>{(231232142).toLocaleString("vi-VN")}đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant_menu_report;
