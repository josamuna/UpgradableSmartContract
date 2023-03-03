async function main() {
  // Proxy address - Not the Admin Proxy Address (Timelock Controller Address).
  // First deployed contract of V1.
  const proxyAddress = "0xb2ad6367DAC6133C8134B109fE3c451d93915e66";

  const JosamTokenV2 = await ethers.getContractFactory("JosamTokenV2");
  console.log("Preparing upgrade...");
  const josamtokenV2Address = await upgrades.prepareUpgrade(
    proxyAddress,
    JosamTokenV2
  );
  console.log(`JosamTokenV2 upgrade at: ${josamtokenV2Address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`something went wrong, ${error}`);
  });
