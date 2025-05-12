const hre = require("hardhat");

async function main() {
  const GamerNFT = await hre.ethers.getContractFactory("GamerNFT");
  
  // Deploy without any parameters
  const nft = await GamerNFT.deploy();
  
  await nft.waitForDeployment();
  console.log("GamerNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});