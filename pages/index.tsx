import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Image from "next/image";
import Card from "@/components/card";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { CoffeeStore, fetchCoffeeStores } from "@/lib/coffee-stores";
import useTrackLocation from "@/hooks/use-track-location";
import { useEffect, useState } from "react";
import { ACTION_TYPES, useStoreContext } from "../context/store-context";

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
  const { latLong, dispatch, coffeeStoresNearby } = useStoreContext();
  const [coffeeStoresError, setCoffeeStoresError] = useState<string>("");
  const { handleTrackLocation, locationErrorMessage, isFindingLocation } =
    useTrackLocation();

  useEffect(() => {
    const fetchCoffeeStoresNearby = async () => {
      if (latLong.lat && latLong.long) {
        const data = {
          latLong: latLong,
          limit: 30,
        };
        try {
          const response = await fetch("/api/getCoffeeStoresByLocation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const fetchedCoffeeStores = await response.json();

          dispatch({
            payload: fetchedCoffeeStores,
            type: ACTION_TYPES.SET_COFFEE_STORES,
          });
          setCoffeeStoresError("");
        } catch (error) {
          if (error instanceof Error) setCoffeeStoresError(error.message);
        }
      }
    };
    fetchCoffeeStoresNearby();
  }, [latLong, dispatch]);

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
        <meta
          name="description"
          content="Allows you to discover coffee stores"
        />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleBannerBtnOnClick}
        />
        {locationErrorMessage.length > 0 ? (
          <p>something went wrong: {locationErrorMessage}</p>
        ) : null}
        {coffeeStoresError.length > 0 ? (
          <p>something went wrong: {coffeeStoresError}</p>
        ) : null}
        <Image
          alt="lady drinking coffee"
          src="/static/hero-image.png"
          width={700}
          height={400}
          className={styles.heroImage}
        />
        {coffeeStoresNearby.length > 0 ? (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStoresNearby.map(({ id, name, imgUrl }) => (
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
