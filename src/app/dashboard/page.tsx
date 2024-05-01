import axios from "axios";
import React, { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    const getLoanRequest = async () => {
      const response = await axios.post("https://creditoya.vercel.app/api/");
    };

    getLoanRequest();
  }, []);
  return <main></main>;
}

export default Dashboard;
