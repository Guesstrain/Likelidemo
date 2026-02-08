'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { AppKitProvider } from '@reown/appkit/react';
import type { AppKitOptions } from '@reown/appkit';
import { bsc } from '@reown/appkit/networks';

import { appKitOptions, appKitProjectId, wagmiConfig } from '../lib/appkit';

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

// Fallback AppKit options when not configured
const fallbackAppKitOptions: AppKitOptions = {
  projectId: 'fallback',
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

export default function AppProviders({ children }: Props) {
  // Always provide WagmiProvider and AppKitProvider to avoid hook errors
  // Use fallback config if not configured
  const options = appKitOptions || fallbackAppKitOptions;
  
  if (!appKitProjectId || !appKitOptions) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AppKit providers are not configured. Define NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Wallet features are disabled.',
      );
    }
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider {...options}>{children}</AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
