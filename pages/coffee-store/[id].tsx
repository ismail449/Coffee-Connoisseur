import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import styles from "@/styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores, CoffeeStore } from "@/lib/coffee-stores";
import { useStoreContext } from "../../context/store-context";
import { fetcher, isEmpty } from "@/utils";
import useSWR from "swr";

export const getStaticProps: GetStaticProps<{
  coffeeStore: CoffeeStore;
}> = async ({ params }) => {
  const coffeeStores: CoffeeStore[] = await fetchCoffeeStores();
  const foundCoffeeStoreById = coffeeStores.find(
    (coffeeStoreData) => coffeeStoreData.id === params?.id
  );
  return {
    props: {
      coffeeStore: foundCoffeeStoreById
        ? foundCoffeeStoreById
        : ({} as CoffeeStore),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const coffeeStores: CoffeeStore[] = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id },
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
  const { coffeeStoresNearby } = useStoreContext();
  const [renderedCoffeeStore, setRenderedCoffeeStore] =
    useState<CoffeeStore>(coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const id = router.query.id;
  const { data, error, isLoading } = useSWR<CoffeeStore[]>(
    `/api/getCoffeeStoreById?id=${id}`,
    fetcher
  );

  const handleCreateCoffeeStore = async (coffeeStore: CoffeeStore) => {
    try {
      const { address, id, imgUrl, name, neighborhood } = coffeeStore;

      if (!id) {
        return;
      }
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          imgUrl,
          name,
          voting: 0,
          neighborhood: neighborhood || "",
          address: address || "",
        }),
      });
      const fetchedCoffeeStore = (await response.json()) as CoffeeStore;
    } catch (error) {
      console.error("Error creating a coffee store ", error);
    }
  };

  useEffect(() => {
    if (data && data.length) {
      setRenderedCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  useEffect(() => {
    const isCoffeeStoreEmpty = isEmpty(coffeeStore);
    if (isCoffeeStoreEmpty && coffeeStoresNearby.length > 0) {
      const foundCoffeeStoreById = coffeeStoresNearby.find(
        (coffeeStoreData) => coffeeStoreData.id === id
      );
      if (foundCoffeeStoreById) {
        setRenderedCoffeeStore(foundCoffeeStoreById);
        handleCreateCoffeeStore(foundCoffeeStoreById);
      }
    } else {
      handleCreateCoffeeStore(coffeeStore);
    }
  }, [coffeeStore, coffeeStoresNearby, id]);

  const handleUpVoteButton = async () => {
    try {
      if (!id) {
        return;
      }
      const response = await fetch("/api/upvoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const fetchedCoffeeStore = (await response.json()) as CoffeeStore;

      if (fetchedCoffeeStore) {
        setVotingCount(fetchedCoffeeStore.voting);
      }
    } catch (error) {
      console.error("Error up voting coffee store ", error);
    }
  };
  if (router.isFallback || isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !renderedCoffeeStore) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }
  const { address, name, neighborhood, imgUrl } = renderedCoffeeStore;
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            alt={name}
            width={600}
            height={360}
            className={styles.storeImage}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address ? (
            <div className={styles.iconWrapper}>
              <Image
                alt="places icon"
                src="/static/icons/places.svg"
                width={24}
                height={24}
              />
              <p className={styles.text}>{address}</p>
            </div>
          ) : null}
          {neighborhood ? (
            <div className={styles.iconWrapper}>
              <Image
                alt="near me icon"
                src="/static/icons/nearMe.svg"
                width={24}
                height={24}
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          ) : null}
          <div className={styles.iconWrapper}>
            <Image
              alt="star icon"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{votingCount}</p>
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
