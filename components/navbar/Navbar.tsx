import logo from "@/app/assets/img/logo.svg";
import client from "@/lib/client";
import { ConnectButton } from "thirdweb/react";
import { useState } from "react";
import { SellSheet } from "@/components/SellSheet";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import { rootstockTestnet } from "@/app/utils/contracts";
const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "passkey", "phone"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];
function Navbar() {
  const [isSellOpen, setSellOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-4 md:px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 md:gap-6">
        <img src={logo.src} alt="logo" className="h-5 md:h-8" />
        <button
          className="md:px-4 px-2 py-2 text-white bg-black/30 backdrop-blur-md hover:bg-white/10 active:bg-white/20 focus:outline-none transition-colors text-sm font-medium"
          onClick={() => setSellOpen(true)}
        >
          Sell
        </button>
        <SellSheet isOpen={isSellOpen} onClose={() => setSellOpen(false)} />
      </div>
      <ConnectButton
        client={client}
        wallets={wallets}
        chain={rootstockTestnet}
        chains={[rootstockTestnet]}
        connectModal={{ size: "compact" }}
      />
    </nav>
  );
}

export default Navbar;
