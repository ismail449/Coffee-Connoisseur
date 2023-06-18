import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner";
import Image from "next/image";
import Card from "@/components/card";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { fetchCoffeeStores } from "@/lib/coffee-stores";

export interface CoffeeStore {
  fsq_id: string;
  categories?: CategoriesEntity[] | null;
  chains?: null[] | null;
  distance: number;
  geocodes: Geocodes;
  link: string;
  location: Location;
  name: string;
  timezone: string;
}
export interface CategoriesEntity {
  id: number;
  name: string;
  icon: Icon;
}
export interface Icon {
  prefix: string;
  suffix: string;
}
export interface Geocodes {
  main: Main;
}
export interface Main {
  latitude: number;
  longitude: number;
}
export interface Location {
  country: string;
  cross_street: string;
  formatted_address: string;
  locality: string;
  region: string;
}

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
              {coffeeStores.map(({ fsq_id, name }) => (
                <Card
                  key={fsq_id}
                  name={name}
                  imgUrl={
                    "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                  }
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
