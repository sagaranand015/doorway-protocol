import { ethers } from "hardhat";

async function main() {

  const sub = await ethers.deployContract("PlanSubscription", ["0x9e85e2Ee2D83a14f55C258e9a4012D628fD63c4F"], {});

  await sub.waitForDeployment();

  console.log(
    `Plan Subscription Contract deployed to ${sub.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
