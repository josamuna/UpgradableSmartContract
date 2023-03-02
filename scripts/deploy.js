// scripts/deploy.js
// const { ether } = require("hardhat");
async function main() {
  const JosamToken = await ethers.getContractFactory("JosamToken");
  console.log("Deploying JosamToken version 1.......");
  const josamtoken = await upgrades.deployProxy(
    JosamToken,
    ["Josam Token", "JTK"],
    {
      initializer: "initialize",
    }
  ); // Initializer will be the initialize function (instead of constructor) with no args to pass.
  // Getting the Proxy address
  console.log(`JosamToken deployed to: ${josamtoken.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Something went wrong, ${error}`);
    process.exit(1);
  });
