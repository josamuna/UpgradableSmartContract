const argumentsArray = require("../arguments.js");
// The Timelock contract handle the governance (Power DAO) mechanism for the upgrade contract.
async function main() {
  let delayTime = argumentsArray[0]; // Delay time before execute the functionnality.
  let proposerArray = argumentsArray[1]; // Proposer.
  let executorsArray = argumentsArray[2]; // Executors.
  let admin = argumentsArray[3]; // Admin address

  const [deployer] = await ethers.getSigners(); // Signers from Multisignature wallet.

  console.log(`Deploying contract with the account: ${deployer.address}`);

  console.log(`Account balance: ${(await deployer.getBalance()).toString()}`);
  const Token = await ethers.getContractFactory("TimelockController");
  const token = await Token.deploy(
    delayTime,
    proposerArray,
    executorsArray,
    admin
  );
  console.log(`Timelock contract deployed on address: ${token.address}`);
}

main()
  .then(() => process.exit(1))
  .catch((error) => {
    console.error(`Something went wrong, ${error}`);
    process.exit(1);
  });
