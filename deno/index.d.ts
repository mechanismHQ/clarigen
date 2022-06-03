import { ClarityAbiType, ClarityAbi as ClarityAbi$1, ClarityValue, ClarityAbiFunction, ContractPrincipalCV } from 'micro-stacks/clarity';
import { StacksNetwork } from 'micro-stacks/network';
import { StacksTransaction } from 'micro-stacks/transactions';

interface ResponseOk<T> {
    value: T;
    isOk: true;
}
interface ResponseErr<T> {
    value: T;
    isOk: false;
}
declare type Response<Ok, Err> = ResponseOk<Ok> | ResponseErr<Err>;
declare function ok<T>(value: T): ResponseOk<T>;
declare function err<T>(value: T): ResponseErr<T>;
interface ClarityAbiMap {
    name: string;
    key: ClarityAbiType;
    value: ClarityAbiType;
}
interface ClarityAbi extends Omit<ClarityAbi$1, 'maps'> {
    maps: ClarityAbiMap[];
    clarity_version?: string;
}
/**
 * @param val - ClarityValue
 * @param returnResponse - if true, this will return a "response" object.
 * Otherwise, it returns the inner value of the response (whether ok or err)
 */
declare function cvToValue<T = any>(val: ClarityValue, returnResponse?: boolean): T;
/**
 * Converts a hex encoded string to the javascript clarity value object {type: string; value: any}
 * @param hex - the hex encoded string with or without `0x` prefix
 * @param jsonCompat - enable to serialize bigints to strings
 */
declare function hexToCvValue<T>(hex: string, jsonCompat?: boolean): any;
declare type TupleInput = Record<string, any>;
declare type CVInput = string | boolean | TupleInput | number | bigint;
declare function parseToCV(input: CVInput, type: ClarityAbiType): ClarityValue;
declare function cvToString(val: ClarityValue, encoding?: 'tryAscii' | 'hex'): string;
declare function transformArgsToCV(func: ClarityAbiFunction, args: any[]): ClarityValue[];
declare function expectOk<Ok>(response: Response<Ok, any>): Ok;
declare function expectErr<Err>(response: Response<any, Err>): Err;

interface ResultAssets {
    stx: Record<string, string>;
    burns: Record<string, string>;
    tokens: Record<string, Record<string, string>>;
    assets: Record<string, Record<string, string>>;
}

declare type ContractBuilder<T> = (contractAddress: string, contractName: string) => T;
interface Contract<T> {
    address: string;
    contractFile: string;
    contract: ContractBuilder<T>;
    abi: ClarityAbi;
    name: string;
}
interface Contracts<T> {
    [key: string]: Contract<T>;
}
interface ContractInstance<T> {
    identifier: string;
    contract: T;
}
declare type ContractInstances<T extends Contracts<any>> = {
    [Name in keyof T]: ContractInstance<ReturnType<T[Name]['contract']>>;
};

declare const TESTNET_BURN_ADDRESS = "ST000000000000000000002AMW42H";
declare const MAINNET_BURN_ADDRESS = "SP000000000000000000002Q6VF78";
declare const toCamelCase: (input: string | number | symbol, titleCase?: boolean | undefined) => string;
declare const getContractNameFromPath: (path: string) => string;
declare const getContractIdentifier: <T>(contract: Contract<T>) => string;
declare const getContractPrincipalCV: <T>(contract: Contract<T>) => ContractPrincipalCV;
declare function bootContractIdentifier(name: string, mainnet: boolean): string;

declare enum CoreNodeEventType {
    ContractEvent = "contract_event",
    StxTransferEvent = "stx_transfer_event",
    StxMintEvent = "stx_mint_event",
    StxBurnEvent = "stx_burn_event",
    StxLockEvent = "stx_lock_event",
    NftTransferEvent = "nft_transfer_event",
    NftMintEvent = "nft_mint_event",
    NftBurnEvent = "nft_burn_event",
    FtTransferEvent = "ft_transfer_event",
    FtMintEvent = "ft_mint_event",
    FtBurnEvent = "ft_burn_event"
}
declare type NonStandardClarityValue = unknown;
interface CoreNodeEventBase {
    /** 0x-prefix transaction hash. */
    txid: string;
    event_index: number;
    committed: boolean;
}
interface SmartContractEvent extends CoreNodeEventBase {
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
interface StxTransferEvent extends CoreNodeEventBase {
    type: CoreNodeEventType.StxTransferEvent;
    stx_transfer_event: {
        recipient: string;
        sender: string;
        amount: string;
    };
}
interface StxMintEvent extends CoreNodeEventBase {
    type: CoreNodeEventType.StxMintEvent;
    stx_mint_event: {
        recipient: string;
        amount: string;
    };
}
interface StxBurnEvent extends CoreNodeEventBase {
    type: CoreNodeEventType.StxBurnEvent;
    stx_burn_event: {
        sender: string;
        amount: string;
    };
}
interface StxLockEvent extends CoreNodeEventBase {
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
interface NftTransferEvent extends CoreNodeEventBase {
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
interface NftMintEvent extends CoreNodeEventBase {
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
interface NftBurnEvent extends CoreNodeEventBase {
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
interface FtTransferEvent extends CoreNodeEventBase {
    type: CoreNodeEventType.FtTransferEvent;
    ft_transfer_event: {
        /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
        asset_identifier: string;
        recipient: string;
        sender: string;
        amount: string;
    };
}
interface FtMintEvent extends CoreNodeEventBase {
    type: CoreNodeEventType.FtMintEvent;
    ft_mint_event: {
        /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
        asset_identifier: string;
        recipient: string;
        amount: string;
    };
}
interface FtBurnEvent extends CoreNodeEventBase {
    type: CoreNodeEventType.FtBurnEvent;
    ft_burn_event: {
        /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
        asset_identifier: string;
        sender: string;
        amount: string;
    };
}
declare type CoreNodeEvent = SmartContractEvent | StxTransferEvent | StxMintEvent | StxBurnEvent | StxLockEvent | FtTransferEvent | FtMintEvent | FtBurnEvent | NftTransferEvent | NftMintEvent | NftBurnEvent;
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.ContractEvent): SmartContractEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.StxTransferEvent): StxTransferEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.StxMintEvent): StxMintEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.StxBurnEvent): StxBurnEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.StxLockEvent): StxLockEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.NftTransferEvent): NftTransferEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.NftMintEvent): NftMintEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.NftBurnEvent): NftBurnEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.FtTransferEvent): FtTransferEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.FtMintEvent): FtMintEvent[];
declare function filterEvents(events: CoreNodeEvent[], type: CoreNodeEventType.FtBurnEvent): FtBurnEvent[];

interface MakeContractsOptions {
    deployerAddress?: string;
}
declare function makeContracts<T extends Contracts<any>>(contracts: T, options?: MakeContractsOptions): ContractInstances<T>;

interface ContractCall<T> {
    function: ClarityAbiFunction;
    nativeArgs: any[];
    functionArgs: ClarityValue[];
    contractAddress: string;
    contractName: string;
}
interface PureContractInfo {
    abi: ClarityAbi;
    contractAddress: string;
    contractName: string;
}
declare type ContractFn<T> = (args: any) => T;
declare type ContractReturn<C extends ContractFn<ContractCalls.ReadOnly<any>>> = C extends ContractFn<ContractCalls.ReadOnly<infer T>> ? T : unknown;
declare type ContractReturnOk<C extends ContractFn<ContractCalls.ReadOnly<any>>> = ContractReturn<C> extends Response<infer O, any> ? O : unknown;
declare type ContractReturnErr<C extends ContractFn<ContractCalls.ReadOnly<any>>> = ContractReturn<C> extends Response<any, infer E> ? E : unknown;
interface MapGet<Key, Val> {
    map: ClarityAbiMap;
    nativeKey: Key;
    key: ClarityValue;
    contractAddress: string;
    contractName: string;
}
declare namespace ContractCalls {
    type ReadOnly<T> = ContractCall<T>;
    type Public<Ok, Err> = ContractCall<Response<Ok, Err>>;
    type Private<T> = ContractCall<T>;
    type Map<Key, Val> = MapGet<Key, Val>;
}
declare const pureProxy: <T extends object>(target: PureContractInfo) => T;

interface ApiOptions {
    network: StacksNetwork;
}
declare function ro<T>(tx: ContractCall<T>, options: ApiOptions): Promise<T>;
declare function roOk<Ok>(tx: ContractCall<Response<Ok, any>>, options: ApiOptions): Promise<Ok>;
declare function roErr<Err>(tx: ContractCall<Response<any, Err>>, options: ApiOptions): Promise<Err>;
declare function fetchMapGet<T extends ContractCalls.Map<any, Val>, Val>(map: T, options: ApiOptions): Promise<Val | null>;
declare function broadcast(transaction: StacksTransaction, options: ApiOptions): Promise<{
    txId: string;
    stacksTransaction: StacksTransaction;
}>;

export { ClarityAbi, ClarityAbiMap, Contract, ContractBuilder, ContractCall, ContractCalls, ContractFn, ContractInstance, ContractInstances, ContractReturn, ContractReturnErr, ContractReturnOk, Contracts, CoreNodeEvent, CoreNodeEventBase, CoreNodeEventType, FtBurnEvent, FtMintEvent, FtTransferEvent, MAINNET_BURN_ADDRESS, NftBurnEvent, NftMintEvent, NftTransferEvent, NonStandardClarityValue, Response, ResponseErr, ResponseOk, ResultAssets, SmartContractEvent, StxBurnEvent, StxLockEvent, StxMintEvent, StxTransferEvent, TESTNET_BURN_ADDRESS, bootContractIdentifier, broadcast, cvToString, cvToValue, err, expectErr, expectOk, fetchMapGet, filterEvents, getContractIdentifier, getContractNameFromPath, getContractPrincipalCV, hexToCvValue, makeContracts, ok, parseToCV, pureProxy, ro, roErr, roOk, toCamelCase, transformArgsToCV };
