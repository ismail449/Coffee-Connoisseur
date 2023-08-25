export const isEmpty = (object: {}) => {
  if (typeof object !== "object") {
    return true;
  }
  return Object.keys(object).length === 0;
};

export const fetcher = (url: string) => {
  return fetch(url).then((res) => res.json());
};
