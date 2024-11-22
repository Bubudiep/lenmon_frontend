import React, { useEffect, useState } from "react";
import api from "../../../../components/api";

const Restaurant_order = ({ store, token, setStore, updateStore }) => {
  const [currentTab, setCurrentTab] = useState("CREATED_RECEIVED_SHIPPING"); // Trạng thái tab hiện tại
  const [selectedItems, setSelectedItems] = useState({});
  const statusGroups = {
    CREATED_RECEIVED_SHIPPING: ["CREATED", "RECEIVED", "SHIPPING"], // Đang giao
    DELIVERED: ["DELIVERED"], // Hoàn tất
    COMPLETE: ["COMPLETE"], // Hoàn tất
    CANCEL: ["CANCEL"], // Đã hủy
  };
  const toggleItemSelection = (orderId, itemId) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        [itemId]: !prevState[orderId]?.[itemId], // Đảo trạng thái
      },
    }));
  }; // Đồng bộ hóa selectedItems khi store thay đổi
  useEffect(() => {
    const initSelectedItems = {};
    store?.orders?.forEach((order) => {
      initSelectedItems[order.id] = {};
      order.items.forEach((item) => {
        if (item.status === "WAIT") {
          initSelectedItems[order.id][item.id] = true; // Chọn mặc định
        }
      });
    });
    setSelectedItems(initSelectedItems);
  }, []);
  const handleGiaohang = (order, giao) => {
    // Lấy danh sách ID đã được chọn trong đơn hàng
    const selectedItemIds = Object.entries(selectedItems[order.id] || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([itemId]) => Number(itemId));

    if (selectedItemIds.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để giao.");
      return;
    }
    console.log({
      orderId: order.id,
      itemIds: selectedItemIds,
    });
    api
      .post(
        "/res-giaohang/",
        {
          id: order.id,
          is_giao: giao,
          itemIds: selectedItemIds,
        },
        token
      )
      .then((res) => {
        // Cập nhật store
        setStore((prevStore) => ({
          ...prevStore,
          orders: prevStore.orders
            .map((preoder) =>
              preoder.id === res.data.id ? { ...preoder, ...res.data } : preoder
            )
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
        }));
      })
      .catch((err) => {
        console.error("Lỗi giao hàng:", err);
        alert("Giao hàng thất bại, vui lòng thử lại.");
      });
  };
  const filteredOrders =
    store?.orders?.filter((order) =>
      statusGroups[currentTab]?.includes(order.status)
    ) || [];
  const countByStatus = (group) =>
    store?.orders?.filter((order) =>
      statusGroups[group]?.includes(order.status)
    ).length || 0;
  const handleThutien = (order, donban) => {
    api
      .post(
        "/res-thutien/",
        {
          id: order.id,
          donban: donban,
        },
        token
      )
      .then((res) => {
        setStore((prevStore) => ({
          ...prevStore,
          orders: prevStore.orders
            .map((preoder) =>
              preoder.id === res.data.id ? { ...preoder, ...res.data } : preoder
            )
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
        }));
        if (donban) {
          api
            .get(`/restaurant-space/${order.space}/`, token)
            .then((res) => updateStore(res))
            .catch((er) => {
              console.log(er);
            })
            .finally(() => {});
        }
      })
      .catch((err) => {
        console.error("Lỗi giao hàng:", err);
      });
  };
  const handleNhandon = (e) => {
    console.log(e);
    api
      .post(
        "/res-nhandon/",
        {
          id: e.id,
        },
        token
      )
      .then((res) => {
        setStore((prevStore) => ({
          ...prevStore, // Giữ nguyên các thuộc tính khác
          orders: prevStore.orders
            .map(
              (preoder) =>
                preoder.id === res.data.id
                  ? { ...preoder, ...res.data }
                  : preoder // Cập nhật order nếu ID khớp
            )
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
        }));
      });
  };
  return (
    <>
      <div className="top-nav-items">
        {[
          { label: "Chờ", value: "CREATED_RECEIVED_SHIPPING" },
          { label: "Chưa thu", value: "DELIVERED" },
          { label: "Xong", value: "COMPLETE" },
          { label: "Hủy", value: "CANCEL" },
        ].map((tab) => (
          <div
            key={tab.value}
            className={`items ${currentTab === tab.value ? "active" : ""}`}
            onClick={() => setCurrentTab(tab.value)}
          >
            {tab.label} ({countByStatus(tab.value)})
          </div>
        ))}
      </div>
      {filteredOrders.length > 0 ? (
        <div className="list-checkout">
          <div className="checkout-list">
            {filteredOrders.map((order) => (
              <div className={`items ${order.status}`} key={order.id}>
                <div className="res">
                  <div className="name title">
                    {order.space ? order.space_name : "Mang về"} |
                    {order.status === "CREATED"
                      ? " Chờ xác nhận"
                      : order.status === "RECEIVED"
                        ? " Đang làm"
                        : order.status === "SHIPPING"
                          ? " Đang ship"
                          : order.status === "DELIVERED"
                            ? " Đã giao đủ"
                            : order.status === "COMPLETE"
                              ? " Đã thu tiền"
                              : order.status === "CANCEL"
                                ? " Đã hủy"
                                : ""}
                  </div>
                  <div className="key">
                    #HD-{order.OrderKey.slice(0, 7)}...
                    {order.OrderKey.slice(-4)}
                  </div>
                </div>
                {["CREATED"].includes(order.status) && (
                  <>
                    <div className="list-items">
                      <table>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.name}</td>
                              <td>SL: {item.quantity}</td>
                              <td>{item.price.toLocaleString("vi-VN")}đ/1</td>
                              <td>
                                {(item.quantity * item.price).toLocaleString(
                                  "vi-VN"
                                )}
                                đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {order?.custom_notes && (
                      <div className="res notes">
                        <i className="fa-regular fa-note-sticky"></i>
                        {order?.custom_notes}
                      </div>
                    )}
                    <div className="res">
                      <div className="left-i">
                        Tổng:{" "}
                        <div className="price">
                          {order.items
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                      <div className="right">
                        {api.timeSinceOrder(order.created_at)}
                      </div>
                    </div>
                    <div className="tools">
                      <button
                        className="btn btn-accept"
                        onClick={() => {
                          handleNhandon(order);
                        }}
                      >
                        Nhận đơn
                      </button>
                      <button className="btn btn-cancel">Bỏ</button>
                    </div>
                  </>
                )}
                {["RECEIVED", "SHIPPING"].includes(order.status) && (
                  <>
                    <div className="list-items">
                      <table>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                {item.status === "WAIT" ? (
                                  <input
                                    type="checkbox"
                                    checked={
                                      !!selectedItems[order.id]?.[item.id]
                                    }
                                    onChange={() =>
                                      toggleItemSelection(order.id, item.id)
                                    }
                                  />
                                ) : (
                                  <i className="fa-regular fa-circle-check"></i>
                                )}
                              </td>
                              <td>{item.name}</td>
                              <td>SL: {item.quantity}</td>
                              <td>{item.price.toLocaleString("vi-VN")}đ/1</td>
                              <td>
                                {(item.quantity * item.price).toLocaleString(
                                  "vi-VN"
                                )}
                                đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {order?.custom_notes && (
                      <div className="res notes">
                        <i className="fa-regular fa-note-sticky"></i>
                        {order?.custom_notes}
                      </div>
                    )}
                    <div className="res">
                      <div className="left-i">
                        Tổng:{" "}
                        <div className="price">
                          {order.items
                            .filter((item) => item.status !== "CANCEL")
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                      <div className="right">
                        {api.timeSinceOrder(order.created_at)}
                      </div>
                    </div>
                    <div className="tools">
                      <button
                        className="btn btn-accept"
                        onClick={() => handleGiaohang(order, true)}
                      >
                        Giao đã chọn
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => handleGiaohang(order, false)}
                      >
                        Báo hết đã chọn
                      </button>
                    </div>
                  </>
                )}
                {["DELIVERED", "COMPLETE"].includes(order.status) && (
                  <>
                    <div className="list-items">
                      <table>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                {item.status === "DONE" ? (
                                  <i className="fa-regular fa-circle-check"></i>
                                ) : (
                                  <i className="fa-solid fa-circle-xmark"></i>
                                )}
                              </td>
                              <td>{item.name}</td>
                              <td>SL: {item.quantity}</td>
                              <td>{item.price.toLocaleString("vi-VN")}đ/1</td>
                              <td>
                                {(item.quantity * item.price).toLocaleString(
                                  "vi-VN"
                                )}
                                đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {order?.custom_notes && (
                      <div className="res notes">
                        <i className="fa-regular fa-note-sticky"></i>
                        {order?.custom_notes}
                      </div>
                    )}
                    <div className="res">
                      <div className="left-i">
                        Tổng:{" "}
                        <div className="price">
                          {order.items
                            .filter((item) => item.status !== "CANCEL")
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toLocaleString("vi-VN")}
                          đ
                        </div>
                      </div>
                      <div className="right">
                        {api.timeSinceOrder(order.created_at)}
                      </div>
                    </div>
                    <div className="tools">
                      {order.status == "COMPLETE" ? (
                        <button className="btn btn-complete">
                          Đã thu tiền
                        </button>
                      ) : (
                        <button
                          className="btn btn-accept"
                          onClick={() => handleThutien(order, false)}
                        >
                          Thu tiền
                        </button>
                      )}
                      {order.space &&
                        order.is_clear == false &&
                        (order.status == "COMPLETE" ? (
                          <button
                            className="btn btn-cancel"
                            onClick={() => handleThutien(order, true)}
                          >
                            Dọn bàn
                          </button>
                        ) : (
                          <button
                            className="btn btn-cancel"
                            onClick={() => handleThutien(order, true)}
                          >
                            Thu tiền và dọn bàn
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="null">
          <div className="icon p-2 pt-8">
            <i className="fa-solid fa-sheet-plastic"></i>
          </div>
          <div className="message">Không có đơn hàng!</div>
        </div>
      )}
    </>
  );
};

export default Restaurant_order;
