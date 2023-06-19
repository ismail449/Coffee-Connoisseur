import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Image from "next/image";
import Card from "@/components/card";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { CoffeeStore, fetchCoffeeStores } from "@/lib/coffee-stores";

export const getStaticProps: GetStaticProps<{
  coffeeStores: CoffeeStore[];
}> = async (context) => {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
};

export default function Home({
  coffeeStores,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
      <main className={styles.main}>
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
        {coffeeStores.length > 0 ? (
          <>
            <h2 className={styles.heading2}>Cairo Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(({ fsq_id, name, imgUrl }) => (
                <Card
                  key={fsq_id}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${fsq_id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
