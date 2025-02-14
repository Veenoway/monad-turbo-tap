import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constant/contract";
import { useCallback, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

type useRelayerReturn = {
  click: (playerAddress: string) => Promise<void>;
  submitScore: (score: number) => Promise<void>;
  leaderboard: unknown | [string[], number[], number[]]; // [topPlayersAddress[], scores[], txCounts[]]
  currentGlobalCount: unknown | [string, number, number]; // [topPlayersAddress, scores, txCounts]
  isLoading: boolean;
  error: string | null;
  txHashes: string[];
};

export function useRelayer(): useRelayerReturn {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txHashes, setTxHashes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // User TX amount
  const { data: currentGlobalCount, refetch: refetchGlobalCount } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "players",
      args: address ? [address] : undefined,
    });

  // General leaderboard
  const { data: leaderboard, refetch: fetchLeaderboard } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getLeaderboard",
  });

  // Create a tx
  const click = useCallback(
    async (playerAddress: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/relay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerAddress, action: "click" }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Transaction failed");
        }
        setTxHashes((prev) => [...prev, data.txHash]);
      } catch (e) {
        setError((e as { message: string }).message);
      } finally {
        setIsLoading(false);
        refetchGlobalCount();
        fetchLeaderboard();
      }
    },
    [refetchGlobalCount, fetchLeaderboard]
  );

  // Submit the user score ( optional )
  const submitScore = useCallback(
    async (score: number) => {
      if (!address) return;
      setIsLoading(true);
      setError(null);
      try {
        console.log("score: hook: ", score);
        const response = await fetch("/api/relay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerAddress: address,
            action: "submitScore",
            score,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Transaction failed");
        }
        setTxHashes((prev) => [...prev, data.txHash]);
      } catch (e) {
        setError((e as { message: string }).message);
      } finally {
        setIsLoading(false);
        refetchGlobalCount();
        fetchLeaderboard();
      }
    },
    [address, refetchGlobalCount, fetchLeaderboard]
  );

  return {
    click,
    submitScore,
    leaderboard,
    currentGlobalCount,
    isLoading,
    error,
    txHashes,
  };
}
