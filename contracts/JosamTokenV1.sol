// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

contract JosamToken {
    // State variables
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    mapping(address => uint256) balances;
    address payable private _owner;

    // Create constructor by passing Token name and Symbol, then pre-mint 1 000 000 Tokens
    constructor() {
        _name = "Josam Token";
        _symbol = "JTK";
        _owner = payable(msg.sender); // The owner of the contract

        _totalSupply += 1000000;
        balances[_owner] += 1000000; // Update the balance of the owner.
    }

    // Get the Token name.
    function name() public view returns (string memory) {
        return _name;
    }

    // get the Token symbol.
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // Get the Token's total Supply.
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // Get the Token's decimals.
    function decimals() public pure returns (uint8) {
        return 18;
    }

    // Get Account balance.
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    // Get the owner.
    function owner() public view returns (address) {
        return _owner;
    }
}
