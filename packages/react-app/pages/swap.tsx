import { ethers } from "ethers";
import { FormatTypes, Interface, parseEther } from "ethers/lib/utils.js";
import { useRef } from "react";
import { useProvider, useSigner } from "wagmi";
import SimpleSwap from "../abis/SimpleSwap.json";
import ERC20 from "../abis/ERC20.json";

export default function Home() {
  const swapperAddress = "packages/react-app/pages/index.tsx"; // Mumbai
  const poolAddress = "0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E"; // Mumbai - NCT
  const depositedToken = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Mumbai - USDC
  const tco2Address = "0xF7e61e0084287890E35e46dc7e077d7E5870Ae27"; // Mumbai - TCO2-VCS-1529-2012

  const amount = parseEther("0.0001");
  const { data: signer } = useSigner();
  const provider = useProvider();

  const transaction = useRef(null);

  // create contract for approve function of the ERC20 token
  const iface = new Interface(ERC20.abi);
  iface.format(FormatTypes.full);

  const depositedTokenContract = new ethers.Contract(
    tco2Address,
    iface,
    signer || provider
  );

  const simpleSwap = new ethers.Contract(
    swapperAddress,
    SimpleSwap.abi,
    signer || provider
  );

  const swap = async () => {
    await (await depositedTokenContract.approve(swapperAddress, amount)).wait();
    // await (await tco2Contract.approve(OffsetHelper.address, amount)).wait();
    // await (
    //   await depositedTokenContract.approve(OffsetHelper.address, amount)
    // ).wait();

    const tx = await simpleSwap.swapExactInputSingle(
      depositedToken,
      poolAddress,
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
      <button onClick={swap}>offset</button>
    </div>
  );
}
