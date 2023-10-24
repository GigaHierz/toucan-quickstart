import { ethers } from "ethers";
import { FormatTypes, Interface, parseEther } from "ethers/lib/utils.js";
import { useRef } from "react";
import { useProvider, useSigner } from "wagmi";
import RetirementHelper from "../abis/RetirementHelper.json";
import ERC20 from "../abis/ERC20.json";

export default function Home() {
  // const poolAddress = "0x02De4766C272abc10Bc88c220D214A26960a7e92"; // Celo
  // const poolAddress = "0xD838290e877E0188a4A44700463419ED96c16107"; // Polygon
  // const poolAddress = "0xfb60a08855389F3c0A66b29aB9eFa911ed5cbCB5"; // Alfajores
  const poolAddress = "0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E"; // Mumbai - NCT
  // const depositedToken = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Celo - cUSD
  const depositedToken = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Mumbai - USDC
  // const depositedToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon - USDC
  // const tco2Address = "0x96E58418524c01edc7c72dAdDe5FD5C1c82ea89F"; // Celo - TCO2-VCS-1529-2012
  // const tco2Address = "0xB7DF0aa693c2aeE70773a3b3d6010a132aDAA07e"; // Alfajores - TCO2-VCS-1529-2012
  // const tco2Address = "0xF7e61e0084287890E35e46dc7e077d7E5870Ae27"; // Polygon - TCO2-VCS-1529-2012
  const tco2Address = "0xF7e61e0084287890E35e46dc7e077d7E5870Ae27"; // Mumbai - TCO2-VCS-1529-2012
  const retirementHelperAddress = "0xb6Bb229Bcc98205e973190Fa2124A9adFdd823E6";

  const amount = parseEther("0.0001");
  const { data: signer, isError } = useSigner();
  const provider = useProvider();

  const transaction = useRef(null);

  // create contract for approve function of the ERC20 token
  const iface = new Interface(ERC20.abi);
  iface.format(FormatTypes.full);
  const poolContract = new ethers.Contract(
    poolAddress,
    iface,
    signer || provider
  );

  const tco2Contract = new ethers.Contract(
    tco2Address,
    iface,
    signer || provider
  );

  const depositedTokenContract = new ethers.Contract(
    tco2Address,
    iface,
    signer || provider
  );

  const offsetHelper = new ethers.Contract(
    retirementHelperAddress,
    RetirementHelper.abi,
    signer || provider
  );

  const retire = async () => {
    await (await poolContract.approve(retirementHelperAddress, amount)).wait();
    // await (await tco2Contract.approve(retirementHelperAddress, amount)).wait();
    // await (
    //   await depositedTokenContract.approve(retirementHelperAddress, amount)
    // ).wait();

    const tx = await offsetHelper.retireSpecificProject(
      poolAddress,
      tco2Address,
      amount,
      {
        gasLimit: 5000000,
      }
    );
    transaction.current = tx;
    console.log(tx);
  };

  return (
    <div>
      <button onClick={retire}>offset</button>
    </div>
  );
}
