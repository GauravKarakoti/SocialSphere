const { expect } = require("chai");

describe("StakingVault", function () {
  it("Should stake and calculate yield", async function () {
    const StakingVault = await ethers.getContractFactory("StakingVault");
    const vault = await StakingVault.deploy("0xSPHERE_TOKEN_ADDRESS");
    await vault.stake(1000);
    expect(await vault.stakedBalance(owner.address)).to.equal(1000);
  });
});