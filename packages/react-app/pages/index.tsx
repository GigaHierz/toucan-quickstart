import { ethers } from "ethers";
import { FormatTypes, Interface, parseEther } from "ethers/lib/utils.js";
import RetirementHelper from "../abis/RetirementHelper.json";
import ERC20 from "../abis/ERC20.json";
import { useState } from "react";
import { useEthersProvider, useEthersSigner } from "@/utils/ethers";

export default function RetireProjectById() {
  // token Addresses, should be removed for production. you can find all addresses in the README file
  // const retirementHelperAddress = "0xBd07A6D47d83b4fc9C8996B0ab0bEBEfda429b2C"; // Celo
  // const poolAddress = "0x02De4766C272abc10Bc88c220D214A26960a7e92"; // Celo
  // const tco2Address = "0x96E58418524c01edc7c72dAdDe5FD5C1c82ea89F"; // Celo - TCO2-VCS-1529-2012

  // const retirementHelperAddress = "0x5Ba296e52C79336012FdCE63fd6743BaDE3D725E"; // Alfajores
  // const poolAddress = "0xfb60a08855389F3c0A66b29aB9eFa911ed5cbCB5"; // Alfajores
  // const tco2Address = "0xB7DF0aa693c2aeE70773a3b3d6010a132aDAA07e"; // Alfajores - TCO2-VCS-1529-2012

  const retirementHelperAddress = "0x9045E716A42D63c4DcfFaa9e63DbE3b088036469"; // - Mumbai
  const poolAddress = "0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E"; // Mumbai - NCT
  const tco2Address = "0xF7e61e0084287890E35e46dc7e077d7E5870Ae27"; // Mumbai - TCO2-VCS-1529-2012
  // amount
  const amount = parseEther("0.0001");

  // transaction
  const [tx, setTx] = useState("");

  // ethers signer and provider
  const provider = useEthersProvider();
  const signer = useEthersSigner();

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
  const retireProjectById = async () => {
    await (await poolContract.approve(retirementHelperAddress, amount)).wait();

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
      <button onClick={retireProjectById}>offset</button>
      {tx && <div>{`Transaction : ${tx}`}</div>}
    </div>
  );
}
