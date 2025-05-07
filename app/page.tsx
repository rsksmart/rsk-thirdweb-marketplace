"use client";
import client from "@/lib/client";
import { NFTGrid } from "@/components/NFTGrid";
import { NFTGridSkeleton } from "@/components/NFTSkeleton";
import { marketplaceContract } from "./config";
import { useReadContract } from "thirdweb/react";
import { getAllValidListings } from "thirdweb/extensions/marketplace";

export default function Home() {
  const { data: listings, isLoading } = useReadContract(getAllValidListings, { contract: marketplaceContract});

  return (
    <main className="flex flex-col min-h-screen w-full">
      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">  
        {isLoading ? (
          <NFTGridSkeleton />
        ) : listings && listings.length > 0 ? (
          <NFTGrid listings={listings} client={client} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl border border-white/10 max-w-md">
              <h3 className="text-xl font-semibold text-white mb-2">No NFTs Listed</h3>
              <p className="text-gray-400">There are currently no NFTs available in the marketplace.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}