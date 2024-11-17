'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { PortfolioStats } from './PortfolioStats';
import { TokenList } from './TokenList';
import { TokenInfo } from '@/types/index';

export const PortfolioOverview = () => {
  const { connected } = useWallet();
  const { balances = [], loading = false, error = null } = useTokenBalances();

  if (!connected) {
    return (
      <div className="p-8 bg-defi-light dark:bg-defi-dark-light rounded-lg text-center text-gray-800 dark:text-white">
        <h2 className="text-xl mb-4">Please connect your wallet</h2>
      </div>
    );
  }

  if (loading && balances.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-defi-light dark:bg-defi-dark-light rounded-lg text-center">
        <h2 className="text-xl text-red-500 mb-4">Error</h2>
        <p className="text-gray-800 dark:text-white">{typeof error === 'string' ? error : 'An unexpected error occurred'}</p>
      </div>
    );
  }

  const totalValue = balances.reduce((sum, token) => sum + (token.usdValue || 0), 0);
  const filteredTokens = balances.filter(token => token.name && token.symbol);

  return (
    <div className="space-y-6">
      <PortfolioStats totalValue={totalValue} totalAssets={filteredTokens.length} />
      <TokenList tokens={filteredTokens.filter(token => 
        token.logoURI && typeof token.logoURI === 'string' && token.mint && token.uiAmount
      ) as TokenInfo[]} />
    </div>
  );
};
