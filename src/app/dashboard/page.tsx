"use client";

import ContentOptions from "@/components/dashboard/ContentOptions";
import SideBar from "@/components/SideBar/SideBar";
import { DashboardProvider } from "@/context/DashboardContext";
import React, { Suspense } from "react";
import styles from "./page.module.css";
import Loading from "./loading";

function Dashboard() {
  return (
    <>
      <DashboardProvider>
        <div className={styles.containerDashboard}>
          {/* <Suspense fallback={<Loading />}> */}
          <SideBar />
          {/* </Suspense> */}
          <ContentOptions />
        </div>
      </DashboardProvider>
    </>
  );
}

export default Dashboard;
