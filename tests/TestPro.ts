import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TestPro } from '../target/types/test_pro';

const assert = require('assert');
const { SystemProgram } = anchor.web3;

describe('TestPro', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TestPro as Program<TestPro>;
  let _baseAccount;

  it('Creates a counter', async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    // The account should have been created.
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('Initial count: ', account.count.toString());
    assert.ok(account.count.toString() == 0);
    _baseAccount = baseAccount;
  });

  it('Increments a counter', async () => {
    const baseAccount = _baseAccount;
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('After increment: ', account.count.toString());
    assert.ok(account.count.toString() == 1);
  });
});
