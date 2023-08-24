import Airtable, { FieldSet, Records } from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const table = base("coffee-stores");

export const getFieldsArray = (records: Records<FieldSet>): FieldSet[] => {
  return records.map(({ fields, id }) => {
    return {
      recordId: id,
      ...fields,
    };
  });
};

export const findCoffeeStoreById = async (id: string | string[]) => {
  const records = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  return getFieldsArray(records);
};

export const updateCoffeeStoreById = async (
  id: string,
  upvoteCount: number
) => {
  const records = await table.update([
    {
      id: id,
      fields: {
        voting: upvoteCount,
      },
    },
  ]);
  return getFieldsArray(records)[0];
};
