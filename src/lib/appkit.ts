import type { AppKitOptions } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc, type AppKitNetwork } from '@reown/appkit/networks';
import type { Config } from 'wagmi';
import { cookieStorage, createStorage, createConfig, http } from 'wagmi';

const FALLBACK_APP_METADATA = {
  name: 'Likeli.io',
  description: "World's first leveraged prediction market",
  url: 'https://likeli.io',
  icons: ['https://likeli.io/icon.png'],
};

export const appKitProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bsc];

const wagmiAdapter = appKitProjectId
  ? new WagmiAdapter({
      projectId: appKitProjectId,
      networks,
      ssr: true,
      storage: createStorage({ storage: cookieStorage }),
    })
  : undefined;

export const wagmiConfig: Config = wagmiAdapter?.wagmiConfig || createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});

export const appKitOptions: AppKitOptions | null = wagmiAdapter
  ? {
      projectId: appKitProjectId,
      adapters: [wagmiAdapter],
      networks,
      defaultNetwork: networks[0],
      metadata: FALLBACK_APP_METADATA,
    }
  : null;
