import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Image from "next/image";
import Card from "@/components/card";
import coffeeStores from "../data/coffee-stores.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const handleBannerBtnOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("hello");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleBannerBtnOnClick}
        />
        <Image
          alt="lady drinking coffee"
          src="/static/hero-image.png"
          width={700}
          height={400}
          className={styles.heroImage}
        />
        <div className={styles.cardLayout}>
          {coffeeStores.map(({ imgUrl, id, name }) => (
            <Card
              key={id}
              name={name}
              imgUrl={imgUrl}
              href={`/coffee-store/${id}`}
              className={styles.card}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
