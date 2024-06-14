import { ImSpinner8 } from "react-icons/im";
import styles from "./page.module.css";
import Image from "next/image";
import logoApp from "@/assets/only_object_logo.png";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <main className={styles.mainLoader}>
      <div className={styles.centerMainLoader}>
        <div className={styles.boxIconSpinner}>
          <ImSpinner8 className={styles.iconSpinner} />
        </div>
        <p>Cargando ...</p>
        <div className={styles.boxImgLogo}>
          <Image src={logoApp} className={styles.imgLogo} alt="logo" />
        </div>
      </div>
    </main>
  );
}
