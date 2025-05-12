const hre = require("hardhat");

async function main() {
  const StakingVault = await hre.ethers.getContractFactory("StakingVault");
  const market = await StakingVault.deploy("0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD");
  await market.waitForDeployment();
  console.log("StakingVault deployed to:", await market.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});