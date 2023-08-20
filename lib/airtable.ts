import Airtable, { FieldSet, Records } from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export const table = base("coffee-stores");

export const getFieldsArray = (records: Records<FieldSet>) => {
  return records.map(({ fields }) => {
    return {
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
