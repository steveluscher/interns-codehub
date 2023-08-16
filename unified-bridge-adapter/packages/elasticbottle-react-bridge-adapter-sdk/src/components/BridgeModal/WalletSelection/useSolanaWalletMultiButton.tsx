/* eslint-disable @typescript-eslint/unbound-method */
import type { WalletName } from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";

type ButtonState = {
  buttonState:
    | "connecting"
    | "connected"
    | "disconnecting"
    | "has-wallet"
    | "no-wallet";
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSelectWallet: (walletName: WalletName | null) => void;
  wallets: Wallet[];
  publicKey?: PublicKey;
  walletIcon?: Wallet["adapter"]["icon"];
  walletName?: Wallet["adapter"]["name"];
};

export function useSolanaWalletMultiButton(): ButtonState {
  const {
    connect,
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    select,
    wallet,
    wallets,
  } = useWallet();

  let buttonState: ButtonState["buttonState"];
  if (connecting) {
    buttonState = "connecting";
  } else if (connected) {
    buttonState = "connected";
  } else if (disconnecting) {
    buttonState = "disconnecting";
  } else if (wallet) {
    buttonState = "has-wallet";
  } else {
    buttonState = "no-wallet";
  }
  const handleConnect = useCallback(() => {
    connect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [disconnect]);

  return {
    buttonState,
    onConnect: buttonState === "has-wallet" ? handleConnect : undefined,
    onDisconnect:
      buttonState !== "disconnecting" && buttonState !== "no-wallet"
        ? handleDisconnect
        : undefined,
    onSelectWallet: select,
    wallets,
    publicKey: publicKey ?? undefined,
    walletIcon: wallet?.adapter.icon,
    walletName: wallet?.adapter.name,
  };
}
