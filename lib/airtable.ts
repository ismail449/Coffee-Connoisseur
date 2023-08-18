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
