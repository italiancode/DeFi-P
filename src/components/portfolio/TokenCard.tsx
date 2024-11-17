'use client';

import { TokenBalance } from '@/hooks/useTokenBalances';

interface TokenCardProps {
  token: TokenBalance;
}

export const TokenCard = ({ token }: TokenCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-defi-dark rounded-lg hover:bg-defi-dark/80 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 relative">
          {token.logoURI ? (
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="w-10 h-10 bg-defi-dark-light rounded-full flex items-center justify-center">
                    <span class="text-sm">${token.symbol.slice(0, 2)}</span>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-defi-dark-light rounded-full flex items-center justify-center">
              <span className="text-sm">{token.symbol.slice(0, 2)}</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium">{token.symbol}</h4>
          <p className="text-sm text-gray-400">{token.name}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">{token.mint.slice(0, 8)}...{token.mint.slice(-8)}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(token.mint);
                // Optional: Add toast notification here
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
        <p className="font-medium">{token.uiAmount.toLocaleString()} {token.symbol}</p>
        {token.usdValue && (
          <p className="text-sm text-gray-400">
            ≈ ${token.usdValue.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </p>
        )}
      </div>
    </div>
  );
}; 