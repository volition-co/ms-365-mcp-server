import fs from 'fs';

// Pinned to a msgraph-metadata commit for reproducible generation; bump it (and run with --force) to pick up new endpoints.
const MSGRAPH_METADATA_COMMIT = '8c562525694550601a232cb54014e48c6c7f6da0';

const DEFAULT_OPENAPI_URL = `https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/${MSGRAPH_METADATA_COMMIT}/openapi/v1.0/openapi.yaml`;

// Microsoft publishes a parallel /beta OpenAPI spec at the same path root. Endpoints
// flagged "apiVersion": "beta" in endpoints.json are generated from this spec instead.
export const BETA_OPENAPI_URL = `https://raw.githubusercontent.com/microsoftgraph/msgraph-metadata/${MSGRAPH_METADATA_COMMIT}/openapi/beta/openapi.yaml`;

export async function downloadGraphOpenAPI(
  targetDir,
  targetFile,
  openapiUrl = DEFAULT_OPENAPI_URL,
  forceDownload = false
) {
  if (!fs.existsSync(targetDir)) {
    console.log(`Creating directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(targetFile) && !forceDownload) {
    console.log(`OpenAPI specification already exists at ${targetFile}`);
    console.log('Use --force to download again');
    return false;
  }

  console.log(`Downloading OpenAPI specification from ${openapiUrl}`);

  try {
    const response = await fetch(openapiUrl);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    fs.writeFileSync(targetFile, content);
    console.log(`OpenAPI specification downloaded to ${targetFile}`);
    return true;
  } catch (error) {
    console.error('Error downloading OpenAPI specification:', error.message);
    throw error;
  }
}
