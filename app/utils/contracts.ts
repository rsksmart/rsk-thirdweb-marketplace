import client from "@/lib/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { defineChain } from "thirdweb/chains";

export const rootstockTestnet = defineChain({
  id: 31,
  rpc: "https://rpc.testnet.rootstock.io/3Lpuhd84xwSQ64qzsFmx6dZmIdfYOH-T",
  nativeCurrency: {
    name: "rBTC",
    symbol: "rBTC",
    decimals: 18,
  },
});

export const marketplaceContract = getContract({
  client,
  address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!,
  chain: defineChain(31),
});
