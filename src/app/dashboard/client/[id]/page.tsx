"use client";

import { useGlobalContext } from "@/context/Session";
import { ScalarClient } from "@/types/session";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ProfileInfo({ params }: { params: { id: string } }) {
  const { dataSession } = useGlobalContext();
  const [] = useState<ScalarClient>();

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.post(
        "/api/clients/id",
        {
          userId: params.id,
        },
        { headers: { Authorization: `Bearer ${dataSession?.token}` } }
      );

      console.log(response)
    };

    getUser();
  }, [dataSession?.token, params.id]);
  return (
    <>
      <p>{params.id}</p>
    </>
  );
}

export default ProfileInfo;
