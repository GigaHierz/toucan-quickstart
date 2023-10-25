import { ethers } from "ethers";
import { FormatTypes, Interface, parseEther } from "ethers/lib/utils.js";
import RetirementHelper from "../../hardhat/artifacts/contracts/RetirementHelper.sol/RetirementHelper.json";
import ERC20 from "../abis/ERC20.json";
import { useState } from "react";

export default function RetireProjectById() {
  // Address of the RetirementHelper Contract
  const retirementHelperAddress = "0xBd07A6D47d83b4fc9C8996B0ab0bEBEfda429b2C";

  // token Addresses, should be removed for production. you can find all addresses in the README file
  const poolAddress = "0x02De4766C272abc10Bc88c220D214A26960a7e92"; // Celo
  const tco2Address = "0x96E58418524c01edc7c72dAdDe5FD5C1c82ea89F"; // Celo - TCO2-VCS-1529-2012

  // amount
  const amount = parseEther("0.0001");

  // transaction
  const [tx, setTx] = useState("");

  // ethers signer and provider
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/celo"
  );

  // make sure to set your private key in your .env file
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // create contract for approve function of the ERC20 token
  const iface = new Interface(ERC20.abi);
  iface.format(FormatTypes.full);
  const poolContract = new ethers.Contract(
    poolAddress,
    iface,
    signer || provider
  );

  // initialize RetirementHelper Contract
  const retirementHelper = new ethers.Contract(
    retirementHelperAddress,
    RetirementHelper.abi,
    signer || provider
  );

  // retire carbon credits
  const retire = async () => {
    await (await poolContract.approve(retirementHelperAddress, amount)).wait();

    console.log(poolAddress, tco2Address, amount);

    // call retirementHelper function to retire carbon credits of a specific project
    const tx = await retirementHelper.retireSpecificProject(
      poolAddress,
      [tco2Address],
      [amount],
      {
        gasLimit: 50000000,
      }
    );
    try {
      setTx(tx.hash);
      console.log(tx);
    } catch (error) {
      // Handle the error
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <button onClick={retire}>offset</button>
      {tx && <div>{`Transaction : ${tx}`}</div>}
    </div>
  );
}
