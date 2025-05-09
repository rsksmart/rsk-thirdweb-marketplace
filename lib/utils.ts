import { Listing } from "@/types/marketplace";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, length?: number) {
  return `${address.slice(0, length || 6)}...${address.slice(-4)}`;
}

export async function copyToClipboard(string: string) {
  await navigator.clipboard.writeText(string);
}

export const toastStyle = {
  background: "#333",
  color: "#fff",
  padding: "10px",
  borderRadius: "10px",
};

// Format date to readable format
export const formatDate = (timestamp: Date | string | number | undefined) => {
  if (!timestamp) return "N/A";

  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Get currency symbol based on token address
export const getCurrencySymbol = (listing: Listing) => {
  if (
    listing.currencyValuePerToken?.tokenAddress ===
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  ) {
    return "RBTC";
  }
  return listing.currencyValuePerToken?.symbol || "";
};

export function convertRBTCtoWei(rbtcAmount: string): bigint {
  // Remove any trailing zeros after decimal point
  const sanitizedAmount = rbtcAmount
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");

  const [integerPart, fractionalPart = ""] = sanitizedAmount.split(".");

  // Pad the fractional part with zeros to 18 decimal places
  const paddedFractionalPart = fractionalPart.padEnd(18, "0");

  // Combine integer and fractional parts to create a string representing wei
  const weiAmount = `${integerPart}${paddedFractionalPart}`;

  // Convert to BigInt
  return BigInt(weiAmount);
}
