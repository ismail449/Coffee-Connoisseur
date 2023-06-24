import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Image from "next/image";
import Card from "@/components/card";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { CoffeeStore, fetchCoffeeStores } from "@/lib/coffee-stores";
import useTrackLocation from "@/hooks/use-track-location";

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
  const {
    handleTrackLocation,
    latLong,
    locationErrorMessage,
    isFindingLocation,
  } = useTrackLocation();
  const handleBannerBtnOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleBannerBtnOnClick}
        />
        {locationErrorMessage.length > 0 ? (
          <p>something went wrong: {locationErrorMessage}</p>
        ) : null}
        <Image
          alt="lady drinking coffee"
          src="/static/hero-image.png"
          width={700}
          height={400}
          className={styles.heroImage}
        />
        {coffeeStores.length > 0 ? (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Cairo Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(({ id, name, imgUrl }) => (
                <Card
                  key={id}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
