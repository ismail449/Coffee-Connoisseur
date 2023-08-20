import type { NextApiRequest, NextApiResponse } from "next";
import { FieldSet } from "airtable";
import { getFieldsArray, table } from "@/lib/airtable";

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
    const records = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();
    if (records.length > 0) {
      const coffeeStores = getFieldsArray(records);
      res.send(coffeeStores);
    } else {
      res.status(404).send({ message: "id Not Found!" });
    }
  } catch (error) {
    console.log();
    if (error instanceof Error)
      res.status(500).send({ message: "something went wrong", error });
  }
};

export default getCoffeeStoreById;
