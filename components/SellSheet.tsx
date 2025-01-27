"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { createListing } from "thirdweb/extensions/marketplace";
import { type Address } from "thirdweb";
import { marketplaceContract } from "@/app/config";

type ListingFormData = {
  nftAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

export function SellForm() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
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
      startDate: undefined,
      endDate: undefined,
    },
  });

  const setDateWithTime = (
    date: Date | undefined,
    setDateFn: (date: Date | undefined) => void
  ) => {
    if (date) {
      const newDate = new Date(date);

      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes());
      setDateFn(newDate);
    } else {
      setDateFn(undefined);
    }
  };

  const onSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    const values = getValues();
    console.log(values);

    const transaction = createListing({
      quantity: BigInt(1),
      contract: marketplaceContract,
      assetContractAddress: "0x907c7b5b84667f59D7CcB4a3Edd7b0C576b3cd21s",
      tokenId: BigInt(0),
      pricePerTokenWei: "100000000000000000",
      startTimestamp: startDate,
      endTimestamp: endDate,    
    });

    try {
      const result = sendTransaction(transaction);
      console.log("Transaction result:", result);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Sell</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create Direct Listing</SheetTitle>
          <SheetDescription>
            Fill out the form below to list your NFT for sale.
          </SheetDescription>
        </SheetHeader>

        <form className="space-y-6 pt-6">
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
              <p className="text-sm text-red-500">
                {errors.nftAddress.message}
              </p>
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
                validate: (value) =>
                  !isNaN(parseFloat(value)) || "Invalid price",
              })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Start Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP HH:mm")
                  ) : (
                    <span>Pick a date & time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => setDateWithTime(date, setStartDate)}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Input
                    type="time"
                    value={startDate ? format(startDate, "HH:mm") : ""}
                    onChange={(e) => {
                      if (startDate && e.target.value) {
                        const [hours, minutes] = e.target.value.split(":");
                        const newDate = new Date(startDate);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setStartDate(newDate);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP HH:mm")
                  ) : (
                    <span>Pick a date & time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => setDateWithTime(date, setEndDate)}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Input
                    type="time"
                    value={endDate ? format(endDate, "HH:mm") : ""}
                    onChange={(e) => {
                      if (endDate && e.target.value) {
                        const [hours, minutes] = e.target.value.split(":");
                        const newDate = new Date(endDate);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setEndDate(newDate);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
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
      </SheetContent>
    </Sheet>
  );
}
