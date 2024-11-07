import React, { useEffect, useState } from "react";
import api from "../../components/api";
const Oder = ({ token }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checktoken = async () => {
      await api.get("/lenmon/", token).then((response) => {
        setUser(response[0]);
      });
    };
    checktoken();
  }, []);
  return <div>Oder</div>;
};

export default Oder;
