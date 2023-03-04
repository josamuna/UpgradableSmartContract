const { ethers } = require("hardhat");
const { expect } = require("chai");

let JosamTokenV3;
let josamtokenV3;
let accounts;
let txFees;
let owner;

describe("ERC20 Josam Token version 3.", function () {
  before(async function () {
    JosamTokenV3 = await ethers.getContractFactory("JosamTokenV3");
    josamtokenV3 = await JosamTokenV3.deploy();
    await josamtokenV3.deployed();
    accounts = await ethers.getSigners();
    txFees = ethers.utils.parseUnits("1", "gwei");
  });

  it("Token should be created with a pre-minting of 1 million Tokens.", async function () {
    const totalSupply = 1000000;
    const tokenName = "Josam Token";
    const tokenSymbol = "JTK";
    const decimals = 18;

    // Initialize the contract instead of using constroctor (To follow Openzeppelin Pattern)
    await josamtokenV3.initialize("Josam Token", "JTK");

    // Set the owner
    owner = await josamtokenV3.owner();

    let result = await josamtokenV3.totalSupply(); // Get the totalSupply from contract.
    expect(result).to.equal(totalSupply);
    result = await josamtokenV3.name(); // Get the Token Name.
    expect(result).to.equal(tokenName);
    result = await josamtokenV3.symbol(); // Get the Toke symbol.
    expect(result).to.equal(tokenSymbol);
    result = await josamtokenV3.decimals(); // Get the Token decimals.
    expect(result).to.equal(decimals);
  });

  it("Mint should allow to create new Tokens and increase TotalSupply.", async function () {
    let amount = 0;
    // Revert transaction for an invalid amount
    expect(josamtokenV3.mint(owner, amount)).to.be.reverted;

    // Try to mint with address different to the owner (msg.sender) and revert
    amount = 10000;
    expect(josamtokenV3.connect(accounts[6]).mint(accounts[6].address, amount))
      .to.be.reverted;

    amount = 50000;
    const value1 = await josamtokenV3.totalSupply();
    const currentSupply = await value1.toNumber();
    await josamtokenV3.connect(accounts[0]).mint(owner, amount);
    const value2 = await josamtokenV3.totalSupply();
    const newSupply = await value2.toNumber();
    expect(newSupply).to.equal(currentSupply + amount);
    const value3 = await josamtokenV3.balanceOf(owner);
    const ownerBalance = await value3.toNumber();
    expect(ownerBalance).to.equal(newSupply);
  });

  it("Burn should allow to destroy existing Tokens and reduce TotalSupply.", async function () {
    let amount = 0;
    // Revert transaction for an invalid amount
    expect(josamtokenV3.burn(owner, amount)).to.be.reverted;

    // Try to burn with address different to the owner (msg.sender) and revert
    amount = 10000;
    expect(josamtokenV3.connect(accounts[6]).burn(accounts[6].address, amount))
      .to.be.reverted;

    amount = 50000;
    const value1 = await josamtokenV3.totalSupply();
    const currentSupply = await value1.toNumber();
    await josamtokenV3.connect(accounts[0]).burn(owner, amount);
    const value2 = await josamtokenV3.totalSupply();
    const newSupply = await value2.toNumber();
    expect(newSupply).to.equal(currentSupply - amount);
    const value3 = await josamtokenV3.balanceOf(owner);
    const ownerBalance = await value3.toNumber();
    expect(ownerBalance).to.equal(newSupply);
  });

  it("Token should be transfered from one account to another.", async function () {
    let amount = 10000000;
    const value1 = await josamtokenV3.balanceOf(owner); // From - msg.sender
    const balanceFromBefore = await value1.toNumber();
    const value2 = await josamtokenV3.balanceOf(accounts[1].address); // To - beneficiary
    const balanceToBefore = await value2.toNumber();
    // Revert transaction for an invalid amount (More than the Total Supply)
    expect(josamtokenV3.transfer(accounts[2].address, amount)).to.be.reverted;

    // Valid transfert
    amount = 5000;
    await josamtokenV3.transfer(accounts[1].address, amount, { value: txFees });
    const value3 = await josamtokenV3.balanceOf(owner);
    const balanceFromAfter = await value3.toNumber();
    const value4 = await josamtokenV3.balanceOf(accounts[1].address);
    const balanceToAfter = await value4.toNumber();
    expect(balanceFromAfter).to.equal(balanceFromBefore - amount);
    expect(balanceToAfter).to.equal(balanceToBefore + amount);
  });

  it("Should Approve an account to spend Tokens in behalfe of another account.", async function () {
    const amount = 50000;
    await josamtokenV3.approve(accounts[4].address, amount);
    const currentAllowance = await josamtokenV3.allowance(
      owner,
      accounts[4].address
    );
    expect(currentAllowance).to.equal(amount);
  });

  it("Allowance will be increased by 1000 Tokens for the choosen account.", async function () {
    const amount = 1000;
    const value1 = await josamtokenV3.allowance(owner, accounts[4].address);
    const allowanceBefore = await value1.toNumber();

    await josamtokenV3.increaseAllowance(accounts[4].address, amount);
    const value2 = await josamtokenV3.allowance(owner, accounts[4].address);
    const allowanceAfter = await value2.toNumber();
    expect(allowanceAfter).to.equal(allowanceBefore + amount);
  });

  it("Allowance should be decreased by 1000 Tokens for the selected account.", async function () {
    const amount = 1000;
    const value1 = await josamtokenV3.allowance(owner, accounts[4].address);
    const allowanceBefore = await value1.toNumber();

    await josamtokenV3.decreaseAllowance(accounts[4].address, amount);
    const value2 = await josamtokenV3.allowance(owner, accounts[4].address);
    const allowanceAfter = await value2.toNumber();
    expect(allowanceAfter).to.equal(allowanceBefore - amount);
  });

  it("1000 Tokens should be spent on the behalf of the owner", async function () {
    let amount = 10000; // More than the allowance or approved amount to be spent.
    const value1 = await josamtokenV3.balanceOf(owner); // From - Owner
    const balanceFromBefore = await value1.toNumber();
    const value2 = await josamtokenV3.balanceOf(accounts[5].address); // To - Beneficiary
    const balanceToBefore = await value2.toNumber();
    const value3 = await josamtokenV3.allowance(owner, accounts[4].address);
    const allowanceBefore = await value3.toNumber();

    // Make invalid transaction and revert - Amount greather than the allowance.
    expect(
      josamtokenV3.transferFrom(owner, accounts[5].address, amount, {
        value: txFees,
      })
    ).to.be.reverted;
    amount = 1000;

    // Make another invalid transaction and revert - Payable function without sending
    expect(josamtokenV3.transferFrom(owner, accounts[5].address, amount)).to.be
      .reverted;

    // Valid transaction
    await josamtokenV3
      .connect(accounts[4])
      .transferFrom(owner, accounts[5].address, amount, {
        value: txFees,
      });
    const value4 = await josamtokenV3.balanceOf(owner);
    const balanceFromAfter = await value4.toNumber();
    const value5 = await josamtokenV3.balanceOf(accounts[5].address);
    const balanceToAfter = await value5.toNumber();
    const value6 = await josamtokenV3.allowance(owner, accounts[4].address);
    const allowanceAfter = await value6.toNumber();

    expect(balanceFromAfter).to.equal(balanceFromBefore - amount);
    expect(balanceToAfter).to.equal(balanceToBefore + amount);
    expect(allowanceAfter).to.equal(allowanceBefore - amount);
  });
});
