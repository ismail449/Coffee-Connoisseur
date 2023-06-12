import React from "react";
import styles from "@/styles/banner.module.css";

type BannerProps = {
  buttonText: string;
  handleOnClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Banner = ({ buttonText, handleOnClick }: BannerProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>{" "}
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shops!</p>
      <div className={styles.buttonWrapper}>
        <button onClick={handleOnClick} className={`${styles.button}`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
