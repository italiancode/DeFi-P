const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const Metadata = require("@metaplex-foundation/mpl-token-metadata");

// Replace with your mint address (as a string).
const mintAddress = "YOUR_MINT_ADDRESS";  // Example: "So11111111111111111111111111111111111111112"

const connection = new Connection(clusterApiUrl("mainnet-beta"));

async function getMetadataPDA(mint) {
  const [publicKey] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      Metadata.PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    Metadata.PROGRAM_ID
  );
  return publicKey;
}

async function fetchMetadata() {
  try {
    const mint = new PublicKey(mintAddress);
    const pda = await getMetadataPDA(mint);

    // Fetch metadata from the blockchain
    const res = await Metadata.Metadata.fromAccountAddress(connection, pda);
    console.log("Metadata:", res);
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}

// Run the test
fetchMetadata();
