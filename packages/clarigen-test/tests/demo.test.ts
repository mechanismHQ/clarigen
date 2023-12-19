import { projectFactory, ok, err, Response } from '@clarigen/core';
import { project } from 'demo-project';
import { describe, expect, it } from 'vitest';
import {
  txErr,
  txOk,
  tx,
  ro,
  roOk,
  roErr,
  chain,
  rov,
  rovOk,
  rovErr,
  TransactionResult,
} from '../src';

const contracts = projectFactory(project, 'simnet');
const tester = contracts.tester;
const [deployer] = tester.identifier.split('.');

describe('using clarigen/test', () => {
  it('can call public functions', () => {
    const receipt = txOk(tester.printPub(), deployer);
    expect(receipt.value).toEqual(true);
    expect(receipt.events.length).toEqual(3);
  });

  it('throws with err for txOk', () => {
    expect(() => txOk(tester.printErr(), deployer)).toThrow();
  });

  it('can expect errors', () => {
    const receipt = txErr(tester.printErr(), deployer);
    expect(receipt.value).toEqual(210n);
  });

  // uncomment to manually check types
  it('type error if passing non-response to response functions', () => {
    // @ts-expect-error - should be a response
    expect(() => tx(tester.echo(''), deployer)).toThrow();
    // @ts-expect-error - should be a response
    expect(() => txOk(tester.echo(''), deployer)).toThrow();
    // @ts-expect-error - should be a response
    expect(() => txErr(tester.echo(''), deployer)).toThrow();
    // @ts-expect-error - should be a response
    expect(() => rovOk(tester.echo(''), deployer)).toThrow();
    // @ts-expect-error - should be a response
    expect(() => rovErr(tester.echo(''), deployer)).toThrow();
    // @ts-expect-error - should be a response
    expect(() => roErr(tester.echo(''), deployer)).toThrow();
    // @ts-expect-error - should be a response
    expect(() => roOk(tester.echo(''), deployer)).toThrow();
  });

  it('types are correct', () => {
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    txOk(tester.printPub(), deployer).value as boolean;
    txErr(tester.printErr(), deployer).value as bigint;
    rov(tester.echo('asdf'), deployer) as string;
    rovOk(tester.roResp(false), deployer) as string;
    rovErr(tester.roResp(true), deployer) as bigint;
    rov(tester.roResp(true), deployer) as Response<string, bigint>;
    tx(tester.printPub(), deployer) as TransactionResult<Response<boolean, bigint>>;
    /* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */
  });

  it('throws for ok with txErr', () => {
    expect(() => txErr(tester.printPub(), deployer)).toThrow();
  });

  it('can get normal unscoped responses', () => {
    const receipt = tx(tester.printPub(), deployer);
    expect(receipt.value).toEqual(ok(true));

    expect(tx(tester.printErr(), deployer).value).toEqual(err(210n));

    expect(rov(tester.roResp(true))).toEqual(err(100n));
    expect(rov(tester.roResp(false))).toEqual(ok('asdf'));
  });

  it('can call read-only functions', () => {
    expect(rov(tester.echo('asdf'), deployer)).toEqual('asdf');
    expect(rov(tester.roResp(false), deployer)).toEqual(ok('asdf'));
    expect(rov(tester.roResp(true), deployer)).toEqual(err(100n));
  });

  it('can roOk', () => {
    expect(rovOk(tester.roResp(false), deployer)).toEqual('asdf');
    expect(() => rovOk(tester.roResp(true), deployer)).toThrow();
  });

  it('can roErr', () => {
    expect(rovErr(tester.roResp(true), deployer)).toEqual(100n);
    expect(() => rovErr(tester.roResp(false), deployer)).toThrow();
  });

  it('works with chain', () => {
    expect(chain.txOk(tester.printPub(), deployer).value).toEqual(true);
    expect(() => chain.txOk(tester.printErr(), deployer)).toThrow();
    expect(chain.txErr(tester.printErr(), deployer).value).toEqual(210n);
    expect(chain.tx(tester.printPub(), deployer).value).toEqual(ok(true));
    expect(chain.rov(tester.echo('asdf'), deployer)).toEqual('asdf');
    expect(chain.rovOk(tester.roResp(false), deployer)).toEqual('asdf');
    expect(() => chain.rovOk(tester.roResp(true), deployer)).toThrow();
    expect(chain.rovErr(tester.roResp(true), deployer)).toEqual(100n);
  });
});
