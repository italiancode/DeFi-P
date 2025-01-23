export const generateTokenSymbolImage = (symbol: string): string => {
  console.log(`🎨 Generating fallback image for symbol: ${symbol}`);
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2D3748"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="60"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${symbol}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Cache for failed URIs to avoid retrying them
const FAILED_URI_CACHE = new Set<string>();

// Add similar caching for images
const imageCache = new Map<string, string>();
// const failedImageRequests = new Set<string>();

export const fetchMetadataImage = async (
  uri: string | null,
  symbol: string
): Promise<string> => {
  try {
    console.log(`🔍 Fetching image for token: ${symbol}`);

    // Check custom images first
    if (CUSTOM_TOKEN_IMAGES[symbol]) {
      console.log(`✅ Found custom image for ${symbol}`);
      return CUSTOM_TOKEN_IMAGES[symbol];
    }

    // Handle null/undefined/empty URI
    if (!uri?.trim()) {
      console.log(`⚠️ No valid URI provided for ${symbol}, generating fallback`);
      return generateTokenSymbolImage(symbol);
    }

    // Skip if URI is already known to fail
    if (FAILED_URI_CACHE.has(uri)) {
      console.log(`⏩ Skipping known failed URI for ${symbol}, using fallback`);
      return generateTokenSymbolImage(symbol);
    }

    // Check cache first
    if (imageCache.has(uri)) {
      console.log("📋 Using cached image for:", symbol);
      return imageCache.get(uri)!;
    }

    // Check if URI is already an image URL (ends with image extension)
    const imageExtensions = /\.(jpg|jpeg|png|gif|svg)$/i;
    if (imageExtensions.test(uri)) {
      console.log(`🖼️ URI is already an image URL for ${symbol}`);
      const imageUrl = uri.replace("cf-ipfs.com", "ipfs.io");
      imageCache.set(uri, imageUrl);
      return imageUrl;
    }

    // Try to fetch metadata image
    console.log(`📡 Fetching metadata from URI: ${uri}`);
    const response = await fetch(uri, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.log(`🚫 Bad response for ${symbol} (${response.status}), caching as failed`);
      FAILED_URI_CACHE.add(uri);
      return generateTokenSymbolImage(symbol);
    }

    const metadata = await response.json();
    let imageURI = metadata?.image;

    if (!imageURI) {
      console.log(`⚠️ No image found in metadata for ${symbol}, generating fallback`);
      return generateTokenSymbolImage(symbol);
    }

    // Convert IPFS URLs if necessary
    if (imageURI.startsWith('ipfs://')) {
      imageURI = `https://ipfs.io/ipfs/${imageURI.slice(7)}`;
    }

    imageURI = imageURI.replace("cf-ipfs.com", "ipfs.io");

    // Verify the image URL is accessible
    try {
      const imageResponse = await fetch(imageURI, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });

      if (!imageResponse.ok) {
        console.log(`🚫 Image URL not accessible for ${symbol}, caching as failed`);
        FAILED_URI_CACHE.add(uri);
        return generateTokenSymbolImage(symbol);
      }

      console.log(`🖼️ Found valid image URI for ${symbol}`);
      imageCache.set(uri, imageURI);
      return imageURI;
    } catch (imageError) {
      console.log(`🚫 Image fetch failed for ${symbol}, caching as failed:`, imageError);
      FAILED_URI_CACHE.add(uri);
      return generateTokenSymbolImage(symbol);
    }
  } catch (error) {
    console.error(`❌ Error fetching metadata for ${symbol}:`, error);
    if (uri) {
      FAILED_URI_CACHE.add(uri);
    }
    return generateTokenSymbolImage(symbol);
  }
};

export const CUSTOM_TOKEN_IMAGES: Record<string, string> = {
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=035",
};

// Define appropriate types for metadata and basicTokenInfo
interface MetadataType {
  uri?: string;
  symbol?: string;
  name?: string;
  data?: {
    uri?: string;
    symbol?: string;
    name?: string;
  };
}

interface BasicTokenInfoType {
  mint: string;
  tokenAmount: {
    amount: string;
    decimals: number;
  };
  uiAmount: number;
}

export const loadTokenImage = async (
  metadata: MetadataType, // Updated type
  basicTokenInfo: BasicTokenInfoType, // Updated type
  tokenPrices: Record<string, number>
) => {
  let logoURI = metadata?.uri;
  
  if (metadata?.data?.uri) {
    logoURI = metadata.data.uri;
  }

  if (!logoURI) {
    logoURI = generateTokenSymbolImage(metadata?.symbol || "Unknown");
  }

  if (typeof logoURI === 'string') {
    logoURI = logoURI.replace("cf-ipfs.com", "ipfs.io");
  }

  const symbol = metadata?.symbol || metadata?.data?.symbol || "Unknown";
  const imageURI = await fetchMetadataImage(logoURI, symbol);
  const price = tokenPrices[basicTokenInfo.mint] || 0;

  return {
    mint: basicTokenInfo.mint,
    symbol,
    name: metadata?.name || metadata?.data?.name || "Unknown Token",
    amount: basicTokenInfo.tokenAmount.amount,
    decimals: basicTokenInfo.tokenAmount.decimals,
    uiAmount: basicTokenInfo.uiAmount,
    logoURI: imageURI,
    price,
    usdValue: basicTokenInfo.uiAmount * price,
  };
};

// Add SOL token image constant
export const SOL_LOGO_URI = "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
