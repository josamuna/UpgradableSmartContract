// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

contract JosamTokenV2 {
    // State variables
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) private _allowance; // To make able another address to use on behalf of another
    address private _owner;
    bool private _initialized;

    event Burn(address account, address contractAddress, uint256 amount);
    event Mint(address account, address contractAddress, uint256 amount);
    event Transfert(address to, uint256 amount);
    event TransfertFrom(address from, address to, uint256 amount);
    event OwnershipTransfert(address oldOwner, address newOwner);
    event Approval(address accountOwner, address spender, uint256 amount);

    // Create constructor by passing Token name and Symbol, then pre-mint 1 000 000 Tokens
    function initialize(string memory _tName, string memory _tSymbol) public {
        require(!_initialized, "Contract insteance has already initialized.");
        _name = _tName;
        _symbol = _tSymbol;
        _owner = payable(msg.sender); // The owner of the contract

        _totalSupply += 1000000;
        balances[msg.sender] += 1000000; // Update the balance of the owner.
        _initialized = true;
    }

    // Minting Tokens.
    function mint(address _account, uint256 _amount) public {
        // Address should not be the contract itself and no address(0) and the amout shoul be grather than 0
        require(
            _account != address(this) && _account != address(0) && _amount > 0,
            "ERC20: Can not mint. Invalid input."
        );
        _totalSupply += _amount; // Update the total supply.
        balances[_account] += _amount; // Increase as well the balance of the address who mint.

        emit Mint(_account, address(0), _amount); // Emit the event.
    }

    // // Address should not be the contract itself and no address(0) and the amout shoul be grather than 0
    function burn(address _account, uint256 _amount) external {
        require(
            _account != address(this) &&
                _account != address(0) &&
                balances[_account] >= _amount,
            "ERC20: Can not burn. Invalid input."
        );
        balances[_account] -= _amount; // Decrease as well the balance of the address who burn.
        _totalSupply -= _amount; // Decrease the total supply with the amount.

        emit Burn(_account, address(0), _amount); // Emit the event.
    }

    // Transfer Tokens. // "Josam Token","JTK"
    function transfer(address payable _to, uint _amount) external payable {
        require(_to != address(0) && _amount > 0, "ERC20: Invalid input.");
        require(
            balances[msg.sender] >= _amount,
            "ERC20: Transfer amount exceeds balance."
        );

        // Update balance of sender and receiver.
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        (bool success, ) = _to.call{gas: 10000, value: _amount}(
            "ERC20: Amount transfered."
        ); // Limit the gas to avoid draining account
        require(success, "ERC20: Failed to transfert Tokens."); // "ERC20: Amount transfered."

        emit Transfert(_to, _amount); // Emit the event.
    }

    // Transfer Token on behalf of the other account even if account balance is empty.
    function transferFrom(
        address payable _from,
        address payable _to,
        uint256 _amount
    ) external payable {
        require(
            _from != address(0) &&
                _from != address(this) &&
                _to != address(0) &&
                _amount > 0,
            "ERC20: Invalid input."
        );
        require(
            allowance(_from, msg.sender) >= _amount,
            "ERC20: Insufficient allowance."
        );
        require(
            balances[_from] >= _amount,
            "ERC20: Transfer amount exceeds balance."
        );

        _allowance[_from][msg.sender] -= _amount; // Update first the allownace amount

        // Update balance of sender and receiver
        balances[_from] -= _amount;
        balances[_to] += _amount;

        (bool success, ) = _from.call{gas: 10000, value: _amount}(
            "ERC20: Amount transfered."
        );
        require(success, "ERC20: Failed to transfer Tokens.");

        emit TransfertFrom(_from, _to, _amount); // Emit the event
    }

    // Approuve transfer from an other account using allowance emechanism. Any account ca approve allowance.
    function approve(address _spender, uint256 _amount) public {
        _allowance[msg.sender][_spender] = _amount; // Update the allowance

        emit Approval(msg.sender, _spender, _amount); // Emit the event.
    }

    // Activate Allowance | Get the amount a certain account is able to use in behalf of owner
    function allowance(
        address _ownerAccount,
        address _spender
    ) public view returns (uint256) {
        return _allowance[_ownerAccount][_spender];
    }

    // increasing allowance do the same as appove, but the only thing that increasing the amount of allowance.
    function increaseAllowance(address _spender, uint256 _amount) public {
        _allowance[msg.sender][_spender] += _amount;
    }

    // decreasing allowance do the same as appove, but the only thing decreasing the amount of allowance.
    function decreaseAllowance(address _spender, uint256 _amount) public {
        _allowance[msg.sender][_spender] -= _amount;
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

    // Only owner should execute some tasks (Mint Token, burn Token, etc.).
    modifier onlyOwner(address payable _account) {
        require(
            _account == _owner,
            "ERC20: You don't have permission to execute this task."
        );
        _;
    }
}
