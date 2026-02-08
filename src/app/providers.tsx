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
  // 如果没有配置 WalletConnect Project ID，只渲染 children
  // 这样可以在构建时和开发时都能正常工作
  if (!appKitProjectId || !wagmiConfig || !appKitOptions) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AppKit providers are not configured. Define NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Wallet features are disabled.',
      );
    }
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider {...appKitOptions}>{children}</AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
