"use client";

import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";

function LoansSection() {
  //   const { dataSession } = useGlobalContext();
  const [loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);

  useEffect(() => {
    const getAllLoads = async () => {
      const response = await axios.post("/api/loans/all");
      const data = response.data.data;
      setLoans(data);
    };

    getAllLoads();
  });

  return (
    <>
      <div>
        {loans?.length == 0 && <p>No hay peticiones aun</p>}
        {loans?.map((load) => (
          <div key={load.id}>
            <p>Load ID: {load.id}</p>
            <p>Load by: {load.userId}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default LoansSection;
