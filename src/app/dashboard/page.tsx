"use client";

import ContentOptions from "@/components/dashboard/ContentOptions";
import SideBar from "@/components/SideBar/SideBar";
import { DashboardProvider } from "@/context/DashboardContext";
import React, { Suspense, useState } from "react";
import styles from "./page.module.css";
import responsive, { useMediaQuery } from "react-responsive";
import ResponsiveSideBar from "@/components/SideBar/ResponsiveSideBar";
import OnlySideOpen from "@/components/SideBar/OnlySideOpen";

function Dashboard() {
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [inOpen, setInOpen] = useState<boolean>(false);
  const [inOpenRes, setInOpenRes] = useState<boolean | null>(null);

  const handlerChangeOpenSide = (status: boolean) => {
    // console.log(status);

    if (status == false) {
      setInOpen(false);
    }

    setInOpenRes(null);

    setInOpenRes(status);
  };

  const OnlyIsOpen = (status: boolean) => {
    // console.log(status);
    setInOpenRes(status);
    setInOpen(true)
  };

  return (
    <>
      <DashboardProvider>
        <div className={styles.containerDashboard}>
          {isMobile && inOpenRes && <OnlySideOpen chageSide={OnlyIsOpen} />}

          {isMobile && !inOpenRes && (
            <ResponsiveSideBar openSide={handlerChangeOpenSide} />
          )}

          {!isMobile && <SideBar />}

          {/* </Suspense> */}
          <ContentOptions />
        </div>
      </DashboardProvider>
    </>
  );
}

export default Dashboard;
