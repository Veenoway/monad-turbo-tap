"use client";
import { WalletConnection } from "@/components/connector";
import { useRelayer } from "@/hook/useRelayer";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";

export const Home = () => {
  const { address } = useAccount();
  const [count, setCount] = useState(0);
  const { click } = useRelayer();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!address) return;
    const target = e.currentTarget;
    target.style.transform = "scale(0.9)";
    setTimeout(() => {
      target.style.transform = "scale(1)";
    }, 100);
    setCount((prev) => prev + 1);
    click(address);
  };

  return (
    <main
      className="flex items-center justify-center w-screen min-h-screen bg-[#190e59]"
      style={{
        fontFamily: "Boogaloo",
      }}
    >
      <div className="absolute right-5 top-5">
        <WalletConnection />
      </div>
      <div className="flex flex-col justify-center items-center gap-8">
        <p className="text-5xl text-white uppercase">Tx count: {count}</p>
        <button
          className="bg-[#a1055c] disabled:opacity-50 disabled:cursor-not-allowed text-3xl uppercase px-5 h-[60px] w-fit rounded-lg transition-all duration-100 ease-in-out"
          onClick={handleClick}
          disabled={!address}
        >
          Create a tx
        </button>
      </div>
      <div className="absolute left-5 bottom-5">
        <Link
          href="https://x.com/Novee_VeenoX"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="w-full h-full relative flex items-center gap-5">
            <img
              src="/logo/novee.png"
              alt="Logo"
              className="w-20 h-20 mt-auto"
            />
            <div className="relative bg-white rounded-[60px] py-4 mb-10 px-6 shadow-xl">
              <p className="text-2xl text-gray-800 uppercase leading-tight italic">
                Hope it will <br />
                help you out fam!
              </p>
              <div className="absolute bottom-[15px] -left-2 rotate-180 w-0 h-0 border-t-[15px] border-t-white border-l-8 border-l-transparent border-r-[15px] border-r-transparent" />
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
};
