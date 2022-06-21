export const simnetDeployment = {
  id: 0,
  name: 'Simulated deployment, used as a default for `clarinet console`, `clarinet test` and `clarinet check`',
  network: 'simnet',
  genesis: {
    wallets: [
      {
        name: 'deployer',
        address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
        balance: '1000000000000000',
      },
      {
        name: 'wallet_1',
        address: 'ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK',
        balance: '1000000000000000',
      },
      {
        name: 'wallet_2',
        address: 'ST20ATRN26N9P05V2F1RHFRV24X8C8M3W54E427B2',
        balance: '1000000',
      },
    ],
    contracts: ['pox', 'costs-v2', 'bns'],
  },
  plan: {
    batches: [
      {
        id: 0,
        transactions: [
          {
            'emulated-contract-publish': {
              'contract-name': 'ft-trait',
              'emulated-sender': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
              path: '/Users/hankstoever/blockstack/clarion/packages/unit-test/test/clarinet-project/.requirements/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait.clar',
            },
          },
          {
            'emulated-contract-publish': {
              'contract-name': 'restricted-token-trait',
              'emulated-sender': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
              path: '/Users/hankstoever/blockstack/clarion/packages/unit-test/test/clarinet-project/.requirements/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait.clar',
            },
          },
          {
            'emulated-contract-publish': {
              'contract-name': 'Wrapped-Bitcoin',
              'emulated-sender': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
              path: '/Users/hankstoever/blockstack/clarion/packages/unit-test/test/clarinet-project/.requirements/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar',
            },
          },
          {
            'emulated-contract-publish': {
              'contract-name': 'tester',
              'emulated-sender': 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
              path: '/Users/hankstoever/blockstack/clarion/packages/unit-test/test/clarinet-project/contracts/tester.clar',
            },
          },
        ],
      },
    ],
  },
} as const;
