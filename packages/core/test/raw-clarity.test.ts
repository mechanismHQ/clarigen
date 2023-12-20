import { project, contracts } from 'demo-project';
import { projectFactory, rawClarityToValue, ResponseType } from '../src';

// const contracts = projectFactory(project, 'simnet');

describe('parsing raw clarity values', () => {
  it('uint', () => {
    const value = rawClarityToValue<bigint>('u111', 'uint128');
    expect(value).toEqual(111n);
  });

  it('tuple', () => {
    const type = contracts.tester.functions.getTup.outputs.type;
    const value = rawClarityToValue<
      ResponseType<(typeof contracts)['tester']['functions']['getTup']>
    >(
      `{
      a: u1,
      bool-prop: true,
      tuple-prop: {
        sub-prop: "asdf"
      }
    }`,
      type
    );
    expect(value).toEqual({
      a: 1n,
      boolProp: true,
      tupleProp: {
        subProp: 'asdf',
      },
    });
  });
});
