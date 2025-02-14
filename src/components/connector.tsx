"use client";
import { useState } from "react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { WalletModal } from "./connector-modal";

const chainID = Number(process.env.NEXT_PUBLIC_MONAD_CHAIN_ID as string);

export function WalletConnection() {
  const [open, setOpen] = useState(false);
  const { address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const isWrongNetwork = chainId !== chainID;

  const handleSwitchNetwork = async () => {
    try {
      await switchChainAsync({
        chainId: chainID,
      });
    } catch (err) {
      console.error("Failed to switch network:", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  if (address && isWrongNetwork) {
    return (
      <button
        onClick={handleSwitchNetwork}
        className="bg-[#a1055c] rounded-lg h-[50px] px-4 font-bold text-2xl uppercase"
      >
        Switch to Monad Devnet
      </button>
    );
  }

  return (
    <div>
      {!address && (
        <WalletModal open={open} setOpen={setOpen}>
          <button
            onClick={() => setOpen(true)}
            className="bg-[#a1055c] rounded-lg h-[50px] px-4 font-bold text-2xl uppercase"
          >
            Connect Wallet
          </button>
        </WalletModal>
      )}
      {address && !isWrongNetwork && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleDisconnect}
            className="bg-[#a1055c] rounded-lg h-[50px] px-4 font-bold text-2xl uppercase"
          >
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </button>
        </div>
      )}
    </div>
  );
}
