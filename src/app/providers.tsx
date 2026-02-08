'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { AppKitProvider } from '@reown/appkit/react';

import { appKitOptions, appKitProjectId, wagmiConfig } from '../lib/appkit';

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export default function AppProviders({ children }: Props) {
  // 如果在本地开发环境且没有配置 WalletConnect Project ID，
  // 只渲染 children，用于「只看 UI」，不启用钱包相关功能。
  if (process.env.NODE_ENV === 'development' && !appKitProjectId) {
    console.warn(
      'AppKit providers are not configured. Define NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Wallet features are disabled in development.',
    );
    return <>{children}</>;
  }

  if (!wagmiConfig || !appKitOptions) {
    throw new Error(
      'AppKit providers are not configured. Define NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.',
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider {...appKitOptions}>{children}</AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
