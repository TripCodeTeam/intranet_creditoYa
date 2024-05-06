"use client";

import LoanApplicationService from "@/classes/LoanServices";
import { useGlobalContext } from "@/context/Session";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";

function LoansSection() {
  //   const { dataSession } = useGlobalContext();
  const [loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);
  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post(
        "/api/loans/all"
        // {},
        // {
        //   headers: {
        //     Authorization: `Bearer ${dataSession?.token}`,
        //   },
        // }
      );

      if (response.data.success == false) {
        throw new Error("Error al obtener las solicitudes");
      }

      console.log(response);

      const data: ScalarLoanApplication[] = response.data.data;
      setLoans(data);
    };

    getAllLoans();
  }, []);
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
