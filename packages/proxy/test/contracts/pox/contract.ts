import { ClarityTypes, Transaction } from '@clarion/proxy';

export interface PoxContract {
  allowContractCaller: (
    caller: string,
    untilBurnHt: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  delegateStackStx: (
    stacker: string,
    amountUstx: string,
    poxAddr: string,
    startBurnHt: string,
    lockPeriod: string
  ) => Transaction<ClarityTypes.TupleCV, ClarityTypes.IntCV>;
  delegateStx: (
    amountUstx: string,
    delegateTo: string,
    untilBurnHt: string,
    poxAddr: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  disallowContractCaller: (
    caller: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  rejectPox: () => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  revokeDelegateStx: () => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  setBurnchainParameters: (
    firstBurnHeight: string,
    prepareCycleLength: string,
    rewardCycleLength: string,
    rejectionFraction: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  stackAggregationCommit: (
    poxAddr: string,
    rewardCycle: string
  ) => Transaction<ClarityTypes.BooleanCV, ClarityTypes.IntCV>;
  stackStx: (
    amountUstx: string,
    poxAddr: string,
    startBurnHt: string,
    lockPeriod: string
  ) => Transaction<ClarityTypes.TupleCV, ClarityTypes.IntCV>;
  canStackStx: (
    poxAddr: string,
    amountUstx: string,
    firstRewardCycle: string,
    numCycles: string
  ) => Promise<ClarityTypes.ResponseCV>;
  getPoxInfo: () => Promise<ClarityTypes.ResponseCV>;
  getPoxRejection: (stacker: string, rewardCycle: string) => Promise<ClarityTypes.OptionalCV>;
  getRewardSetPoxAddress: (rewardCycle: string, index: string) => Promise<ClarityTypes.OptionalCV>;
  getRewardSetSize: (rewardCycle: string) => Promise<ClarityTypes.UIntCV>;
  getStackerInfo: (stacker: string) => Promise<ClarityTypes.OptionalCV>;
  getStackingMinimum: () => Promise<ClarityTypes.UIntCV>;
  getTotalUstxStacked: (rewardCycle: string) => Promise<ClarityTypes.UIntCV>;
  isPoxActive: (rewardCycle: string) => Promise<ClarityTypes.BooleanCV>;
  minimalCanStackStx: (
    poxAddr: string,
    amountUstx: string,
    firstRewardCycle: string,
    numCycles: string
  ) => Promise<ClarityTypes.ResponseCV>;
}
