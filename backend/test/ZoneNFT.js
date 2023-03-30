const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');


let contract;
let owner;
describe("deploy ZoneNFT contract", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
  });

  it("after deploy should return 8 tokens", async function () {
    expect(await contract.balanceOf(owner)).to.equal(8);
  });
});

describe("test createZone ", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
  });

  it("should return info token", async function () {
    let zone1 = await contract._zones(1)
    expect(zone1[0]).to.equal("Zone A - 1");
    expect(zone1[1]).to.equal(false);
    expect(parseFloat(zone1[2])).to.equal(5 * (10 ** 16));
    expect(zone1[3]).to.equal(owner);
    expect(zone1[4]).to.equal('1');
  });
});

describe("test setForSale zone", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()

    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
    await contract.setForSale(1, 1)
  });

  it("should return true for sale token", async function () {
    let zone1 = await contract._zones(1)
    expect(zone1[1]).to.equal(true);
    expect(parseFloat(zone1[2])).to.equal(1 * (10 ** 16));
  });

  it('should revert if you are not the owner of the token', async () => {
    const [_, buyerAddress] = await ethers.getSigners();
    const contractWithBuyer = contract.connect(buyerAddress);

    await expectRevert(
      contractWithBuyer.setForSale(1, 1),
      'Only the owner can set for sale'
    );
  });

  it('should revert if the token is already set for sale', async () => {
    await expectRevert(
      contract.setForSale(1, 1),
      'Already set'
    );
  });
});

describe("test unSale zone", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()

    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
    await contract.setForSale(1, 1)
    await contract.unSale(1)

  });

  it("should return false for sale token", async function () {
    let zone1 = await contract._zones(1)
    expect(zone1[1]).to.equal(false);
  });

  it('should revert if you are not the owner of the token', async () => {
    const [_, buyerAddress] = await ethers.getSigners();
    const contractWithBuyer = contract.connect(buyerAddress);

    await expectRevert(
      contractWithBuyer.unSale(1),
      'Only the owner can set for sale'
    );
  });

  it('should revert if the token is already set unsale', async () => {
    await expectRevert(
      contract.unSale(1),
      'Already set'
    );
  });
});

describe("test buyZone ", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
    await contract.setForSale(1, 1)
  });

  it("should return 1 token for buyer balance", async function () {
    const [_, buyerAddress] = await ethers.getSigners();
    const contractWithBuyer = contract.connect(buyerAddress);
    let buyer = await buyerAddress.getAddress()
    const oldownerBalance = await ethers.provider.getBalance(owner);
    const zonePrice = ethers.BigNumber.from("1000000000000000000");
    await contractWithBuyer.buyZoneNFT(1, { value: zonePrice });
    let zone1 = await contract._zones(1)
    const ownerBalance = await ethers.provider.getBalance(owner);
    expect(zone1[3]).to.equal(buyer);
    expect(await contract.balanceOf(buyer)).to.equal(1);
    expect(parseFloat(ownerBalance)).to.equal(parseFloat(oldownerBalance) + parseFloat(zonePrice));
  });

  it('should revert if You are the owner', async () => {
    const zonePrice = ethers.BigNumber.from("1000000000000000000");
    await expectRevert(
      contract.buyZoneNFT(1, { value: zonePrice }),
      'You are the owner'
    );
  });

  it('should revert if Token is not for sale', async () => {
    contract.unSale(1);
    const [_, buyerAddress] = await ethers.getSigners();
    const contractWithBuyer = contract.connect(buyerAddress);
    const zonePrice = ethers.BigNumber.from("1000000000000000000");
    await expectRevert(
      contractWithBuyer.buyZoneNFT(1, { value: zonePrice }),
      'Token is not for sale'
    );
  });

  it('should revert if Ether value is not greater than price', async () => {
    const [_, buyerAddress] = await ethers.getSigners();
    const contractWithBuyer = contract.connect(buyerAddress);
    const zonePrice = ethers.BigNumber.from("1");
    await expectRevert(
      contractWithBuyer.buyZoneNFT(1, { value: zonePrice }),
      'Ether value must be greater than price'
    );
  });
});

describe("test getAllNFTs", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
  });

  it("should return 8 tokens", async function () {
    const arrayNFT = await contract.getAllNFTs()
    expect(arrayNFT.length).to.equal(8);
    expect(arrayNFT[0][0]).to.equal('Zone A - 1');
  });
});

describe("test getMyNFTs", function () {

  beforeEach(async function () {
    [ownerAddress] = await ethers.getSigners();
    owner = await ownerAddress.getAddress()
    const Contract = await ethers.getContractFactory("ZoneNFT");
    contract = await Contract.deploy();
    await contract.setForSale(1, 1)
  });

  it("should return 8 tokens", async function () {
    const [_, buyerAddress] = await ethers.getSigners();
    const contractWithBuyer = contract.connect(buyerAddress);
    const zonePrice = ethers.BigNumber.from("1000000000000000000");
    await contractWithBuyer.buyZoneNFT(1, { value: zonePrice });
    const arrayNFT = await contractWithBuyer.getMyNFTs()
    expect(arrayNFT.length).to.equal(1);
    expect(arrayNFT[0][0]).to.equal('Zone A - 1');
  });
});