const getUrlForCoffeeStores = (
  lat: string,
  long: string,
  query: string,
  limit: number
) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${long}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
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
  return coffeeData.results;
};
