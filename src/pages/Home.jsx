import React, { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icon/logo.png";
import error from "../assets/icon/error_500.png";
import api from "../components/api";
import { io } from "socket.io-client";
import Oder from "./auth/Oder";
import Cookies from "js-cookie"; // Import thư viện js-cookie

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [qrCodeValue, setQrCodeValue] = useState(""); // Giá trị của mã QR
  const [socket, setSocket] = useState(null);
  const [roomKey, setRoomKey] = useState(null);
  const [token, setToken] = useState(Cookies.get("lenmon_token"));
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (token && token != "null") {
      console.log("Token: ", token);
    } else {
      const qr_key = api
        .post(`/qr_login/`, {
          app: "lenmon",
          platform: "zalo",
        })
        .then((response) => {
          const key = response.key;
          if (key) {
            const qrValue = response.link + "&key=" + key;
            setQrCodeValue(qrValue);
            const newSocket = io("http://" + location.hostname + ":3009", {
              transports: ["websocket"],
            });
            // const newSocket = io("https://ipays.vn", {
            //   path: "/socket.io",
            //   transports: ["websocket"],
            //   auth: {
            //     token: token,
            //   },
            // });
            setSocket(newSocket);
            newSocket.on("connect", () => {
              console.log("Connected to socket server on port 3009");
              setRoomKey(key); // Lưu key vào state
              newSocket.emit("join room", key, (mes) => {
                console.log(`Joined room with key: ${key}: ${mes}`);
                newSocket.on("message", (data) => {
                  console.log("Received message:", data);
                  if (data.room == key && data.status == "PASS") {
                    newSocket.disconnect();
                    setToken(data.token);
                    Cookies.set("lenmon_token", data.token, {
                      expires: data.expires_in / 86400,
                    });
                  }
                });
              });
            });
            newSocket.on("disconnect", () => {
              console.log("Disconnected from socket server");
            });
            return () => {
              newSocket.disconnect();
            };
          }
        })
        .catch((error) => {
          console.log("Lỗi: ", error);
          setMessage(
            "Máy chủ hiện tại không phản hồi, vui lòng thử lại hoặc quay lại sau!"
          );
        });
    }
  }, [token]);

  // Hàm đăng nhập giả lập
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); // Cập nhật trạng thái đăng nhập
    setIsLoggedIn(true);
  };
  return (
    <div className="home">
      {token ? (
        <Oder token={token} setToken={setToken} socket={socket} />
      ) : (
        <div className="login-page">
          <div className="app-logo">
            <div className="logo">
              <img src={logo} />
            </div>
            <div className="app">LÊN MÓN</div>
            <div className="sologan">Gọi món nhanh nhất, đơn giản nhất</div>
          </div>
          {message ? (
            <div className="error">
              <div className="icon">
                <img src={error} />
              </div>
              <div className="mes">{message}</div>
            </div>
          ) : (
            <>
              <div className="h1">Quét mã để đăng nhập bằng Zalo</div>
              <div className="hint">
                Trước khi bắt đầu, bạn cần <b>Đăng nhập</b>
              </div>
              <div className="login-qr">
                {qrCodeValue && (
                  <div className="qr-code">
                    <QRCode
                      value={qrCodeValue}
                      size={200}
                      logoImage="/path-to-logo.png" // Đường dẫn đến logo của bạn
                      logoWidth={40} // Kích thước của logo
                      logoHeight={40}
                      removeQrCodeBehindLogo={true}
                      logoPadding={2}
                      ecLevel="M"
                      logoPaddingStyle="square"
                      qrStyle="dots" // Đặt thành "dots" để có chấm tròn cho toàn bộ mã QR
                      eyeRadius={8} // Bo tròn các mắt của mã QR
                      eyeColor="#416aa3"
                      fgColor="#97b0d3"
                    />
                  </div>
                )}
              </div>
              <div className="guide">
                <div className="step">1. Mở ứng dụng Zalo</div>
                <div className="step">2. Chọn mục: Quét mã</div>
                <div className="step">3. Xác nhận đăng nhập</div>
              </div>
              <div className="login-link">
                Hoặc <Link to={qrCodeValue}>mở ứng dụng Zalo</Link> để đăng nhập
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
