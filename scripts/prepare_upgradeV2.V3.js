async function main() {
  // Proxy address - Not the Admin Proxy Address (Timelock Controller Address).
  // First deployed contract of V1.
  const proxyAddress = "0xb2ad6367DAC6133C8134B109fE3c451d93915e66";

  const JosamTokenV3 = await ethers.getContractFactory("JosamTokenV3");
  console.log("Preparing upgrade...");
  const josamtokenV3Address = await upgrades.prepareUpgrade(
    proxyAddress,
    JosamTokenV3
  );
  console.log(`JosamTokenV3 upgrade at: ${josamtokenV3Address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`something went wrong, ${error}`);
  });
