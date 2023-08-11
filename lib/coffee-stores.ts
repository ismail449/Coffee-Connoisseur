import { createApi } from "unsplash-js";
interface FetchedCoffeeStore {
  fsq_id: string;
  location: Location;
  name: string;
}

export interface CoffeeStore {
  id: string;
  imgUrl: string;
  name: string;
  address: string;
  neighborhood: string;
}

interface Location {
  country: string;
  cross_street: string;
  formatted_address: string;
  locality: string;
  region: string;
}
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
});
const getCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response?.results.map(
    (result) => result.urls["regular"]
  );
  return unsplashResults || "";
};

const getUrlForCoffeeStores = (
  lat: number,
  long: number,
  query: string,
  limit: number
) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${long}&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  lat = 30.059522635023235,
  long = 31.220919917913005,
  limit = 6
) => {
  const unsplashResults = await getCoffeeStoresPhotos();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQURE_API_KEY!,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores(lat, long, "coffee", limit),
    options
  );
  const coffeeData = await response.json();
  return coffeeData.results.map((result: FetchedCoffeeStore, index: number) => {
    return {
      id: result.fsq_id,
      imgUrl:
        unsplashResults.length > 0
          ? unsplashResults[index]
          : "/static/coffee-store-fallback.jpg",
      address: result.location.formatted_address,
      neighborhood: result.location.locality,
      name: result.name,
    };
  }) as CoffeeStore[];
};
