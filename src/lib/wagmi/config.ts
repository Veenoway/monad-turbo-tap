import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage, Storage } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
console.log("ProjectID:", projectId);
export const monadChain = {
  id: Number(process.env.NEXT_PUBLIC_MONAD_CHAIN_ID as unknown as number),
  name: "Monad Devnet",
  network: "Monad Devnet",
  nativeCurrency: {
    decimals: 18,
    name: "DMON",
    symbol: "DMON",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_MONAD_RPC_URL as string],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_MONAD_RPC_URL as string],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadScan",
      url: "https://scan.monad.com",
    },
  },
};

if (!projectId) throw new Error("Project ID is not defined");

export const networks = [monadChain];
const storage: Storage = createStorage({
  storage: cookieStorage,
});

export const wagmiAdapter = new WagmiAdapter({
  storage,
  ssr: true,
  networks,
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;
