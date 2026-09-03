// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @notice Minimal ERC-20 custody + transferable note vault for Base Sepolia only.
/// @dev This contract is deliberately for test tokens. Do not deploy it for mainnet use.
interface IERC20Test {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract VellumTestVault {
    string public constant name = "Vellum Test Note";
    string public constant symbol = "VNOTE";

    struct Position {
        address token;
        uint128 amount;
        uint64 maturity;
        address creator;
        bool claimed;
    }

    uint256 public nextTokenId = 1;
    mapping(uint256 => Position) public positions;
    mapping(uint256 => address) private _ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    bool private _entered;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event NoteWrapped(uint256 indexed tokenId, address indexed owner, address indexed token, uint256 amount, uint64 maturity);
    event NoteClaimed(uint256 indexed tokenId, address indexed owner, address indexed token, uint256 amount);

    modifier nonReentrant() {
        require(!_entered, "Vellum: reentrant call");
        _entered = true;
        _;
        _entered = false;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x01ffc9a7 || interfaceId == 0x80ac58cd;
    }

    function ownerOf(uint256 tokenId) public view returns (address owner) {
        owner = _ownerOf[tokenId];
        require(owner != address(0), "Vellum: unknown note");
    }

    function approve(address approved, uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || isApprovedForAll[owner][msg.sender], "Vellum: not authorised");
        getApproved[tokenId] = approved;
        emit Approval(owner, approved, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(to != address(0), "Vellum: zero recipient");
        address owner = ownerOf(tokenId);
        require(owner == from, "Vellum: wrong owner");
        require(
            msg.sender == owner || msg.sender == getApproved[tokenId] || isApprovedForAll[owner][msg.sender],
            "Vellum: not authorised"
        );
        delete getApproved[tokenId];
        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        _ownerOf[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function wrap(address token, uint128 amount, uint64 termSeconds) external nonReentrant returns (uint256 tokenId) {
        require(token != address(0), "Vellum: token required");
        require(amount > 0, "Vellum: amount required");
        require(termSeconds >= 60, "Vellum: term too short");
        require(IERC20Test(token).transferFrom(msg.sender, address(this), amount), "Vellum: deposit failed");

        tokenId = nextTokenId++;
        uint64 maturity = uint64(block.timestamp) + termSeconds;
        positions[tokenId] = Position({ token: token, amount: amount, maturity: maturity, creator: msg.sender, claimed: false });
        _ownerOf[tokenId] = msg.sender;
        balanceOf[msg.sender] += 1;

        emit Transfer(address(0), msg.sender, tokenId);
        emit NoteWrapped(tokenId, msg.sender, token, amount, maturity);
    }

    function claim(uint256 tokenId) external nonReentrant {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "Vellum: holder only");
        Position storage position = positions[tokenId];
        require(!position.claimed, "Vellum: already claimed");
        require(block.timestamp >= position.maturity, "Vellum: not mature");

        position.claimed = true;
        address token = position.token;
        uint256 amount = position.amount;
        _burn(tokenId, owner);
        require(IERC20Test(token).transfer(owner, amount), "Vellum: release failed");
        emit NoteClaimed(tokenId, owner, token, amount);
    }

    function _burn(uint256 tokenId, address owner) private {
        delete getApproved[tokenId];
        delete _ownerOf[tokenId];
        balanceOf[owner] -= 1;
        emit Transfer(owner, address(0), tokenId);
    }
}
