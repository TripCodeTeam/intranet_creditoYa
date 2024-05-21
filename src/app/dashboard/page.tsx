"use client"

import ContentOptions from "@/components/dashboard/ContentOptions";
import SideBar from "@/components/SideBar/SideBar";
import { DashboardProvider } from "@/context/DashboardContext";
import React from "react";
import styles from "./page.module.css";

function Dashboard() {
  return (
    <>
      <DashboardProvider>
        <div className={styles.containerDashboard}>
          <SideBar />
          <ContentOptions />
        </div>
      </DashboardProvider>
    </>
  );
}

export default Dashboard;
