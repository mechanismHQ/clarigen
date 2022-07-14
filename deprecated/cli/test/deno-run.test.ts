import { getClarinetSession } from '../src/deno-run';

test('can get clarinet session info', async () => {
  const session = await getClarinetSession();
  // console.log(session);
});
