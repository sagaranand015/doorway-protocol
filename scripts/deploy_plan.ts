import { ethers } from "hardhat";

async function main() {

  const plan = await ethers.deployContract("Plan", [], {});

  await plan.waitForDeployment();

  console.log(
    `Plan Contract deployed to ${plan.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
