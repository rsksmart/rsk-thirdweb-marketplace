import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MediaRenderer } from "thirdweb/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NFTCardProps, type Listing } from "@/types/marketplace";

interface NFTDetailSheetProps extends NFTCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NFTDetailSheet({ listing, client, isOpen, onClose }: NFTDetailSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = async () => {
    setIsProcessing(true);
    try {
      // Implementation for buying will go here
      console.log("Buy NFT:", listing.id);
      // After successful purchase
      onClose();
    } catch (error) {
      console.error("Error buying NFT:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      // Implementation for cancelling will go here
      console.log("Cancel listing:", listing.id);
      // After successful cancellation
      onClose();
    } catch (error) {
      console.error("Error cancelling listing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-background shadow-xl">
                    <div className="p-6">
                      <div className="flex flex-col space-y-2 text-center sm:text-left">
                        <Dialog.Title className="text-lg font-semibold text-foreground">
                          NFT Details
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                          View details and actions for this NFT listing
                        </Dialog.Description>
                      </div>
                      
                      <div className="mt-6 space-y-6">
                        {/* NFT Image - More proportional */}
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

                        <div className="rounded-md border border-border p-4">
                          <div className="flex items-baseline justify-between">
                            <p className="text-xs text-muted-foreground">Price</p>
                            <p className="text-xl font-bold text-foreground">
                              {listing.currencyValuePerToken?.displayValue}
                              <span className="ml-1 text-muted-foreground text-sm">
                                {listing.currencyValuePerToken?.symbol}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-3 pt-3">
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={handleBuy}
                            disabled={isProcessing || listing.status !== 'ACTIVE'}
                          >
                            {isProcessing ? "Processing..." : "Buy Now"}
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={handleCancel}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : "Cancel Listing"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 