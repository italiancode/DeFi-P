"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useCallback } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getMetadata } from "../utils/metadata";
import {
  generateTokenSymbolImage,
  loadTokenImage,
  SOL_LOGO_URI,
} from "../utils/images";
import { TokenBalance } from "../types/token";

import { fetchTokenPrices } from "../utils/prices";
import { withRetry } from "../utils/retry";

const WRAPPED_SOL_MINT = "So11111111111111111111111111111111111111112";

// type TokenData = {
//     mint: string;
//     amount: number;
//     // Add other properties as needed
// };

export const useTokenBalances = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBalance = (updatedToken: TokenBalance) => {
    setBalances((currentBalances) => {
      const existingIndex = currentBalances.findIndex(
        (t) => t.mint === updatedToken.mint
      );

      // Replace or add the token
      if (existingIndex >= 0) {
        const newBalances = [...currentBalances];
        newBalances[existingIndex] = updatedToken;
        return newBalances;
      }
      return [...currentBalances, updatedToken];
    });
  };

  const fetchBalances = useCallback(async () => {
    if (!connection || !publicKey) return;
    setLoading(true);
    setError(null);

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        // Phase 1: Get basic token info and prices first
        const tokenAccounts = await withRetry(() =>
          connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: SPL_TOKEN_PROGRAM_ID,
          })
        );

        const solBalance = await withRetry(() =>
          connection.getBalance(publicKey)
        );

        // Collect all token mints first for batch price fetching
        const mints = tokenAccounts.value
          .map((account) => account.account.data.parsed.info.mint)
          .filter((mint) => mint); // Filter out any null/undefined

        // Fetch all prices in one go
        const allTokenPrices = await fetchTokenPrices([
          WRAPPED_SOL_MINT,
          ...mints,
        ]);

        // Add SOL balance first
        const solToken: TokenBalance = {
          mint: "SOL",
          symbol: "SOL",
          name: "Solana",
          amount: solBalance,
          decimals: 9,
          uiAmount: solBalance / LAMPORTS_PER_SOL,
          logoURI: SOL_LOGO_URI,
          price: allTokenPrices[WRAPPED_SOL_MINT] || 0,
          usdValue:
            (solBalance / LAMPORTS_PER_SOL) *
            (allTokenPrices[WRAPPED_SOL_MINT] || 0),
        };
        updateBalance(solToken);

        // Phase 1: Add basic token info with prices
        for (const account of tokenAccounts.value) {
          const info = account.account.data.parsed.info;
          if (info.tokenAmount.uiAmount > 0) {
            const price = allTokenPrices[info.mint] || 0;
            const basicTokenInfo: TokenBalance = {
              mint: info.mint,
              symbol: "Loading...",
              name: "Loading...",
              amount: info.tokenAmount.amount,
              decimals: info.tokenAmount.decimals,
              uiAmount: info.tokenAmount.uiAmount,
              logoURI: generateTokenSymbolImage("..."),
              price,
              usdValue: info.tokenAmount.uiAmount * price,
            };
            updateBalance(basicTokenInfo);
          }
        }

        setLoading(false);

        // Phase 2: Fetch metadata and images
        for (const account of tokenAccounts.value) {
          const info = account.account.data.parsed.info;
          if (info.tokenAmount.uiAmount > 0) {
            try {
              const metadata = await withRetry(() =>
                getMetadata(new PublicKey(info.mint), connection)
              );

              if (!metadata) {
                console.error(`No metadata found for token ${info.mint}`);
                return; // Handle the case where metadata is null
              }

              const basicTokenInfo = {
                mint: info.mint,
                tokenAmount: info.tokenAmount,
                uiAmount: info.tokenAmount.uiAmount,
              };

              const updatedToken = await loadTokenImage(
                metadata,
                basicTokenInfo,
                allTokenPrices
              );

              // Ensure amount is a number
              const tokenToUpdate: TokenBalance = {
                ...updatedToken,
                amount: parseFloat(updatedToken.amount), // Convert amount to number
              };

              // Update balance with the corrected token
              updateBalance(tokenToUpdate);
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error("Error fetching metadata for token:", error.message);
                setError("Failed to fetch metadata. Please check your API key and connection.");
              } else {
                console.error("Unexpected error:", error);
                setError("An unexpected error occurred.");
              }
            }
          }
        }
        break; // Exit loop if successful
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching balances:", error.message); // Log the error message
          if ((error as any).response?.status === 429) {
            attempts++;
            const delay = Math.min(500 * attempts, 5000); // Exponential backoff
            console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            setError("Failed to fetch balances. Please check your API key and connection.");
          }
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
        }
        break; // Exit loop on other errors
      } finally {
        setLoading(false);
      }
    }
  }, [connection, publicKey]);

  useEffect(() => {
    if (connection && publicKey) {
      fetchBalances();
      const interval = setInterval(fetchBalances, 120000); // Refresh every 2 minutes
      return () => clearInterval(interval);
    }
  }, [publicKey, connection, fetchBalances]);

  return {
    balances,
    loading,
    error,
    refetch: fetchBalances,
  };
};
