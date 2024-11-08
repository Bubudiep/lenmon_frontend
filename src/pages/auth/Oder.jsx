import React, { useEffect, useState } from "react";
import api from "../../components/api";
import New_restaurant from "./oder/new_restaurant";
const Oder = ({ token }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checktoken = async () => {
      await api.get("/lenmon/", token).then((response) => {
        setUser(response);
      });
    };
    checktoken();
  }, []);
  return user?.count > 0 ? (
    ""
  ) : (
    <New_restaurant user={user} setUser={setUser} />
  );
};

export default Oder;
