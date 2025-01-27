"use client";
import client from "@/lib/client";
import { NFTGrid } from "@/components/NFTGrid";
import { useListings } from "@/hooks/useListings";
import { MARKETPLACE_SEPOLIA } from "./utils/contracts";

export default function Home() {
  const { listings, isLoading } = useListings(MARKETPLACE_SEPOLIA);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto backdrop-blur-md min-h-screen">
      {listings && listings.length > 0 ? (
        <NFTGrid listings={listings} client={client} />
      ) : (
        <p className="text-gray-300 text-center text-lg">No NFTs listed</p>
      )}
    </div>
  );
}