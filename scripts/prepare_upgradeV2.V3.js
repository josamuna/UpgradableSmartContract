async function main() {
  // Proxy address - Not the Admin Proxy Address (Timelock Controller Address).
  // First deployed contract of V1.
  const proxyAddress = "0x62Ecc819e15c7d5ef471E3356FdaF9Da52C591C7";

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
