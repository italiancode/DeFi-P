'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import toast from 'react-hot-toast';

export const PortfolioOverview = () => {
  const { connected } = useWallet();
  const { balances, loading, error } = useTokenBalances();

  if (!connected) {
    return (
      <div className="p-8 bg-defi-dark-light rounded-lg text-center">
        <h2 className="text-xl mb-4">Please connect your wallet</h2>
      </div>
    );
  }

  if (loading && balances.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-defi-dark-light rounded-lg text-center">
        <h2 className="text-xl text-red-500 mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const totalValue = balances.reduce((sum, token) => sum + (token.usdValue || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-defi-dark-light rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Portfolio Value</h3>
          <p className="text-2xl font-bold">
            ${totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="p-6 bg-defi-dark-light rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Assets</h3>
          <p className="text-2xl font-bold">{balances.length}</p>
        </div>
      </div>

      <div className="bg-defi-dark-light rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Assets</h2>
        <div className="space-y-4">
          {balances
            .filter(token => token.name && token.symbol)
            .map((token) => (
            <div 
              key={token.mint}
              className="p-4 bg-defi-dark rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                {token.logoURI ? (
                  <img 
                    src={token.logoURI} 
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-defi-dark-light rounded-full flex items-center justify-center">
                    <span className="text-sm">{token.symbol.slice(0, 2)}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{token.symbol}</p>
                  <p className="text-sm text-gray-400">{token.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(token.mint);
                        toast.success('Mint address copied to clipboard', {
                          style: {
                            background: '#333',
                            color: '#fff',
                          },
                          duration: 2000,
                        });
                      }}
                      className="p-1 hover:bg-defi-dark-light rounded-full transition-colors"
                      title="Copy mint address"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-3 h-3 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {token.uiAmount.toLocaleString()} {token.symbol}
                </p>
                {token.usdValue && (
                  <p className="text-sm text-gray-400">
                    ${token.usdValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
          {balances.length === 0 && (
            <p className="text-center text-gray-400">No tokens found</p>
          )}
        </div>
      </div>
    </div>
  );
}; 