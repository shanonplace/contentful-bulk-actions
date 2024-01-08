import dotenv from "dotenv";
dotenv.config();
import {
  getDraftEntries,
  toSimpleEntries,
  validateItems,
  publishItems,
  unpublishItems,
} from "./contentful-fun.js";

// Exercise the bulk api endpoints to validate, pusblish and unpublish entries
async function processDraftEntries() {
  try {
    // Find some draft entries
    const draftEntries = await getDraftEntries();

    if (draftEntries.length === 0) return;

    // Transform to basic form of a content entry
    const bulkEntryItems = toSimpleEntries(draftEntries);

    // Now validate the items using the bulk action endpoint
    console.log("Validating items");
    const validationResponse = await validateItems(bulkEntryItems).catch(
      (error) => `Error validating items: ${error}`
    );

    if (!validationResponse) return;
    // Log the response
    console.log(
      `Validation response: ${JSON.stringify(validationResponse, null, 2)}`
    );

    // Get the canonical contentful json entry format, version is needed for publishing
    const bulkEntryItemsWithVersion = toSimpleEntries(draftEntries, true);

    // Now publish the items using the bulk action endpoint
    console.log("Publishing items");
    const publishResponse = await publishItems(bulkEntryItemsWithVersion).catch(
      (error) => `Error publishing items: ${error}`
    );
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

processDraftEntries();
