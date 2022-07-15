import { handle } from '@oclif/errors';
import flush from '@oclif/command/flush';
import { run } from './index';

run().then(flush, handle);
