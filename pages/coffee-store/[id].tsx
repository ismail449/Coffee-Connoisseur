import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import coffeeStoresData from "../../data/coffee-stores.json";
import Head from "next/head";
import styles from "@/styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";

export const getStaticProps: GetStaticProps<{
  coffeeStore: (typeof coffeeStoresData)[0];
}> = ({ params }) => {
  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        (coffeeStore) => coffeeStore.id.toString() === params?.id
      )!,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id.toString() },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore = ({
  coffeeStore,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  const handleUpVoteButton = () => {};
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore?.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore?.name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={coffeeStore?.imgUrl ?? ""}
              alt={coffeeStore.name}
              width={600}
              height={360}
              className={styles.storeImage}
            />
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              alt="icon"
              src="/static/icons/places.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              alt="icon"
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{coffeeStore?.neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              alt="icon"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{1}</p>
          </div>
          <button className={styles.upVoteButton} onClick={handleUpVoteButton}>
            Up Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
