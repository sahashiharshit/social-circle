import { JSX } from "react";

export type PrivacyValue = "public" | "private" | "friends";
export type PrivacyOption = {
  value: PrivacyValue;
  label: string;
  icon: JSX.Element;
};