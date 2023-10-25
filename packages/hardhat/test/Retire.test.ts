const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

describe("RetirementHelper", function () {
  it("Should deploy the contract", async function () {
    const RetirementHelper = await ethers.getContractFactory(
      "RetirementHelper"
    );
    const retirementHelper = await RetirementHelper.deploy();
    await retirementHelper.deployed();

    expect(await retirementHelper.deployed()).to.not.equal(undefined);
  });

  it("Should retire specific project", async function () {
    const poolAddress = "0x02De4766C272abc10Bc88c220D214A26960a7e92"; // Celo - NCT
    const tco2Address = "0x96E58418524c01edc7c72dAdDe5FD5C1c82ea89F"; // Celo - TCO2-VCS-1529-2012

    const RetirementHelper = await ethers.getContractFactory(
      "RetirementHelper"
    );
    const retirementHelper = await RetirementHelper.deploy();
    await retirementHelper.deployed();

    // amount
    const amount = parseEther("0.0001");

    // Call the retireSpecificProject function with appropriate arguments
    const tx = await retirementHelper.retireSpecificProject(
      poolAddress,
      [tco2Address],
      [amount]
    );

    expect(tx);
  });
});
