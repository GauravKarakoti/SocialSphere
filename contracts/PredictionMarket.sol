// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IAggregatorV3Interface } from "./interfaces/AggregatorV3Interface.sol";

error BetAmountZero();
error NotAdmin();

contract PredictionMarket {
    IAggregatorV3Interface internal priceFeed;
    address public admin;
    mapping(address => uint256) public bets;

    // Sepolia ETH/USD Price Feed Address
    constructor(address _oracle) {
        priceFeed = IAggregatorV3Interface(_oracle);
        admin = msg.sender;
    }

    function betOnPrice(uint256 targetPrice) external payable {
        // Revert with custom error instead of require(...)
        if (msg.value == 0) revert BetAmountZero();
        bets[msg.sender] = targetPrice;
    }

    function resolveBet(address user) external {
        // Only admin can call: revert with custom error
        if (msg.sender != admin) revert NotAdmin();

        (, int256 currentPrice,,,) = priceFeed.latestRoundData();
        uint256 userBet = bets[user];

        if (userBet >= uint256(currentPrice)) {
            // Safely transfer 2× bet amount
            payable(user).transfer(userBet * 2);
        }
        delete bets[user];
    }
}
