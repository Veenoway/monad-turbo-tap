"use client";

import { FC, PropsWithChildren } from "react";
import { useConnect } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./modal";

export const WalletModal: FC<
  PropsWithChildren & { open: boolean; setOpen: (value: boolean) => void }
> = ({ children, open, setOpen }) => {
  const { connect, connectors } = useConnect();
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        close={() => setOpen(false)}
        className="sm:max-w-[425px] font-boo text-white bg-[#190e59] p-10 rounded-2xl border border-[rgba(255,255,255,0.1)]"
      >
        <DialogHeader>
          <DialogTitle
            className="text-4xl uppercase italic mb-5 text-white"
            style={{
              fontFamily: "Boogaloo",
            }}
          >
            Connect Wallet
          </DialogTitle>
        </DialogHeader>
        <div
          className="grid grid-cols-2 gap-5 w-full"
          style={{
            fontFamily: "Boogaloo",
          }}
        >
          {connectors?.map((connector, i) => (
            <button
              key={i}
              onClick={() => {
                connect({ connector });
                setOpen(false);
              }}
              className=" bg-[#a1055c] col-span-1 rounded-lg h-[50px] px-2 font-medium text-xl uppercase"
            >
              {connector.name}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
