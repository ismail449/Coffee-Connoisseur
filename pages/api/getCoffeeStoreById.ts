import type { NextApiRequest, NextApiResponse } from "next";
import { FieldSet } from "airtable";
import { getFieldsArray, table, findCoffeeStoreById } from "@/lib/airtable";

type ErrorType = {
  message: string;
  error?: Error;
};

const getCoffeeStoreById = async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorType | FieldSet[]>
) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ message: "id is messing" });
    return;
  }
  try {
    const coffeeStores = await findCoffeeStoreById(id);
    if (coffeeStores.length > 0) {
      res.send(coffeeStores);
    } else {
      res.status(404).send({ message: "id Not Found!" });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: "something went wrong", error });
  }
};

export default getCoffeeStoreById;
