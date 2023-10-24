import { ethers } from "ethers";
import { FormatTypes, Interface, parseEther } from "ethers/lib/utils.js";
import { useRef } from "react";
import { useProvider, useSigner } from "wagmi";
import RetirementHelper from "../abis/RetirementHelper.json";

import ERC20 from "../abis/ERC20.json";

export default function RetireProjectById() {
  // Address of the RetirementHelper Contract
  const retirementHelperAddress = "0xe3F0C2ad7DeB17Fb344De2c8B97B8A9909cF183f";

  // token Addresses, should be removed for production. you can find all addresses in the README file
  const poolAddress = "0xfb60a08855389F3c0A66b29aB9eFa911ed5cbCB5"; // Alfajores - NCT
  const tco2Address = "0xB7DF0aa693c2aeE70773a3b3d6010a132aDAA07e"; // Alfajores - TCO2-VCS-1529-2012

  // amount
  const amount = parseEther("0.0001");

  // set User & Signer
  const { data: signer, isError } = useSigner();
  const provider = useProvider();

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
    try {
      await (
        await poolContract.approve(retirementHelperAddress, amount)
      ).wait();

      // call retirementHelper function to retire carbon credits of a specific project
      const tx = await retirementHelper.retireSpecificProject(
        poolAddress,
        [tco2Address],
        [amount],
        {
          gasLimit: 5000000,
        }
      );
      console.log(tx);
    } catch (error) {
      // Handle the error
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <button onClick={retire}>offset</button>
      <button onClick={retire}>Transaction : {tx}</button>
    </div>
  );
}
