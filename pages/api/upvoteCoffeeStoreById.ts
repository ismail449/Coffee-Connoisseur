import { NextApiRequest, NextApiResponse } from "next";
import { findCoffeeStoreById, updateCoffeeStoreById } from "@/lib/airtable";
import { FieldSet } from "airtable";

type ErrorResponse = {
  message: string;
  error?: any;
};

const upvoteCoffeeStoreById = async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | FieldSet>
) => {
  if (req.method !== "PUT") {
    res.status(405).send({ message: "only put requests are allowed!" });
    return;
  }
  const { id } = req.body;
  if (!id) {
    res.status(400).send({ message: `id is messing` });
    return;
  }
  try {
    const coffeeStores = await findCoffeeStoreById(id);
    if (coffeeStores.length > 0) {
      const coffeeStore = coffeeStores[0];

      const upvoteCount = parseInt(coffeeStore.voting?.toString() ?? "") + 1;

      const updatedCoffeeStore = await updateCoffeeStoreById(
        coffeeStore.recordId as string,
        upvoteCount
      );

      if (updatedCoffeeStore) {
        res.send(updatedCoffeeStore);
      } else {
        res.status(500).send({ message: "something went wrong" });
      }
    } else {
      res.status(404).send({ message: "id Not Found!" });
    }
  } catch (error) {
    res.status(500).send({ message: "error up voting coffee store", error });
  }
};

export default upvoteCoffeeStoreById;
