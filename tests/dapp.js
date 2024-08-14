const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const TestFunc = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.dapp;

  const account = anchor.web3.Keypair.generate();

  let tx = await program.rpc.initialize({
    accounts: {
      initialAccount: account.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [account],
  });
  console.log("Your transaction signature", tx);
  //Fetch data from account
  let fetchedvalue = await program.account.init.fetch(account.publicKey);
  console.log("output value", fetchedvalue.value.toString());
};

const runTest = async () => {
  try {
    await TestFunc();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runTest();
