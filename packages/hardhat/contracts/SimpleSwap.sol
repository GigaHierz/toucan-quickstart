// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

// Import the Uniswap V3 Router contract
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract SimpleSwap {
    // Define the Uniswap V3 Router contract address and the tokens you want to swap
    ISwapRouter public immutable swapRouter;

    // should be set in the constructor
    // address UNISWAP_ROUTER_ADDRESS = 0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897; // - Celo - UniversalRouter
    // address UNISWAP_ROUTER_ADDRESS = 0x5615CDAb10dc425a742d643d949a7F474C01abc4; // - Celo - SwapRouter
    // address UNISWAP_ROUTER_ADDRESS = 0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD; // - Polygon - UniversalRouter
    address UNISWAP_ROUTER_ADDRESS = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // - Polygon - SwapRouter
    address public constant fromToken =
        // 0x765DE816845861e75A25fCA122bb6898B8B1282a; // cUSD - Celo
        0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; // USDC - Polygon
    address public constant poolToken =
        //     0x02De4766C272abc10Bc88c220D214A26960a7e92; // NCT - Celo
        0xD838290e877E0188a4A44700463419ED96c16107; // NCT - Polygon

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor() {
        swapRouter = ISwapRouter(0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897);
    }

    // Specify the swap parameters, such as token addresses, amounts, and other details
    // ...
    function swapExactInputSingle(
        address _fromToken,
        address _poolToken,
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        // msg.sender must approve this contract

        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(
            _fromToken,
            msg.sender,
            address(this),
            amountIn
        );

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(_fromToken, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _fromToken,
                tokenOut: _poolToken,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }
    // Execute the swap
    // ...
}
