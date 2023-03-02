const { ethers } = require("hardhat");
const { expect } = require("chai");

let JosamToken;
let josamtoken;

describe("ERC20 Josam Token version 1.", function () {
  before(async function () {
    JosamToken = await ethers.getContractFactory("JosamToken");
    josamtoken = await JosamToken.deploy();
    await josamtoken.deployed();
  });

  it("Token should be created with a pre-minting of 1 million Tokens.", async function () {
    const totalSupply = 1000000;
    const tokenName = "Josam Token";
    const tokenSymbol = "JTK";
    const decimals = 18;

    // Initialize the contract instead of using constroctor (To follow Openzeppelin Pattern)
    await josamtoken.initialize("Josam Token", "JTK");

    let result = await josamtoken.totalSupply(); // Get the totalSupply from contract.
    expect(result).to.equal(totalSupply);
    result = await josamtoken.name(); // Get the Token Name.
    expect(result).to.equal(tokenName);
    result = await josamtoken.symbol(); // Get the Toke symbol.
    expect(result).to.equal(tokenSymbol);
    result = await josamtoken.decimals(); // Get the Token decimals.
    expect(result).to.equal(decimals);
  });
});
