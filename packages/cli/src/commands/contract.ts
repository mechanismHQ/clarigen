import { Command, flags } from '@oclif/command';

export class Contract extends Command {
  static description = `Info
  `;
  // allow infinite arguments
  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
  };
  //     privateKey: flags.string({
  //       char: 'k',
  //       description: 'Your private key',
  //       required: true,
  //     }),
  //     broadcast: flags.boolean({
  //       char: 'b',
  //       default: false,
  //       description:
  //         'Whether to broadcast this transaction. Omitting this flag will not broadcast the transaction.',
  //     }),
  //     network: flags.string({
  //       char: 'n',
  //       description: 'Which network to broadcast this to',
  //       options: ['mocknet', 'testnet', 'mainnet'],
  //       default: 'testnet',
  //     }),
  //     nodeUrl: flags.string({
  //       required: false,
  //       char: 'u',
  //       description:
  //         'A default node URL will be used based on the `network` option. Use this flag to manually override.',
  //     }),
  //     quiet: flags.boolean({
  //       char: 'q',
  //       default: false,
  //       description: `
  // Reduce logging from this command. If this flag is passed with the broadcast (-b) flag,
  // only the transaction ID will be logged. If the quiet flagged is passed without broadcast,
  // only the raw transaction hex will be logged.
  // `,
  //     }),
  //     contractAddress: flags.string({
  //       char: 'c',
  //       description:
  //         'Manually specify the contract address for send-many. If omitted, default contracts will be used.',
  //     }),
  //     nonce: flags.integer({
  //       description: 'Optionally specify a nonce for this transaction',
  //     }),
  //   };

  static args = [
    {
      name: 'recipients',
      description: `
A set of recipients in the format of "address,amount_ustx"
Example: STADMRP577SC3MCNP7T3PRSTZBJ75FJ59JGABZTW,100 ST2WPFYAW85A0YK9ACJR8JGWPM19VWYF90J8P5ZTH,50
      `,
    },
  ];

  async run() {
    const { argv, flags } = this.parse(Contract);

    // this.log(argv.map);
    // this.log(flags);
    console.log('argv', argv);
    console.log('flags', flags);

    await Promise.resolve();
  }
}
