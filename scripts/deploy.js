// scripts/deploy.js
async function main() {
  const JosamToken = await ethers.getContractFactory("JosamToken");
  console.log("Deploying JosamToken version 1.......");
  const josamtoken = await upgrades.deployProxy(JosamToken, 1000000, {
    initializer: "store",
  }); // Initializer with the Total Supply
  console.log(`JosamToken deployed to: ${josamtoken.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`Something went wrong, ${error}`);
    process.exit(1);
  });
