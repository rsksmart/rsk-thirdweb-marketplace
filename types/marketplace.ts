import {  ThirdwebClient } from "thirdweb";

export interface Listing {
  asset: {
    metadata: {
      image: string;
      name: string;
    };
    type: string;
  };
  status: 'ACTIVE' | 'RESERVED' | string;
  isReservedListing: boolean;
  tokenId: bigint;
  currencyValuePerToken?: {
    displayValue: string;
    symbol: string;
  };
} 

export interface NFTCardProps {
  listing: Listing;
  client: ThirdwebClient; 
}


export interface NFTGridProps {
  listings: Listing[];
  client: ThirdwebClient; 
}