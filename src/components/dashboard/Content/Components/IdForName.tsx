import { ScalarUser } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";

function InfoEmployee({
  employeeId,
  token,
}: {
  employeeId: string;
  token: string;
}) {
  const [infoEmployee, setInfoEmployee] = useState<ScalarUser | null>(null);

  useEffect(() => {
    const getName = async () => {
      const response = await axios.post(
        "/api/users/id",
        {
          employeeId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      response.data.success === true && setInfoEmployee(response.data.data);
    };

    getName();
  }, [employeeId]);

  return (
    <>
      <div>
        <p style={{ fontSize: "20px" }}>
          {infoEmployee?.name} {infoEmployee?.lastNames}
        </p>
        <h5>{infoEmployee?.phone}</h5>
      </div>
    </>
  );
}

export default InfoEmployee;
