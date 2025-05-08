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
  address: "0xe89161615fCc987aFd21cF73FB397c57831bbD5b",
  chain: defineChain(31),
});
