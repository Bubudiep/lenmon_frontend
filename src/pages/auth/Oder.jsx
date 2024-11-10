import React, { useEffect, useState } from "react";
import api from "../../components/api";
import New_restaurant from "./oder/new_restaurant";
import logo from "../../assets/icon/logo.png";
import Cookies from "js-cookie"; // Import thư viện js-cookie
import Restaurant from "./oder/restaurant";
const Oder = ({ token, setToken, socket }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [isFadeOut, setIsFadeOut] = useState(false);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const checktoken = async () => {
      setIsloading(true);
      await api
        .get("/lenmon/", token)
        .then((response) => {
          setUser(response);
        })
        .catch((error) => {
          Cookies.set("lenmon_token", null);
          setToken(null);
          console.log(error);
        })
        .finally(() => {
          setTimeout(() => {
            setIsFadeOut(true);
            setTimeout(() => {
              setIsShow(true);
            }, 100); // Đợi thêm 0.5s trước khi đặt setIsloading(false)
            setTimeout(() => {
              setIsloading(false);
            }, 1000); // Đợi thêm 0.5s trước khi đặt setIsloading(false)
          }, 500); // Đợi 0.5s trước khi đặt setIsFadeOut(true)
        });
    };
    checktoken();
  }, []);
  return (
    <div className="homePage">
      {isLoading ? (
        <div className={`full-load ${isFadeOut ? "fadeOut" : ""}`}>
          <div className="logo">
            <img src={logo} />
          </div>
          <div className="loading-spinner" />
        </div>
      ) : (
        ""
      )}
      {isShow &&
        (user?.count > 0 ? (
          <Restaurant
            user={user}
            setUser={setUser}
            token={token}
            socket={socket}
          />
        ) : (
          <New_restaurant user={user} setUser={setUser} token={token} />
        ))}
    </div>
  );
};

export default Oder;
