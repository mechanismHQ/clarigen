import { filterEvents, SmartContractEvent, CoreNodeEventType } from '../src/events';

test('can filter events by type', () => {
  const event: SmartContractEvent = {
    type: CoreNodeEventType.ContractEvent,
    txid: '',
    event_index: 0,
    committed: true,
    contract_event: {
      contract_identifier: '',
      topic: '',
      value: 1,
      raw_value: '0x00',
    },
  };

  const events = [event];

  expect(filterEvents(events, CoreNodeEventType.FtBurnEvent).length).toEqual(0);
  expect(filterEvents(events, CoreNodeEventType.ContractEvent).length).toEqual(1);
});
