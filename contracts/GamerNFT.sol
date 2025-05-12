// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error AlreadyClaimed();

contract GamerNFT is ERC721 {
    uint256 public tokenId;
    mapping(address => bool) public claimed;

    constructor() ERC721("GamerNFT", "GAME") {}

    function mintTopPlayer(address winner) external {
        // Use custom error instead of require with message
        if (claimed[winner]) revert AlreadyClaimed();
        
        _safeMint(winner, tokenId);
        unchecked { tokenId++; }
        claimed[winner] = true;
    }
}
