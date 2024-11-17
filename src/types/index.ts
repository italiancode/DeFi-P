export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  logoURI: string;
  uiAmount: number;
  usdValue?: number;
  investedAmount?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
} 