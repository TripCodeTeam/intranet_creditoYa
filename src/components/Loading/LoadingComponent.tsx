import Image from "next/image";
import React from "react";
import logoApp from "@/assets/only_object_logo.png";
import styles from "./Loading.module.css";

function LoadingComponent() {
  return (
    <main>
      <Image
        className={styles.logoLoading}
        width={300}
        height={300}
        src={logoApp}
        alt="logo"
      />
    </main>
  );
}

export default LoadingComponent;
