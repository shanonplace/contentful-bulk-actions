import contentful from "contentful-management";
import dotenv from "dotenv";
dotenv.config();

const client = contentful.createClient({
  accessToken: process.env.ACCESS_TOKEN,
});
const space = await client.getSpace(process.env.SPACE_ID);
const environment = await space.getEnvironment(process.env.ENVIRONMENT_ID);

export function toSimpleEntries(entryItems, includeVersion = false) {
  return entryItems.map((entryItem) => ({
    sys: {
      linkType: "Entry",
      type: "Link",
      id: entryItem.sys.id,
      ...(includeVersion ? { version: entryItem.sys.version } : {}),
    },
  }));
}

export async function getDraftEntries() {
  try {
    const response = await environment.getEntries({
      "sys.archivedAt[exists]": false,
      "sys.publishedAt[exists]": false,
    });
    return response.items;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}

export async function validateItems(entryItems) {
  try {
    const bulkActionInProgress = await environment.createValidateBulkAction({
      entities: {
        sys: { type: "Array" },
        items: entryItems,
      },
    });
    const bulkActionCompleted = await bulkActionInProgress.waitProcessing();
    return bulkActionCompleted;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return null;
  }
}

//now I need a method to publish the entries
export async function publishItems(entryItems) {
  try {
    const bulkActionInProgress = await environment.createPublishBulkAction({
      entities: {
        sys: { type: "Array" },
        items: entryItems,
      },
    });
    const bulkActionCompleted = await bulkActionInProgress.waitProcessing();
    return bulkActionCompleted;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//now I need a method to unpublish the entries
export async function unpublishItems(entryItems) {
  try {
    const bulkActionInProgress = await environment.createUnpublishBulkAction({
      entities: {
        sys: { type: "Array" },
        items: entryItems,
      },
    });
    const bulkActionCompleted = await bulkActionInProgress.waitProcessing();
    return bulkActionCompleted;
  } catch (error) {
    console.error(error);
    return null;
  }
}
