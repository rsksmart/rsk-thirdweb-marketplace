import { useListings } from "@/hooks/useListings";
import client from "@/lib/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { defineChain } from "thirdweb/chains";

export const rootstockTestnet = defineChain({
    id: 31,
    rpc: 'https://rpc.testnet.rootstock.io/3Lpuhd84xwSQ64qzsFmx6dZmIdfYOH-T', 
    nativeCurrency: {
      name: "rBTC",
      symbol: "rBTC",  
      decimals: 18,
    },
  });

export const MARKETPLACE = getContract({
	address: '0x3830e3b28e6927658fFF2F34c12BF91f4Ca16103',
	client,
	chain: rootstockTestnet,
});

export const MARKETPLACE_SEPOLIA  = getContract({
    client: client,
    address: '0x36Df35ba24Ec05413c6F88aD0320dc60d299Ccaf',
    chain: sepolia
  });
