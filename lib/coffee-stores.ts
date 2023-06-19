import { createApi } from "unsplash-js";
export interface CoffeeStore {
  fsq_id: string;
  imgUrl: string;
  location: Location;
  name: string;
}

interface Location {
  country: string;
  cross_street: string;
  formatted_address: string;
  locality: string;
  region: string;
}
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});
const getCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  const unsplashResults = photos.response?.results.map(
    (result) => result.urls["small"]
  );
  return unsplashResults;
};

const getUrlForCoffeeStores = (
  lat: string,
  long: string,
  query: string,
  limit: number
) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${long}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const unsplashResults =
    (await getCoffeeStoresPhotos()) ||
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.FOURSQURE_API_KEY!,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(
      "30.059522635023235",
      "31.220919917913005",
      "coffee",
      6
    ),
    options
  );
  const coffeeData = await response.json();
  return coffeeData.results.map((result: {}, index: number) => {
    return {
      ...result,
      imgUrl: unsplashResults[index],
    };
  }) as CoffeeStore[];
};
