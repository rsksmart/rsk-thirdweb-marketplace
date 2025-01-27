import { MediaRenderer } from "thirdweb/react";
import { NFTCardProps, type Listing } from "@/types/marketplace"; 


export function NFTCard({ listing, client }: NFTCardProps) {
  return (
    <div className="bg-gray-50/10 backdrop-blur-md border border-white/10 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        <MediaRenderer
          client={client}
          src={listing.asset.metadata.image}
          className="absolute inset-0 w-full h-full object-cover top-[-40px]"
        />
      </div>

      {/* Name, Type, and Status */}
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-semibold text-white text-lg truncate">
              {listing.asset.metadata.name}
            </p>
            <p className="text-sm text-gray-400 shrink-0">
              {listing.asset.type}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`block w-3 h-3 rounded-full ${
                listing.status === 'ACTIVE'
                  ? 'bg-green-500'
                  : listing.status === 'RESERVED'
                  ? 'bg-amber-500'
                  : 'bg-gray-500'
              }`}
            ></span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                listing.isReservedListing
                  ? 'bg-indigo-500/20 text-indigo-200'
                  : 'bg-emerald-500/20 text-emerald-200'
              }`}
            >
              {listing.isReservedListing ? 'Reserved' : 'Public'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-300 font-medium">
          ID: {listing.tokenId?.toString()}
        </p>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="pt-2 border-t border-white/10">
          <p className="font-medium text-lg text-white">
            {listing.currencyValuePerToken?.displayValue}
            <span className="text-gray-300 font-normal ml-1">
              {listing.currencyValuePerToken?.symbol}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 