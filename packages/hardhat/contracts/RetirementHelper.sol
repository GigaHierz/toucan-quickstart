// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import "./interfaces/IToucanPoolToken.sol";
import "./interfaces/IToucanCarbonOffsets.sol";
import "./SimpleSwap.sol";
import "./ToucanCalculator.sol";
import "./ToucanSwapper.sol";

// Uniswap router
contract RetirementHelper is ToucanCalculator {
    using SafeERC20 for IERC20;
    SimpleSwap simpleSwapper;

    /**
     * @notice Contract constructor. Should specify arrays of ERC20 symbols and
     * addresses that can used by the contract.
     *
     * @dev See `isEligible()` for a list of tokens that can be used in the
     * contract. These can be modified after deployment by the contract owner
     * using `setEligibleTokenAddress()` and `deleteEligibleTokenAddress()`.
     *
     * @param _poolAddresses A list of pool token addresses.
     * @param _tokenSymbolsForPaths An array of symbols of the token the user want to retire carbon credits for
     * @param _paths An array of arrays of addresses to describe the path needed to swap form the baseToken to the pool Token
     * to the provided token symbols.
     */
    constructor(
        address[] memory _poolAddresses,
        string[] memory _tokenSymbolsForPaths,
        address[][] memory _paths,
        address _dexRouterAddress
    ) {
        poolAddresses = _poolAddresses;
        tokenSymbolsForPaths = _tokenSymbolsForPaths;
        paths = _paths;
        dexRouterAddress = _dexRouterAddress;

        uint256 eligibleSwapPathsBySymbolLen = _tokenSymbolsForPaths.length;
        for (uint256 i; i < eligibleSwapPathsBySymbolLen; i++) {
            eligibleSwapPaths[_paths[i][0]] = _paths[i];
            eligibleSwapPathsBySymbol[_tokenSymbolsForPaths[i]] = _paths[i];
        }
    }

    /**
     * @notice Retire carbon credits using the lowest quality (oldest) TCO2
     * tokens available from the specified Toucan token pool by sending ERC20
     * tokens (cUSD, USDC, WETH, WMATIC). All provided token is consumed for
     * offsetting.
     *
     * This function:
     * 1. Swaps the ERC20 token sent to the contract for the specified pool token.
     * 2. Redeems the pool token for the poorest quality TCO2 tokens available.
     * 3. Retires the TCO2 tokens.
     *
     * Note: The client must approve the ERC20 token that is sent to the contract.
     *
     * @dev When automatically redeeming pool tokens for the lowest quality
     * TCO2s there are no fees and you receive exactly 1 TCO2 token for 1 pool
     * token.
     * @param _fromToken The address of the ERC20 token that the user sends
     * (e.g., cUSD, cUSD, USDC, WETH, WMATIC)
     * @param _poolToken The address of the Toucan pool token that the
     * user wants to use,  e.g., NCT or BCT
     * @param _tco2s The address of the TCO2 token that the wants to retire
     * @param _amountsToSwap The amount of ERC20 token to swap into Toucan pool
     * token. Full amount will be used for offsetting.

     *
     * @return tco2s An array of the TCO2 addresses that were redeemed
     * @return amounts An array of the amounts of each TCO2 that were redeemed
     */
    function retireSpecificProjectInToken(
        address _fromToken,
        address _poolToken,
        address[] memory _tco2s,
        uint256[] memory _amountsToSwap
    ) public returns (address[] memory tco2s, uint256[] memory amounts) {
        amounts = _amountsToSwap;
        tco2s = _tco2s;

        // swap input token for BCT / NCT
        amounts[0] = swapExactInToken(_fromToken, _poolToken, amounts[0]);

        retireSpecificProject(_poolToken, _tco2s, amounts);
    }

    /**
     * @notice Retire carbon credits using the lowest quality (oldest) TCO2
     * tokens available from the specified Toucan token pool by sending ERC20
     * tokens (cUSD, USDC, WETH, WMATIC). All provided token is consumed for
     * offsetting.
     *
     * This function:
     * 1. Swaps the ERC20 token sent to the contract for the specified pool token.
     * 2. Redeems the pool token for the poorest quality TCO2 tokens available.
     * 3. Retires the TCO2 tokens.
     *
     * Note: The client must approve the ERC20 token that is sent to the contract.
     *
     * @dev When automatically redeeming pool tokens for the lowest quality
     * TCO2s there are no fees and you receive exactly 1 TCO2 token for 1 pool
     * token.
     * @param _poolToken The address of the Toucan pool token that the
     * user wants to use,  e.g., NCT or BCT
     * @param _tco2s The address of the TCO2 token that the wants to retire
     * @param _amounts The amount of ERC20 token to swap into Toucan pool
     * token. Full amount will be used for offsetting.

     *
     * @return tco2s An array of the TCO2 addresses that were redeemed
     * @return amounts An array of the amounts of each TCO2 that were redeemed
     */

    function retireSpecificProject(
        address _poolToken,
        address[] memory _tco2s,
        uint256[] memory _amounts
    ) public returns (address[] memory tco2s, uint256[] memory amounts) {
        // approve contract to redeem tokens
        IERC20(_poolToken).approve(address(this), _amounts[0]);

        // deposit pool token from user to this contract
        IERC20(_poolToken).safeTransferFrom(
            msg.sender,
            address(this),
            _amounts[0]
        );

        tco2s = _tco2s;
        amounts = _amounts;

        // redeem BCT / NCT for a sepcific TCO2
        (tco2s, amounts) = redeemProject(_poolToken, tco2s, amounts);

        // retire the TCO2s to achieve offset
        retire(tco2s, amounts);
    }

    /**
     * @notice Redeems the specified amount of NCT / BCT for TCO2.
     * @dev Needs to be approved on the client side.
     * @param _poolToken Could be the address of NCT or BCT
     * @param _amounts Amount to redeem
     * @param _tco2s Amount to redeem
     * @return tco2s An array of the amounts of each TCO2 that were redeemed
     * @return amounts An array of the amounts of each TCO2 that were redeemed
     */
    function redeemProject(
        address _poolToken,
        address[] memory _tco2s,
        uint256[] memory _amounts
    ) internal returns (address[] memory tco2s, uint256[] memory amounts) {
        require(
            IERC20(_poolToken).balanceOf(address(this)) >= _amounts[0],
            "Insufficient NCT/BCT balance"
        );

        // instantiate pool token (NCT or BCT)
        IToucanPoolToken PoolTokenImplementation = IToucanPoolToken(_poolToken);

        tco2s = _tco2s;
        amounts = _amounts;

        //  redeem pool token for TCO2 with that address; will transfer the TCO2 to this contract
        PoolTokenImplementation.redeemMany(tco2s, amounts);

        // the amount that we return needs to be the actuall amount of TCO2s that
        // is received after taking away the reddem fee
        amounts[0] =
            amounts[0] -
            PoolTokenImplementation.calculateRedeemFees(tco2s, amounts);
    }

    /**
     * @notice Retire the specified TCO2 tokens.
     * @param _tco2s The addresses of the TCO2s to retire
     * @param _amounts The amounts to retire from each of the corresponding
     * TCO2 addresses
     */
    function retire(
        address[] memory _tco2s,
        uint256[] memory _amounts
    ) internal {
        uint256 tco2sLen = _tco2s.length;
        require(tco2sLen != 0, "Array empty");

        require(tco2sLen == _amounts.length, "Arrays unequal");

        for (uint i = 0; i < tco2sLen; i++) {
            if (_amounts[i] == 0) {
                continue;
            }
            require(
                // we are subtrackting the
                IERC20(_tco2s[i]).balanceOf(address(this)) >= _amounts[i],
                "Insufficient TCO2 balance"
            );

            IToucanCarbonOffsets(_tco2s[i]).retire(_amounts[i]);
        }
    }
}
