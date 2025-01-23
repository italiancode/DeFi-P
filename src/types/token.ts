export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  logoURI?: string;
  uiAmount: number;
  price?: number;
  profitLossPercentage?: number;
  usdValue?: number;
  investedAmount?: number;
}

export interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  logoURI: string;
  price: number;
  usdValue: number;
}

// interface TokenMetadata {
//   symbol: string;
//   name: string;
//   logoURI?: string | null;
// } 