import {
  defineChain,
  getContract,
  sendTransaction
} from "thirdweb";
import { installPublishedExtension } from "thirdweb/extensions/dynamic-contracts";
import { privateKeyToAccount } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";


const privateKey = process.env.PRIVATE_KEY;
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT;

if (!privateKey || !marketplaceAddress) {
  throw new Error("Check your .env");
}

const client = createThirdwebClient({
 secretKey: process.env.THIRDWEB_SECRET_KEY || '',
});


const account = privateKeyToAccount({
  client,
  privateKey,
});


const rootstockTestnet = defineChain(31); // Rootstock Testnet (Chain ID 31)

const marketContract = getContract({
  client,
  chain: rootstockTestnet,
  address: marketplaceAddress.toLowerCase(),
});

// Create the transaction
const transaction = installPublishedExtension({
  account,
  contract: marketContract,
  extensionName: "DirectListingsLogic",
});

// Send the transaction
sendTransaction({ transaction, account }).then((tx) => {
  console.log(tx);
});
