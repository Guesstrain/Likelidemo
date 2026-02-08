'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { AppKitProvider } from '@reown/appkit/react';

import { appKitOptions, appKitProjectId, wagmiConfig } from '../lib/appkit';
import { bsc } from '@reown/appkit/networks';

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export default function AppProviders({ children }: Props) {
  // Always provide WagmiProvider and AppKitProvider to avoid hook errors during SSR
  // If appKitOptions is not configured, use minimal fallback config
  if (!appKitProjectId || !appKitOptions) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AppKit providers are not configured. Define NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Wallet features are disabled.',
      );
    }
    // Provide minimal providers to avoid hook errors
    // AppKitProvider with minimal config to allow hooks to work
    const fallbackAppKitOptions = {
      projectId: '',
      adapters: [],
      networks: [bsc],
      defaultNetwork: bsc,
      metadata: {
        name: 'Likeli.io',
        description: "World's first leveraged prediction market",
        url: 'https://likeli.io',
        icons: [],
      },
    };
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <AppKitProvider {...fallbackAppKitOptions}>{children}</AppKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
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
