const { ethers } = require("hardhat");
const { expect } = require("chai");

let Token;
let token;

describe("ERC20 Josam Token version 1.", function () {
  before(async function () {
    Token = await ethers.getContractFactory("JosamToken");
    token = await Token.deploy();
    await token.deployed();
  });

  it("Token should be created with a pre-minting of 1 million Tokens.", async function () {
    const totalSupply = 1000000;
    const tokenName = "Josam Token";
    const tokenSymbol = "JTK";
    const decimals = 18;

    let result = await token.totalSupply(); // Get the totalSupply from contract.
    expect(result).to.equal(totalSupply);
    result = await token.name(); // Get the Token Name.
    expect(result).to.equal(tokenName);
    result = await token.symbol(); // Get the Toke symbol.
    expect(result).to.equal(tokenSymbol);
    result = await token.decimals(); // Get the Token decimals.
    expect(result).to.equal(decimals);
  });
});
