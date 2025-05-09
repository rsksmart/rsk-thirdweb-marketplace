import { NFTCard } from "./NFTCard";
import { NFTGridProps } from "@/types/marketplace";

export function NFTGrid({ listings, client }: NFTGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {listings.map((listing, index) => (
        <NFTCard
          key={`nft-${listing.id || index}`}
          listing={listing}
          client={client}
        />
      ))}
    </div>
  );
}
