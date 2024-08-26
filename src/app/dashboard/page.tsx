"use client";

import ContentOptions from "@/components/dashboard/ContentOptions";
import SideBar from "@/components/SideBar/SideBar";
import { DashboardProvider } from "@/context/DashboardContext";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useMediaQuery } from "react-responsive";
import ResponsiveSideBar from "@/components/SideBar/ResponsiveSideBar";
import OnlySideOpen from "@/components/SideBar/OnlySideOpen";
import { useGlobalContext } from "@/context/Session";
import { useRouter } from "next/navigation";
import Loading from "./loading";

function Dashboard() {
  const isMobile = useMediaQuery({ query: "(max-width: 700px)" });
  const [inOpenRes, setInOpenRes] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { dataSession } = useGlobalContext();
  const router = useRouter();

  const handlerChangeOpenSide = (status: boolean) => {
    setInOpenRes(null);
    setInOpenRes(status);
  };

  const OnlyIsOpen = (status: boolean) => {
    // console.log(status);
    setInOpenRes(status);
    // setInOpen(false);
  };

  useEffect(() => {
    if (!dataSession) {
      router.push("/");
    }

    if (dataSession) {
      setIsLoading(false);
    }
  }, [dataSession, router]);

  if (isLoading) <Loading />;

  if (dataSession) {
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
}

export default Dashboard;
