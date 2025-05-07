import logo from "@/app/assets/img/logo.svg";
import client from "@/lib/client";
import { ConnectButton } from "thirdweb/react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SellForm } from "@/components/SellSheet";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "email",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];
function Navbar() {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <img src={logo.src} alt="logo" className="h-8" />
        <Sheet>
          <SheetTrigger asChild>
            <button className="px-4 py-2 text-white bg-black/30 backdrop-blur-md hover:bg-white/10 active:bg-white/20 focus:outline-none transition-colors text-sm font-medium">
              Sell
            </button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SellForm />
          </SheetContent>
        </Sheet>
      </div>
      <ConnectButton 
        client={client}  
        wallets={wallets}
        connectModal={{ size: "compact" }} 
      />
    </nav>
  );
}

export default Navbar;
