import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MediaRenderer, useActiveAccount, useSendTransaction, useWaitForReceipt } from "thirdweb/react";
import { XMarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { NFTCardProps } from "@/types/marketplace";
import { formatDate, getCurrencySymbol } from "@/lib/utils";
import { cancelListing } from "thirdweb/extensions/marketplace";
import { marketplaceContract } from "@/app/config";
import { defineChain } from "thirdweb/chains";

interface NFTDetailSheetProps extends NFTCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NFTDetailSheet({ listing, client, isOpen, onClose }: NFTDetailSheetProps) {
  
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const activeAccount = useActiveAccount();
  const { mutateAsync: sendTransaction, isPending: isProcessing, isIdle } = useSendTransaction();
  // Wait for the transaction to be confirmed
  const { data: receipt, isLoading } = useWaitForReceipt({
    client,
    chain: defineChain(31),
    transactionHash: txHash as `0x${string}`,
  });

  const handleBuy = async () => {
    if (!activeAccount) {
      alert("Please connect your wallet");
      return;
    }

 
    try {
      // Implementation for buying will go here
      console.log("Buy NFT:", listing.id);
      // After successful purchase
      onClose();
    } catch (error) {
      console.error("Error buying NFT:", error);
    } 
  };

  const handleCancel = async () => {
    if (!activeAccount) {
      alert("Please connect your wallet");
      return;
    }

    try {
      // Create the transaction for cancelling the listing
      const transaction = cancelListing({
        contract: marketplaceContract,
        listingId: listing.id,
      });

      // Send the transaction
      const result = await sendTransaction(transaction);
      console.log("Transaction sent:", result);
      
      // Store the transaction hash
      const txHash = result.transactionHash as `0x${string}`;
      setTxHash(txHash);
      
    } catch (error) {
      console.error("Error cancelling listing:", error);
    }
  };

  // When receipt is received, close the modal
  if (receipt && !isLoading && isProcessing) {
    console.log("Transaction confirmed:", receipt);
    onClose();
  }

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500">
              <div className="flex h-full flex-col overflow-y-auto bg-background shadow-xl">
                <div className="p-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Close panel"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <DialogTitle className="text-lg font-semibold text-foreground">
                      NFT Details
                    </DialogTitle>
                   
                  </div>
                  
                  {/* Transaction hash info */}
                  {txHash && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm font-medium text-amber-500">
                        {isProcessing ? 'Processing transaction...' : 'Transaction sent'}
                      </p>
                      <a 
                        href={`https://rootstock-testnet.blockscout.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-xs text-amber-400 underline mt-1 block"
                      >
                        View on explorer
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-6">
                    {/* NFT Image */}
                    <div className="overflow-hidden rounded-lg border border-border">
                      <div className="relative aspect-square w-full">
                        <MediaRenderer
                          client={client}
                          src={listing.asset.metadata.image}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    {/* NFT Details */}
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {listing.asset.metadata.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {listing.asset.metadata.description || "No description provided"}
                      </p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-xs text-muted-foreground">Contract Address</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-foreground text-sm truncate">
                          {listing.assetContractAddress}
                        </p>
                        <a 
                          href={`https://rootstock-testnet.blockscout.com/address/${listing.assetContractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-primary hover:text-primary/80"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium text-foreground">{listing.asset.type}</p>
                      </div>
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs text-muted-foreground">Token ID</p>
                        <p className="font-medium text-foreground">{listing.tokenId?.toString() || "N/A"}</p>
                      </div>
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`block w-2 h-2 rounded-full ${
                              listing.status === 'ACTIVE'
                                ? 'bg-green-500'
                                : listing.status === 'CREATED'
                                ? 'bg-amber-500'
                                : 'bg-gray-500'
                            }`}
                          ></span>
                          <span className="font-medium text-foreground">{listing.status}</span>
                        </div>
                      </div>
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs text-muted-foreground">Listing Type</p>
                        <p className="font-medium text-foreground">
                          {listing.isReservedListing ? "Reserved" : "Public"}
                        </p>
                      </div>
                    </div>

                    {/* Listing Times */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs text-muted-foreground">Start Time</p>
                        <p className="font-medium text-foreground text-sm">
                          {formatDate(listing.startTimeInSeconds ? Number(listing.startTimeInSeconds) * 1000 : undefined)}
                        </p>
                      </div>
                      <div className="rounded-md border border-border p-3">
                        <p className="text-xs text-muted-foreground">End Time</p>
                        <p className="font-medium text-foreground text-sm">
                          {formatDate(listing.endTimeInSeconds ? Number(listing.endTimeInSeconds) * 1000 : undefined)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-md border border-border p-4">
                      <div className="flex items-baseline justify-between">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-xl font-bold text-foreground">
                          {listing.currencyValuePerToken?.displayValue}
                          <span className="ml-1 text-muted-foreground text-sm">
                            {getCurrencySymbol(listing)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-3">
                      {/* Buy button */}
                      { 
                        activeAccount && 
                        activeAccount.address.toLowerCase() !== listing.creatorAddress?.toLowerCase() && 
                        activeAccount.address.toLowerCase() !== listing.asset.owner?.toLowerCase() && (
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={handleBuy}
                            disabled={isProcessing || listing.status !== 'ACTIVE'}
                          >
                            {isProcessing ? "Processing..." : "Buy Now"}
                          </button>
                        )
                      }
                      {/* Cancel button */}
                      {
                        activeAccount && 
                        (activeAccount.address.toLowerCase() === listing.creatorAddress?.toLowerCase() || 
                        activeAccount.address.toLowerCase() === listing.asset.owner?.toLowerCase()) && (
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-destructive bg-destructive/10 text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/20 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={handleCancel}
                            disabled={isProcessing}
                          >
                            {isProcessing ? isLoading ? "Confirming transaction..." : "Canceling listing..." : "Cancel Listing"}
                          </button>
                        )
                      }
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 