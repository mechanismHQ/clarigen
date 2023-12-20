// import { projectFactory, ok, err } from '@clarigen/core';
// import { project } from '../esm';
// import { describe, expect, it } from 'vitest';
// import { txErr, txOk, tx, ro, roOk, roErr, chain, rov, rovOk, rovErr } from '@clarigen/test';

// const contracts = projectFactory(project, 'simnet');
// const tester = contracts.tester;
// const [deployer] = tester.identifier.split('.');

// describe('using clarigen/test', () => {
//   it('can call public functions', () => {
//     const receipt = txOk(tester.printPub(), deployer);
//     expect(receipt.value).toEqual(true);
//     expect(receipt.events.length).toEqual(3);
//   });

//   it('throws with err for txOk', () => {
//     expect(() => txOk(tester.printErr(), deployer)).toThrow();
//   });

//   it('can expect errors', () => {
//     const receipt = txErr(tester.printErr(), deployer);
//     expect(receipt.value).toEqual(210n);
//   });

//   it('throws for ok with txErr', () => {
//     expect(() => txErr(tester.printPub(), deployer)).toThrow();
//   });

//   it('can get normal unscoped responses', () => {
//     const receipt = tx(tester.printPub(), deployer);
//     expect(receipt.value).toEqual(ok(true));

//     expect(tx(tester.printErr(), deployer).value).toEqual(err(210n));
//   });

//   it('can call read-only functions', () => {
//     expect(rov(tester.echo('asdf'), deployer)).toEqual('asdf');
//     expect(rov(tester.roResp(false), deployer)).toEqual(ok('asdf'));
//     expect(rov(tester.roResp(true), deployer)).toEqual(err(100n));
//   });

//   it('can roOk', () => {
//     expect(rovOk(tester.roResp(false), deployer)).toEqual('asdf');
//     expect(() => rovOk(tester.roResp(true), deployer)).toThrow();
//   });

//   it('can roErr', () => {
//     expect(rovErr(tester.roResp(true), deployer)).toEqual(100n);
//     expect(() => rovErr(tester.roResp(false), deployer)).toThrow();
//   });

//   it('works with chain', () => {
//     expect(chain.txOk(tester.printPub(), deployer).value).toEqual(true);
//     expect(() => chain.txOk(tester.printErr(), deployer)).toThrow();
//     expect(chain.txErr(tester.printErr(), deployer).value).toEqual(210n);
//     expect(chain.tx(tester.printPub(), deployer).value).toEqual(ok(true));
//     expect(chain.rov(tester.echo('asdf'), deployer)).toEqual('asdf');
//     expect(chain.rovOk(tester.roResp(false), deployer)).toEqual('asdf');
//     expect(() => chain.rovOk(tester.roResp(true), deployer)).toThrow();
//     expect(chain.rovErr(tester.roResp(true), deployer)).toEqual(100n);
//   });

//   // it('can get interfaces', () => {
//   //   const all = simnet.getContractsInterfaces();
//   //   console.log(all);
//   // });
// });
