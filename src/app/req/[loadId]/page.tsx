"use client"

import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";

function RequestPreview({ params }: { params: { loadId: string } }) {
  const [dataLoan, setDataLoan] = useState<ScalarLoanApplication | null>(null);

  useEffect(() => {
    const getLoanInfo = async () => {
      const response = await axios.post("/api/loans/id", {
        loanId: params.loadId,
      });

      response.data.success === true && setDataLoan(response.data.data);
    };

    getLoanInfo();
  }, [params.loadId]);
  return (
    <>
      <pre>
        {JSON.stringify(dataLoan, null ,2)}
      </pre>
    </>
  );
}

export default RequestPreview;
