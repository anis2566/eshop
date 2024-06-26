import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInvoiceId() {
  const prefix = "INV";
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  return `${prefix}-${randomNumber}`;
}

export function calculateDiscountPercentage(
  price: number,
  discountPrice: number
): number {
  const discount = price - discountPrice;
  const discountPercentage = Math.floor((discount / price) * 100);
  return discountPercentage;
}

export function calculateDeliveryFee(districkt: string) {
  if (districkt === "Dhaka") return 60;
  else return 120;
}
