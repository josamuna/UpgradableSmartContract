const { ethers } = require("hardhat");
const { expect } = require("chai");

let JosamTokenV1;
let josamtokenV1;

describe("Test ERC20 Josam Token proxy version 1.", function () {
  before(async function () {
    JosamTokenV1 = await ethers.getContractFactory("JosamToken");
    josamtokenV1 = await upgrades.deployProxy(
      JosamTokenV1,
      ["Josam Token", "JTK"],
      {
        initializer: "initialize",
      }
    ); // Route the proxy contract to the contract v1 implementation (JosamToken).
  });

  it("Retreive Token earlier pre-minted.", async function () {
    const totalSupply = 1000000;
    const tokenName = "Josam Token";
    const tokenSymbol = "JTK";
    const decimals = 18;

    // Initialize the contract instead of using constroctor (To follow Openzeppelin Pattern)
    // await token.initialize();

    let result = await josamtokenV1.totalSupply(); // Get the totalSupply from contract.
    expect(result).to.equal(totalSupply);
    result = await josamtokenV1.name(); // Get the Token Name.
    expect(result).to.equal(tokenName);
    result = await josamtokenV1.symbol(); // Get the Toke symbol.
    expect(result).to.equal(tokenSymbol);
    result = await josamtokenV1.decimals(); // Get the Token decimals.
    expect(result).to.equal(decimals);
  });
});
