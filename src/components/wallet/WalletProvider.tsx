'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Commitment } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// Construct RPC URL from environment variables
const MAINNET_RPC_URL = `${process.env.NEXT_PUBLIC_NODE_RPC_URL}${process.env.NEXT_PUBLIC_NODE_API_KEY}`;

if (!process.env.NEXT_PUBLIC_NODE_API_KEY) {
  console.warn('Missing API key in environment variables');
}

const connectionConfig = {
  commitment: 'confirmed' as Commitment,
  wsEndpoint: undefined,
  confirmTransactionInitialTimeout: 60000,
};

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = useMemo(() => MAINNET_RPC_URL, []);

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint} config={connectionConfig}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}; 