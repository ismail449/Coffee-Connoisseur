import type { NextApiRequest, NextApiResponse } from "next";
import { FieldSet } from "airtable";
import { table, getFieldsArray, findCoffeeStoreById } from "@/lib/airtable";

type ErrorType = {
  message: string;
  error?: any;
};

const createCoffeeStore = async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorType | FieldSet[]>
) => {
  if (req.method === "POST") {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;
    if (!id) {
      res.status(400).send({ message: "id is messing" });
      return;
    }
    const coffeeStores = await findCoffeeStoreById(id);
    try {
      if (coffeeStores.length > 0) {
        res.send(coffeeStores);
      } else {
        if (id && name) {
          const createdRecord = await table.create([
            {
              fields: {
                id,
                name,
                address,
                neighborhood,
                voting,
                imgUrl,
              },
            },
          ]);
          const createdCoffeeStores = getFieldsArray(createdRecord);
          res.send(createdCoffeeStores);
        } else {
          res.status(400).send({ message: "id or name is messing" });
        }
      }
    } catch (error) {
      console.log("Error finding or creating store ", error);

      res
        .status(500)
        .json({ message: "Error finding or creating store", error: error });
    }
  }
};

export default createCoffeeStore;
