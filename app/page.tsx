"use client";
import client from "@/lib/client";
import { NFTGrid } from "@/components/NFTGrid";
import { useListings } from "@/hooks/useListings";
import { marketplaceContract } from "./config";
import { SellForm } from "@/components/SellSheet"

export default function Home() {
  const { listings, isLoading } = useListings(marketplaceContract);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto backdrop-blur-md min-h-screen">
      <div className="mb-8">
        <SellForm />
      </div>
      
      {listings && listings.length > 0 ? (
        <NFTGrid listings={listings} client={client} />
      ) : (
        <p className="text-gray-300 text-center text-lg">No NFTs listed</p>
      )}
    </div>
  );
}