"use client";

import { useGlobalContext } from "@/context/Session";
import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";

function RequestPreview({ params }: { params: { loanId: string } }) {
  const [dataLoan, setDataLoan] = useState<ScalarLoanApplication | null>(null);
  const { dataSession } = useGlobalContext();

  useEffect(() => {
    const getLoanInfo = async () => {
      const response = await axios.post(
        "/api/loans/id",
        {
          loanId: params.loanId,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response)

      if (response.data.success === true) setDataLoan(response.data.data);
    };

    getLoanInfo();
  }, [params.loanId]);
  return (
    <>
      <pre>{JSON.stringify(dataLoan, null, 2)}</pre>
    </>
  );
}

export default RequestPreview;
