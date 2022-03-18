export enum CoreNodeEventType {
  ContractEvent = 'contract_event',
  StxTransferEvent = 'stx_transfer_event',
  StxMintEvent = 'stx_mint_event',
  StxBurnEvent = 'stx_burn_event',
  StxLockEvent = 'stx_lock_event',
  NftTransferEvent = 'nft_transfer_event',
  NftMintEvent = 'nft_mint_event',
  NftBurnEvent = 'nft_burn_event',
  FtTransferEvent = 'ft_transfer_event',
  FtMintEvent = 'ft_mint_event',
  FtBurnEvent = 'ft_burn_event',
}

export type NonStandardClarityValue = unknown;

export interface CoreNodeEventBase {
  /** 0x-prefix transaction hash. */
  txid: string;
  event_index: number;
  committed: boolean;
}

export interface SmartContractEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.ContractEvent;
  contract_event: {
    /** Fully qualified contract ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.kv-store" */
    contract_identifier: string;
    topic: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface StxTransferEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxTransferEvent;
  stx_transfer_event: {
    recipient: string;
    sender: string;
    amount: string;
  };
}

export interface StxMintEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxMintEvent;
  stx_mint_event: {
    recipient: string;
    amount: string;
  };
}

export interface StxBurnEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxBurnEvent;
  stx_burn_event: {
    sender: string;
    amount: string;
  };
}

export interface StxLockEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxLockEvent;
  /** TODO: what dis? */
  committed: boolean;
  stx_lock_event: {
    /** String quoted base10 integer. */
    locked_amount: string;
    /** String quoted base10 integer. */
    unlock_height: string;
    /** STX principal associated with the locked tokens. */
    locked_address: string;
  };
}

export interface NftTransferEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.NftTransferEvent;
  nft_transfer_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    sender: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface NftMintEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.NftMintEvent;
  nft_mint_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface NftBurnEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.NftBurnEvent;
  nft_burn_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    sender: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface FtTransferEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.FtTransferEvent;
  ft_transfer_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    sender: string;
    amount: string;
  };
}

export interface FtMintEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.FtMintEvent;
  ft_mint_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    amount: string;
  };
}

export interface FtBurnEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.FtBurnEvent;
  ft_burn_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    sender: string;
    amount: string;
  };
}

export type CoreNodeEvent =
  | SmartContractEvent
  | StxTransferEvent
  | StxMintEvent
  | StxBurnEvent
  | StxLockEvent
  | FtTransferEvent
  | FtMintEvent
  | FtBurnEvent
  | NftTransferEvent
  | NftMintEvent
  | NftBurnEvent;

export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.ContractEvent
): SmartContractEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.StxTransferEvent
): StxTransferEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.StxMintEvent
): StxMintEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.StxBurnEvent
): StxBurnEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.StxLockEvent
): StxLockEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.NftTransferEvent
): NftTransferEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.NftMintEvent
): NftMintEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.NftBurnEvent
): NftBurnEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.FtTransferEvent
): FtTransferEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.FtMintEvent
): FtMintEvent[];
export function filterEvents(
  events: CoreNodeEvent[],
  type: CoreNodeEventType.FtBurnEvent
): FtBurnEvent[];
export function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType): CoreNodeEvent[] {
  return events.filter(event => event.type === type);
}
