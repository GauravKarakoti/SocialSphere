const hre = require("hardhat");

async function main() {
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const market = await PredictionMarket.deploy("0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD");
  await market.waitForDeployment();
  console.log("PredictionMarket deployed to:", await market.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});