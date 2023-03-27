const hre = require("hardhat");

async function main() {
  const ZoneNFT = await hre.ethers.getContractFactory("ZoneNFT");
  const zoneNFT = await ZoneNFT.deploy();

  await zoneNFT.deployed();

  console.log(
    `zoneNFT deployed to ${zoneNFT.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
