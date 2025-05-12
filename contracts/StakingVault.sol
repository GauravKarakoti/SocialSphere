// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingVault {
  IERC20 public sphereToken;
  uint256 public totalStaked;
  mapping(address => uint256) public stakedBalance;
  uint256 public constant BURN_RATE = 10; // 10% of fees burned

  constructor(address _token) {
    sphereToken = IERC20(_token);
  }

  function stake(uint256 amount) external {
    sphereToken.transferFrom(msg.sender, address(this), amount);
    totalStaked += amount;
    stakedBalance[msg.sender] += amount;
  }

  function _calculateYield(address user) internal view returns (uint256) {
    return (stakedBalance[user] * 5) / 100; // 5% base APY + loyalty boost
  }

  function withdrawYield() external {
    uint256 yield = _calculateYield(msg.sender);
    uint256 burnAmount = (yield * BURN_RATE) / 100;
    sphereToken.transfer(msg.sender, yield - burnAmount);
    sphereToken.transfer(address(0xdead), burnAmount); // Burn
  }
}