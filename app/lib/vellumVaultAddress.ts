"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vellum-vault-address";
const CHANGE_EVENT = "vellum:vault-address-change";

const ENV_VAULT_ADDRESS = process.env.NEXT_PUBLIC_VELLUM_ROBINHOOD_VAULT_ADDRESS?.trim()
  ?? process.env.NEXT_PUBLIC_VELLUM_CONTRACT_ADDRESS?.trim()
  ?? process.env.NEXT_PUBLIC_VELLUM_TEST_VAULT_ADDRESS?.trim()
  ?? "";

function storedVaultAddress() {
  if (typeof window === "undefined") return ENV_VAULT_ADDRESS;
  return window.localStorage.getItem(STORAGE_KEY) ?? ENV_VAULT_ADDRESS;
}

function announceVaultAddress(address: string) {
  window.dispatchEvent(new CustomEvent<string>(CHANGE_EVENT, { detail: address }));
}

export function saveVellumVaultAddress(address: string) {
  const normalizedAddress = address.trim();
  window.localStorage.setItem(STORAGE_KEY, normalizedAddress);
  announceVaultAddress(normalizedAddress);
}

export function clearVellumVaultAddress() {
  window.localStorage.setItem(STORAGE_KEY, "");
  announceVaultAddress("");
}

export function useVellumVaultAddress() {
  const [address, setAddress] = useState(ENV_VAULT_ADDRESS);

  useEffect(() => {
    const syncFromStorage = () => setAddress(storedVaultAddress());
    const syncFromApp = (event: Event) => {
      setAddress((event as CustomEvent<string>).detail ?? storedVaultAddress());
    };

    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener(CHANGE_EVENT, syncFromApp);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener(CHANGE_EVENT, syncFromApp);
    };
  }, []);

  return address;
}

export function shortenVellumVaultAddress(address: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "CA / COMING SOON";
}
