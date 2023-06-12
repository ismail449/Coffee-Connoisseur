import React, { FC } from "react";
import styles from "@/styles/card.module.css";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

type CardProps = {
  name: string;
  imgUrl: string;
  href: string;
  className: string;
};
const Card: FC<CardProps> = ({ name, imgUrl, href, className }) => {
  return (
    <Link className={classNames(styles.cardLink, className)} href={href}>
      <div className={classNames("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={imgUrl}
            alt="coffee store"
            width={260}
            height={160}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
