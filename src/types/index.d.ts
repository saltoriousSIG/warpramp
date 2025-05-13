export type CurrencyType = "ETH" | "USDC";

export type Allocations = "equal" | "custom";

export type RecipientType = "wallet" | "farcaster";

export type OptionType =
  | "receive_eth"
  | "set_delegated_recipients"
  | "set_clank_token";

export interface CurrencyInfo {
  symbol: string;
  name: string;
  icon: React.ComponentType<any>;
  decimals: number;
}

export type Recipient = {
  id: string | number;
  type: RecipientType;
  value: string; // wallet id or farcaster username
  displayName: string;
  address?: string;
  avatar?: string;
  allocation: number; // percentage for custom allocation
};

export type ConnectedWallets = {
  id: string;
  address: string;
  fullAddress: string;
  name: string;
};
