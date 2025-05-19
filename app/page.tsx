"use client";

import Image from "next/image";
import styles from "./landingpage.module.css";
import SearchComponent from "./searchcomponent/searchcomponent";

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.whiteOverlayFade}></div>

      <div className={styles.backgroundWrapper}>
        <Image
          src="/landingpage.jpg"
          alt="Landing background"
          fill
          className={styles.backgroundImage}
          priority
        />
      </div>
      <div className={styles.overlayContent}>
        <h1 className={styles.title}>Plantopedia</h1>
        <SearchComponent />
      </div>
    </main>
  );
}
