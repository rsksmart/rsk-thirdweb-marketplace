"use client";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { createListing } from "thirdweb/extensions/marketplace";
import { marketplaceContract } from "@/app/config";
import { Address } from "thirdweb";

type ListingFormData = {
  nftAddress: string;
  tokenId: string;
  price: string;
};

export function SellForm() {
  const account = useActiveAccount();
  const {
    mutateAsync: sendTransaction,
    isPending,
    isSuccess,
    isError,
    error,
  } = useSendTransaction();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ListingFormData>({
    defaultValues: {
      price: "",
      tokenId: "",
      nftAddress: "",
    },
  });

  const onSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    const values = getValues();
    const transaction = createListing({
      quantity: BigInt(1),
      contract: marketplaceContract,
      assetContractAddress: values.nftAddress as Address,
      tokenId: BigInt(values.tokenId),
      pricePerTokenWei: values.price,
      startTimestamp: new Date(),
      endTimestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    try {
      await sendTransaction(transaction);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Create Direct Listing</SheetTitle>
        <SheetDescription>
          Fill out the form below to list your NFT for sale.
        </SheetDescription>
      </SheetHeader>

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
            })}
          />
          {errors.nftAddress && (
            <p className="text-sm text-red-500">{errors.nftAddress.message}</p>
          )}
        </div>

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
          <Label htmlFor="price">Price (ETH)</Label>
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating listing..." : "Create Listing"}
        </Button>

        {isSuccess && (
          <p className="text-sm text-green-500">
            Successfully created listing!
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-500">
            Error creating listing: {error?.message || "Something went wrong"}
          </p>
        )}
      </form>
    </>
  );
}
