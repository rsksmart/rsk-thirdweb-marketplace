import { useReadContract } from "thirdweb/react";
import { getAllListings } from "thirdweb/extensions/marketplace";
import type { Listing } from "@/types/marketplace";
import { type ContractOptions} from "thirdweb";

export function useListings(contract: ContractOptions) {
  const { data: rawListings, isLoading } = useReadContract(getAllListings, {
    contract: contract,
    start: 0,
    count: BigInt(10),
    queryOptions: {
      enabled: true,
      refetchInterval: 10000,
      retry: 3,
    }
  });

  // Transform the raw listings to match our Listing type
  const listings: Listing[] | undefined = rawListings?.map(listing => ({
    asset: {
      metadata: {
        image: listing.asset.metadata.image || '',
        name: listing.asset.metadata.name || ''
      },
      type: listing.asset.type
    },
    status: listing.status || 'ACTIVE',
    isReservedListing: listing.isReservedListing || false,
    tokenId: listing.tokenId || BigInt(0),
    currencyValuePerToken: listing.currencyValuePerToken
  }));

  return {
    listings,
    isLoading
  };
} 