import {
  CoreNodeEventType,
  SmartContractEvent as _SmartContractEvent,
  StxTransferEvent as _StxTransferEvent,
  StxBurnEvent as _StxBurnEvent,
  StxMintEvent as _StxMintEvent,
  StxLockEvent as _StxLockEvent,
  FtBurnEvent as _FtBurnEvent,
  FtMintEvent as _FtMintEvent,
  FtTransferEvent as _FtTransferEvent,
  NftBurnEvent as _NftBurnEvent,
  NftMintEvent as _NftMintEvent,
  NftTransferEvent as _NftTransferEvent,
} from '@clarigen/core';

export type SmartContractEvent = {
  event: _SmartContractEvent['type'];
  data: _SmartContractEvent['contract_event'];
};

export type StxTransferEvent = {
  event: _StxTransferEvent['type'];
  data: _StxTransferEvent['stx_transfer_event'];
};

export type StxBurnEvent = {
  event: _StxBurnEvent['type'];
  data: _StxBurnEvent['stx_burn_event'];
};

export type StxLockEvent = {
  event: _StxLockEvent['type'];
  data: _StxLockEvent['stx_lock_event'];
};

export type StxMintEvent = {
  event: _StxMintEvent['type'];
  data: _StxMintEvent['stx_mint_event'];
};

export type FtBurnEvent = {
  event: _FtBurnEvent['type'];
  data: _FtBurnEvent['ft_burn_event'];
};

export type FtMintEvent = {
  event: _FtMintEvent['type'];
  data: _FtMintEvent['ft_mint_event'];
};

export type FtTransferEvent = {
  event: _FtTransferEvent['type'];
  data: _FtTransferEvent['ft_transfer_event'];
};

export type NftBurnEvent = {
  event: _NftBurnEvent['type'];
  data: _NftBurnEvent['nft_burn_event'];
};

export type NftMintEvent = {
  event: _NftMintEvent['type'];
  data: _NftMintEvent['nft_mint_event'];
};

export type NftTransferEvent = {
  event: _NftTransferEvent['type'];
  data: _NftTransferEvent['nft_transfer_event'];
};

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
  return events.filter(event => event.event === type);
}
