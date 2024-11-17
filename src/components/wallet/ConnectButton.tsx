'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const ConnectButton: FC = () => {
  const { connected } = useWallet();

  return (
    <div className="flex items-center justify-center">
      <WalletMultiButton />
    </div>
  );
}; 