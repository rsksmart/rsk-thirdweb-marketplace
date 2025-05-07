import { ThirdwebClient } from "thirdweb";
import type { DirectListing } from "thirdweb/extensions/marketplace";

// Update type to extend thirdweb's DirectListing
export type Listing = DirectListing;

export interface NFTCardProps {
  listing: Listing;
  client: ThirdwebClient; 
}

export interface NFTGridProps {
  listings: Listing[];
  client: ThirdwebClient; 
}