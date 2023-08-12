// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CoffeeStore, fetchCoffeeStores } from "@/lib/coffee-stores";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | CoffeeStore[]>
) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  try {
    const { latLong, limit } = req.body;
    console.log(latLong, limit);
    if (latLong && limit) {
      const response = await fetchCoffeeStores(
        latLong.lat,
        latLong.long,
        limit
      );
      console.log(response);
      res.json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Oh no! something went wrong" });
  }
};

export default getCoffeeStoresByLocation;
