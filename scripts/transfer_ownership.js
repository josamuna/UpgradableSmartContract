async function main() {
  // The new owner should be the Timelock contract address
  const newOwnerOfTheProxyAdmin = "0x45aC0f1607D1CF80e7e1Ce6Beb349428E8674500";

  console.log("Transferring ownership of ProxyAdmin");
  // The owner of the ProxyAdmin can upgrade contracts
  await upgrades.admin.transferProxyAdminOwnership(newOwnerOfTheProxyAdmin);

  console.log(
    `Transferred ownership of ProxiAdmin to: ${newOwnerOfTheProxyAdmin}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(`Something went wrong, ${error}.`);
    process.exit(1);
  });
