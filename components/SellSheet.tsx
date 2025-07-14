"use client";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useActiveAccount,
  useSendTransaction,
  useWaitForReceipt,
  useActiveWalletChain
} from "thirdweb/react";
import { createListing } from "thirdweb/extensions/marketplace";
import { marketplaceContract } from "@/app/config";
import { Address, Hex, getContract, type NFT } from "thirdweb";
import {
  getOwnedNFTs,
  isApprovedForAll,
  setApprovalForAll,
} from "thirdweb/extensions/erc721";
import { MediaRenderer } from "thirdweb/react";
import client from "@/lib/client";
import { ListingFormData } from "@/types/marketplace";
import { convertRBTCtoWei } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { rootstockTestnet } from "@/app/utils/contracts";

interface SellFormProps {
  onClose: () => void;
}


interface SellSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellForm({ onClose }: SellFormProps) {
  const account = useActiveAccount();
  const chain = useActiveWalletChain()?.id;
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[] | null>(null);
  const [nftContract, setNftContract] = useState<any>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isValidContract, setIsValidContract] = useState(false);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const confirmationHandled = useRef(false);



  useEffect(() => {
    console.log("SellForm mounted with onClose:", typeof onClose);
  }, [onClose]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ListingFormData>({
    defaultValues: {
      price: "",
      tokenId: "",
      nftAddress: "",
    },
  });


  const nftAddress = watch("nftAddress");

  const { data: receipt, isLoading: isWaitingForReceipt } = useWaitForReceipt({
    client,
    chain: rootstockTestnet,
    transactionHash: txHash as `0x${string}`,
  });

  const {
    mutateAsync: sendTransaction,
    isPending,
    isSuccess,
    isError,
    error,
  } = useSendTransaction();

  useEffect(() => {
    if (!nftAddress || !/^0x[a-fA-F0-9]{40}$/.test(nftAddress)) {
      setNftContract(null);
      setIsValidContract(false);
      setOwnedNFTs(null);
      return;
    }

    try {
      const contract = getContract({
        client: client,
        chain: rootstockTestnet,
        address: nftAddress as Address,
      });
      setNftContract(contract);
      setIsValidContract(true);
    } catch (err) {
      console.error("Error creating contract:", err);
      setNftContract(null);
      setIsValidContract(false);
      setOwnedNFTs(null);
    }
  }, [nftAddress]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!nftContract || !account?.address || !isValidContract) {
        setOwnedNFTs(null);
        return;
      }

      setIsLoadingNFTs(true);
      try {
        const nfts = await getOwnedNFTs({
          contract: nftContract,
          owner: account.address as Hex,
        });
        console.log("Fetched NFTs:", nfts);
        setOwnedNFTs(nfts as unknown as NFT[]);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setOwnedNFTs(null);
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchNFTs();
  }, [nftContract, account?.address, isValidContract]);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
    setValue("tokenId", String(Number(nft.id)));
  };

  const onSubmit = async () => {
    if (!account) {
      toast.error("Please connect your wallet", { position: "bottom-right" });
      return;
    }

    const values = getValues();
    const priceInWei = convertRBTCtoWei(values.price);

    try {
      const result = await isApprovedForAll({
        contract: nftContract,
        owner: account.address,
        operator: marketplaceContract.address,
      });

      console.log("result", result);

      if (result === false) {
        const transaction = setApprovalForAll({
          contract: nftContract,
          operator: marketplaceContract.address,
          approved: true,
        });
        console.log("approve");
        const result = await sendTransaction(transaction);
        console.log("result", result);
      }
    } catch (err) {
      console.error("Error checking approval:", err);
    }

    const transaction = createListing({
      quantity: BigInt(1),
      contract: marketplaceContract,
      assetContractAddress: values.nftAddress as Address,
      tokenId: BigInt(values.tokenId),
      pricePerTokenWei: String(priceInWei),
      startTimestamp: new Date(),
      endTimestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
    });

    toast.loading("Creating listing...", { position: "bottom-right" });
    try {
      const result = await sendTransaction(transaction);
      setTxHash(result.transactionHash as `0x${string}`);
      confirmationHandled.current = false; // Reset for this new transaction
      toast.dismiss();
      toast.success("Listing created! Transaction sent.", {
        position: "bottom-right",
      });
      console.log("Listing created successfully:", result);
    } catch (err) {
      toast.dismiss();
      toast.error("Error creating listing", { position: "bottom-right" });
      console.error("Transaction failed:", err);
    }
  };

  useEffect(() => {
    if (receipt && !isWaitingForReceipt && isSuccess && !confirmationHandled.current) {
      confirmationHandled.current = true;
      toast.success("Transaction confirmed!", { position: "bottom-right" });
      console.log("Transaction confirmed:", receipt);
      onClose();
    }
  }, [receipt, isWaitingForReceipt, isSuccess, onClose]);

  return (
    <>
      <SheetHeader>
        <SheetTitle>Create Direct Listing</SheetTitle>
        <SheetDescription>
          Fill out the form below to list your NFT for sale.
        </SheetDescription>
      </SheetHeader>

      {txHash && (
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm font-medium text-amber-500">Transaction sent</p>
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

      <form className="space-y-6 pt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="nftAddress">NFT Contract Address</Label>
          <Input
            id="nftAddress"
            placeholder="0x..."
            {...register("nftAddress", {
              required: "NFT address is required",
              pattern: {
                value: /^0x[a-fA-F0-9]{40}$/,
                message: "Invalid Ethereum address",
              },
              setValueAs: (value) => {
                if (chain === rootstockTestnet.id && typeof value === 'string') {
                  return value.toLowerCase();
                }
                return value;
              },
            })}
          />
          {errors.nftAddress && (
            <p className="text-sm text-red-500">{errors.nftAddress.message}</p>
          )}
        </div>

        {isLoadingNFTs && (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Loading your NFTs...
            </p>
          </div>
        )}

        {!isLoadingNFTs && ownedNFTs && ownedNFTs.length > 0 && (
          <div className="space-y-3">
            <Label>Your NFTs</Label>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {ownedNFTs.map((nft) => (
                <div
                  key={String(nft.id)}
                  className={`border rounded-md p-2 cursor-pointer transition-all hover:border-primary ${
                    selectedNFT?.id === nft.id
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                  onClick={() => handleNFTSelect(nft)}
                >
                  {(nft.metadata.image || nft.metadata.image_url) && (
                    <div className="relative aspect-square w-full overflow-hidden rounded-md mb-2">
                      <MediaRenderer
                        client={client}
                        src={nft.metadata.image || nft.metadata.image_url}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs font-medium truncate">
                    {nft.metadata.name || `NFT #${Number(nft.id)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {Number(nft.id)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoadingNFTs && ownedNFTs && ownedNFTs.length === 0 && (
          <div className="rounded-md bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              You don't own any NFTs in this collection
            </p>
          </div>
        )}

        {nftAddress && !/^0x[a-fA-F0-9]{40}$/.test(nftAddress) && (
          <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4 text-center">
            <p className="text-sm text-amber-500">
              Please enter a valid contract address
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tokenId">Token ID</Label>
          <Input
            id="tokenId"
            type="number"
            placeholder="0"
            {...register("tokenId", {
              required: "Token ID is required",
              min: { value: 0, message: "Token ID must be positive" },
            })}
          />
          {errors.tokenId && (
            <p className="text-sm text-red-500">{errors.tokenId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (RBTC)</Label>
          <Input
            id="price"
            type="number"
            step="0.000001"
            placeholder="0.1"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
              validate: (value) => !isNaN(parseFloat(value)) || "Invalid price",
            })}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            isPending || isWaitingForReceipt || !account || !isValidContract
          }
          className="w-full"
        >
          {!account
            ? "Connect Wallet First"
            : !isValidContract && nftAddress
              ? "Invalid Contract Address"
              : isPending || isWaitingForReceipt
                ? isWaitingForReceipt
                  ? "Confirming transaction..."
                  : "Creating listing..."
                : "Create Listing"}
        </Button>

        {isError && !txHash && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">
              Error creating listing: {error?.message || "Something went wrong"}
            </p>
          </div>
        )}
      </form>
    </>
  );
}

export function SellSheet({ isOpen, onClose }: SellSheetProps) {
  const showTrigger = false;
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button>Sell NFT</Button>
        </SheetTrigger>
      )}
      <SheetContent>
        <SellForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
}
