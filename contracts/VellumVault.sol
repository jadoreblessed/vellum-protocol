// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title Vellum Vault
/// @notice Custodies an exact ERC-20 balance and mints one transferable ERC-721 claim note.
/// @dev This contract intentionally has no upgrade path and no admin asset-release method.
///      The guardian can only pause new deposits; already-mature notes remain claimable.
interface IERC20Vellum {
    function balanceOf(address account) external view returns (uint256);
}

interface IERC721ReceiverVellum {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}

contract VellumVault {
    string public constant name = "Vellum Note";
    string public constant symbol = "VNOTE";
    uint64 public constant MIN_TERM = 1 days;
    uint64 public constant MAX_TERM = 3650 days;

    struct Position {
        address token;
        uint256 amount;
        uint64 maturity;
        bool claimed;
    }

    uint256 public nextTokenId = 1;
    address public guardian;
    address public pendingGuardian;
    bool public wrapsPaused;

    mapping(uint256 => Position) public positions;
    mapping(uint256 => address) private _ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    uint256 private _reentrancyStatus = 1;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event NoteWrapped(uint256 indexed tokenId, address indexed owner, address indexed token, uint256 amount, uint64 maturity);
    event NoteClaimed(uint256 indexed tokenId, address indexed owner, address indexed token, uint256 amount);
    event WrapsPauseSet(bool paused);
    event GuardianTransferProposed(address indexed currentGuardian, address indexed pendingGuardian);
    event GuardianTransferred(address indexed previousGuardian, address indexed newGuardian);

    modifier onlyGuardian() {
        require(msg.sender == guardian, "Vellum: guardian only");
        _;
    }

    modifier nonReentrant() {
        require(_reentrancyStatus == 1, "Vellum: reentrant call");
        _reentrancyStatus = 2;
        _;
        _reentrancyStatus = 1;
    }

    constructor(address initialGuardian) {
        require(initialGuardian != address(0), "Vellum: guardian required");
        guardian = initialGuardian;
    }

    /// @notice ERC-165 and ERC-721 interface support.
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
        require(operator != msg.sender, "Vellum: self approval");
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(to != address(0), "Vellum: zero recipient");
        address owner = ownerOf(tokenId);
        require(owner == from, "Vellum: wrong owner");
        require(_isApprovedOrOwner(msg.sender, tokenId, owner), "Vellum: not authorised");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        transferFrom(from, to, tokenId);
        if (to.code.length != 0) {
            require(
                IERC721ReceiverVellum(to).onERC721Received(msg.sender, from, tokenId, data) == IERC721ReceiverVellum.onERC721Received.selector,
                "Vellum: unsafe recipient"
            );
        }
    }

    /// @notice Deposit an exact ERC-20 balance and mint a note to the depositor.
    /// @dev Fee-on-transfer and rebasing tokens are rejected to preserve a 1:1 claim.
    function wrap(address token, uint256 amount, uint64 termSeconds) external nonReentrant returns (uint256 tokenId) {
        require(!wrapsPaused, "Vellum: wraps paused");
        require(token != address(0), "Vellum: token required");
        require(amount != 0, "Vellum: amount required");
        require(termSeconds >= MIN_TERM && termSeconds <= MAX_TERM, "Vellum: invalid term");

        uint256 balanceBefore = IERC20Vellum(token).balanceOf(address(this));
        _safeTransferFrom(token, msg.sender, address(this), amount);
        uint256 received = IERC20Vellum(token).balanceOf(address(this)) - balanceBefore;
        require(received == amount, "Vellum: unsupported token transfer");

        tokenId = nextTokenId++;
        uint64 maturity = uint64(block.timestamp) + termSeconds;
        positions[tokenId] = Position({ token: token, amount: amount, maturity: maturity, claimed: false });
        _mint(msg.sender, tokenId);
        emit NoteWrapped(tokenId, msg.sender, token, amount, maturity);
    }

    /// @notice Redeem a mature note. Proceeds always go to its current ERC-721 holder.
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
        _safeTransfer(token, owner, amount);
        emit NoteClaimed(tokenId, owner, token, amount);
    }

    /// @notice Emergency control can stop new wraps only. It cannot block mature claims.
    function setWrapsPaused(bool paused) external onlyGuardian {
        wrapsPaused = paused;
        emit WrapsPauseSet(paused);
    }

    /// @notice Starts a two-step guardian rotation, intended for a multisig address.
    function proposeGuardian(address nextGuardian) external onlyGuardian {
        require(nextGuardian != address(0), "Vellum: guardian required");
        pendingGuardian = nextGuardian;
        emit GuardianTransferProposed(guardian, nextGuardian);
    }

    function acceptGuardian() external {
        require(msg.sender == pendingGuardian, "Vellum: pending guardian only");
        address previousGuardian = guardian;
        guardian = msg.sender;
        pendingGuardian = address(0);
        emit GuardianTransferred(previousGuardian, msg.sender);
    }

    function _isApprovedOrOwner(address caller, uint256 tokenId, address owner) private view returns (bool) {
        return caller == owner || caller == getApproved[tokenId] || isApprovedForAll[owner][caller];
    }

    function _mint(address to, uint256 tokenId) private {
        _ownerOf[tokenId] = to;
        balanceOf[to] += 1;
        emit Transfer(address(0), to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) private {
        delete getApproved[tokenId];
        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        _ownerOf[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId, address owner) private {
        delete getApproved[tokenId];
        delete _ownerOf[tokenId];
        balanceOf[owner] -= 1;
        emit Transfer(owner, address(0), tokenId);
    }

    function _safeTransferFrom(address token, address from, address to, uint256 amount) private {
        (bool success, bytes memory returndata) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, amount));
        require(success && (returndata.length == 0 || abi.decode(returndata, (bool))), "Vellum: deposit failed");
    }

    function _safeTransfer(address token, address to, uint256 amount) private {
        (bool success, bytes memory returndata) = token.call(abi.encodeWithSelector(0xa9059cbb, to, amount));
        require(success && (returndata.length == 0 || abi.decode(returndata, (bool))), "Vellum: release failed");
    }
}
