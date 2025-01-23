import { PublicKey } from "@solana/web3.js";
import { getMetadataAccountDataSerializer } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@solana/web3.js";

// Constants
export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const INITIAL_DELAY = 2000; // Start with 2 seconds
const MAX_DELAY = 10000; // Max delay of 10 seconds
const MAX_RETRIES = 3;
const FAILED_METADATA_CACHE = new Set<string>();

// Type for metadata
interface TokenMetadata {
  name?: string;
  symbol?: string;
  uri?: string;
  // Other fields can be added as needed
}

// MetadataCache class with type safety
export class MetadataCache {
  private static cache: Map<string, TokenMetadata | null> = new Map();

  static get(mint: PublicKey): TokenMetadata | null {
    const cached = this.cache.get(mint.toString());
    if (cached) {
      console.log(`📋 Using cached metadata for: ${mint.toString()}`);
    }
    return cached || null;
  }

  static set(mint: PublicKey, metadata: TokenMetadata | null): void {
    if (metadata) {
      console.log(`💾 Caching metadata for: ${mint.toString()}`);
      this.cache.set(mint.toString(), metadata);
    }
  }

  static has(mint: PublicKey): boolean {
    return this.cache.has(mint.toString());
  }

  // Method to validate metadata
  static isValidMetadata(metadata: TokenMetadata | null): boolean {
    return (
      metadata !== null &&
      metadata !== undefined &&
      Object.keys(metadata).length > 0
    );
  }
}

// Utility function for sleep with exponential backoff
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getBackoffDelay = (attempt: number) => {
  return Math.min(INITIAL_DELAY * Math.pow(2, attempt), MAX_DELAY);
};

// Add rate limiting and caching logic
// const RATE_LIMIT_DELAY = 2000; // 2 seconds

// Cache for metadata requests
// const metadataCache = new Map<string, any>();
// const failedRequests = new Set<string>();

// Main function to fetch metadata
export const getMetadata = async (
  mint: PublicKey,
  connection: Connection // Change 'any' to a more specific type, e.g., Connection
): Promise<TokenMetadata | null> => {
  const mintAddress = mint.toBase58();

  // Check memory cache first
  const cachedMetadata = MetadataCache.get(mint);
  if (cachedMetadata !== null) {
    return cachedMetadata;
  }

  // Skip if already marked as failed
  if (FAILED_METADATA_CACHE.has(mintAddress)) {
    console.log(`⏩ Skipping known failed metadata for mint: ${mintAddress}`);
    return null;
  }

  try {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    // Attempt to retrieve metadata with retry mechanism
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const metadataAccount = await connection.getAccountInfo(
          metadataAddress
        ); // Change 'any' to a more specific type if possible
        if (!metadataAccount) {
          FAILED_METADATA_CACHE.add(mintAddress);
          return null;
        }

        const metadata = getMetadataAccountDataSerializer().deserialize(
          metadataAccount.data
        )[0];

        // Validate and cache metadata
        if (MetadataCache.isValidMetadata(metadata)) {
          MetadataCache.set(mint, metadata);
          return metadata;
        } else {
          console.log(`⚠️ Invalid metadata received for: ${mintAddress}`);
          FAILED_METADATA_CACHE.add(mintAddress);
          return null;
        }
      } catch (e) {
        if (e instanceof Error && e.message.includes("429")) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `⏳ Rate limited (attempt ${
              attempt + 1
            }/${MAX_RETRIES}), waiting ${delay}ms...`
          );
          await sleep(delay);
          continue;
        }
        throw e;
      }
    }

    // Cache failure if retries are exhausted
    FAILED_METADATA_CACHE.add(mintAddress);
    return null;
  } catch (e) {
    console.error(
      "Error fetching metadata:",
      e instanceof Error ? e.message : e
    );
    FAILED_METADATA_CACHE.add(mintAddress);
    return null;
  }
};

// Debug function to inspect cache
export function debugCache() {
  const cache = MetadataCache["cache"];
  console.log("🔍 Current Cache Status:");
  console.log(`Total cached items: ${cache.size}`);
  for (const [key, value] of cache.entries()) {
    console.log(`${key}: ${value ? "✅ Has Data" : "❌ No Data"}`);
  }
}
