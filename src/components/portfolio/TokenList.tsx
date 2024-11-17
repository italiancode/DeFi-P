import { useState } from 'react';
import { TokenInfo } from '@/types';
import TokenListItem from './TokenListItem';
import { ArrowDownUp, DollarSign, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const TokenList = ({ tokens }: { tokens: TokenInfo[] }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = a.usdValue || 0;
    const bValue = b.usdValue || 0;
    return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
  });

  return (
    <div className="bg-defi-light dark:bg-defi-dark-light rounded-lg p-3 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Assets</h2>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
              bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 
              dark:hover:bg-gray-700 transition-colors
              text-sm font-medium text-gray-700 dark:text-gray-300">
              <ArrowDownUp className="w-4 h-4" />
              Sort
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1.5 
                animate-in fade-in-0 zoom-in-95"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md
                  ${sortDirection === 'desc' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                  text-gray-700 dark:text-gray-300`}
                onClick={() => setSortDirection('desc')}
              >
                <DollarSign className="w-4 h-4" />
                Highest value first
              </DropdownMenu.Item>
              
              <DropdownMenu.Item
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md
                  ${sortDirection === 'asc' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                  text-gray-700 dark:text-gray-300`}
                onClick={() => setSortDirection('asc')}
              >
                <DollarSign className="w-4 h-4" />
                Lowest value first
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {sortedTokens.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No tokens found
          </p>
        ) : (
          sortedTokens.map((token) => (
            <TokenListItem key={token.mint} token={token} />
          ))
        )}
      </div>
    </div>
  );
}; 