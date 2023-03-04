const { ethers } = require("hardhat");
const { expect } = require("chai");

let JosamTokenV1;
let JosamTokenV2;
let josamtokenV1;
let josamtokenV2;
let accounts;
let txFees;

describe("Test ERC20 Josam Token proxy version 2.", function () {
  before(async function () {
    JosamTokenV1 = await ethers.getContractFactory("JosamToken");
    JosamTokenV2 = await ethers.getContractFactory("JosamTokenV2");

    josamtokenV1 = await upgrades.deployProxy(
      JosamTokenV1,
      ["Josam Token", "JTK"],
      { initializer: "initialize" }
    ); // Upgrade first contract version 1
    josamtokenV2 = await upgrades.upgradeProxy(
      josamtokenV1.address,
      JosamTokenV2
    ); // Upgrade Contract V2 using Upgrade V1 contract address

    accounts = await ethers.getSigners();
    txFees = ethers.utils.parseUnits("1", "gwei");
  });

  it("Token should be created with a pre-minting of 1 million Tokens.", async function () {
    const totalSupply = 1000000;
    const tokenName = "Josam Token";
    const tokenSymbol = "JTK";
    const decimals = 18;

    let result = await josamtokenV2.totalSupply(); // Get the totalSupply from contract.
    expect(result).to.equal(totalSupply);
    result = await josamtokenV2.name(); // Get the Token Name.
    expect(result).to.equal(tokenName);
    result = await josamtokenV2.symbol(); // Get the Toke symbol.
    expect(result).to.equal(tokenSymbol);
    result = await josamtokenV2.decimals(); // Get the Token decimals.
    expect(result).to.equal(decimals);
  });

  it("Mint should allow to create new Tokens and increase TotalSupply.", async function () {
    let amount = 0;
    // Revert transaction for an invalid amount
    expect(josamtokenV2.mint(accounts[0], amount)).to.be.reverted;

    amount = 50000;
    const value1 = await josamtokenV2.totalSupply();
    const currentSupply = await value1.toNumber();
    await josamtokenV2.mint(accounts[0].address, amount);
    const value2 = await josamtokenV2.totalSupply();
    const newSupply = await value2.toNumber();
    expect(newSupply).to.equal(currentSupply + amount);
    const value3 = await josamtokenV2.balanceOf(accounts[0].address);
    const ownerBalance = await value3.toNumber();
    expect(ownerBalance).to.equal(newSupply);
  });

  it("Burn should allow to destroy existing Tokens and reduce TotalSupply.", async function () {
    let amount = 0;
    // Revert transaction for an invalid amount
    expect(josamtokenV2.burn(accounts[0], amount)).to.be.reverted;

    amount = 50000;
    const value1 = await josamtokenV2.totalSupply();
    const currentSupply = await value1.toNumber();
    await josamtokenV2.burn(accounts[0].address, amount);
    const value2 = await josamtokenV2.totalSupply();
    const newSupply = await value2.toNumber();
    expect(newSupply).to.equal(currentSupply - amount);
    const value3 = await josamtokenV2.balanceOf(accounts[0].address);
    const ownerBalance = await value3.toNumber();
    expect(ownerBalance).to.equal(newSupply);
  });

  it("Token should be transfered from one account to another.", async function () {
    let amount = 10000000;
    const value1 = await josamtokenV2.balanceOf(accounts[0].address); // From - msg.sender
    const balanceFromBefore = await value1.toNumber();
    const value2 = await josamtokenV2.balanceOf(accounts[1].address); // To - beneficiary
    const balanceToBefore = await value2.toNumber();
    // Revert transaction for an invalid amount (More than the Total Supply)
    expect(josamtokenV2.transfer(accounts[2].address, amount)).to.be.reverted;

    // Valid transfert
    amount = 5000;
    await josamtokenV2.transfer(accounts[1].address, amount, { value: txFees });
    const value3 = await josamtokenV2.balanceOf(accounts[0].address);
    const balanceFromAfter = await value3.toNumber();
    const value4 = await josamtokenV2.balanceOf(accounts[1].address);
    const balanceToAfter = await value4.toNumber();
    expect(balanceFromAfter).to.equal(balanceFromBefore - amount);
    expect(balanceToAfter).to.equal(balanceToBefore + amount);
  });

  it("Should Approve an account to spend Tokens in behalfe of another account.", async function () {
    const amount = 50000;
    await josamtokenV2.approve(accounts[4].address, amount);
    const currentAllowance = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    expect(currentAllowance).to.equal(amount);
  });

  it("Allowance will be increased by 1000 Tokens for the choosen account.", async function () {
    const amount = 1000;
    const value1 = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    const allowanceBefore = await value1.toNumber();

    await josamtokenV2.increaseAllowance(accounts[4].address, amount);
    const value2 = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    const allowanceAfter = await value2.toNumber();
    expect(allowanceAfter).to.equal(allowanceBefore + amount);
  });

  it("Allowance should be decreased by 1000 Tokens for the selected account.", async function () {
    const amount = 1000;
    const value1 = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    const allowanceBefore = await value1.toNumber();

    await josamtokenV2.decreaseAllowance(accounts[4].address, amount);
    const value2 = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    const allowanceAfter = await value2.toNumber();
    expect(allowanceAfter).to.equal(allowanceBefore - amount);
  });

  it("1000 Tokens should be spent on the behalf of the owner", async function () {
    let amount = 10000; // More than the allowance or approved amount to be spent.
    const value1 = await josamtokenV2.balanceOf(accounts[0].address); // From - Owner
    const balanceFromBefore = await value1.toNumber();
    const value2 = await josamtokenV2.balanceOf(accounts[5].address); // To - Beneficiary
    const balanceToBefore = await value2.toNumber();
    const value3 = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    const allowanceBefore = await value3.toNumber();

    // Make invalid transaction and revert - Amount greather than the allowance.
    expect(
      josamtokenV2.transferFrom(
        accounts[0].address,
        accounts[5].address,
        amount,
        { value: txFees }
      )
    ).to.be.reverted;
    amount = 1000;

    // Make another invalid transaction and revert - Payable function without sending
    expect(
      josamtokenV2.transferFrom(
        accounts[0].address,
        accounts[5].address,
        amount
      )
    ).to.be.reverted;

    // Valid transaction
    await josamtokenV2
      .connect(accounts[4])
      .transferFrom(accounts[0].address, accounts[5].address, amount, {
        value: txFees,
      });
    const value4 = await josamtokenV2.balanceOf(accounts[0].address);
    const balanceFromAfter = await value4.toNumber();
    const value5 = await josamtokenV2.balanceOf(accounts[5].address);
    const balanceToAfter = await value5.toNumber();
    const value6 = await josamtokenV2.allowance(
      accounts[0].address,
      accounts[4].address
    );
    const allowanceAfter = await value6.toNumber();

    expect(balanceFromAfter).to.equal(balanceFromBefore - amount);
    expect(balanceToAfter).to.equal(balanceToBefore + amount);
    expect(allowanceAfter).to.equal(allowanceBefore - amount);
  });
});
