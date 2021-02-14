import { Farm, FarmToken } from '../../utils/enums';
import BN from 'bn.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import RollerCoasterFarmAbi from '../../contracts/RollerCoasterFarmAbi';
import IERC20Abi from '../../contracts/IERC20Abi';
import Web3 from 'web3';
import { getTokenInEthPrice, getUniswapLPTokenInEthPrice } from '../../utils/uniswap';
import { Contract } from 'web3-eth-contract';

export interface IUserFarmData {
    isLoading: boolean;
    hasApproved: boolean;
    stakedAmount: BN;
    totalStakedAmount: BN;
    availableAmountForStaking: BN;
    harvestableReward: BN;
    claimableHarvestedReward: BN;
    totalHarvestedReward: BN;
    apyPercent: number;
    isApyLoading: boolean;
}

export interface IFarmData {
    isLoading: boolean;
    farmContract: Contract | null;
    farmTokenContract: Contract | null;
    hasFarmingStarted: boolean;
    totalRollSupply: BN;
    dailyRollReward: BN;
    nextHalvingTimestamp: number;
    farmToken: FarmToken;
    userData: IUserFarmData;
}

const defaultFarmData: IFarmData = {
    isLoading: true,
    farmContract: null,
    farmTokenContract: null,
    hasFarmingStarted: false,
    totalRollSupply: new BN(0),
    dailyRollReward: new BN(0),
    nextHalvingTimestamp: 0,
    farmToken: FarmToken.ROLL,
    userData: {
        isLoading: true,
        hasApproved: false,
        availableAmountForStaking: new BN(0),
        stakedAmount: new BN(0),
        totalStakedAmount: new BN(0),
        harvestableReward: new BN(0),
        claimableHarvestedReward: new BN(0),
        totalHarvestedReward: new BN(0),
        apyPercent: 0,
        isApyLoading: false,
    },
};

export const getFarmContractAddress = (farm: Farm) => {
    let farmAddress: string | undefined;
    switch (farm) {
        case Farm.ROLL:
            farmAddress = process.env.NEXT_PUBLIC_ROLL_FARM_CONTRACT_ADDRESS;
            break;

        case Farm.ROLL_ETH:
            farmAddress = process.env.NEXT_PUBLIC_ROLL_ETH_FARM_CONTRACT_ADDRESS;
            break;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }

    if (!farmAddress) {
        throw new Error(`Environment variable for ${farm} farm address is not defined.`);
    }

    return farmAddress;
};

const getFarmToken = (farm: Farm) => {
    switch (farm) {
        case Farm.ROLL:
            return FarmToken.ROLL;

        case Farm.ROLL_ETH:
            return FarmToken.ROLL_ETH;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const getApyCommonUnitMultiplier = async (web3: Web3, farm: Farm, farmTokenAddress: string) => {
    const rollTokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
    if (!rollTokenAddress) {
        throw new Error('$ROLL token address environment variable is not defined.');
    }

    switch (farm) {
        case Farm.ROLL:
            return 1;

        case Farm.ROLL_ETH:
            const rollInEthForUpEthComparison = await getTokenInEthPrice(rollTokenAddress);
            const rollEthInEth = await getUniswapLPTokenInEthPrice(web3, farmTokenAddress);
            return rollInEthForUpEthComparison / rollEthInEth;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const getMaxApy = (farm: Farm) => {
    switch (farm) {
        case Farm.ROLL:
            return 60000;

        case Farm.ROLL_ETH:
            return 120000;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const getApyPercent = async (web3: Web3, farm: Farm, farmTokenAddress: string, dailyRollReward: BN, totalStake: BN) => {
    const maxApy = getMaxApy(farm);
    if (Number(Web3.utils.fromWei(totalStake)) <= 0) {
        return maxApy;
    }
    try {
        const apyCommonUnitMultiplier = await getApyCommonUnitMultiplier(web3, farm, farmTokenAddress);
        const apyPercent =
            (Number(Web3.utils.fromWei(dailyRollReward)) * 365 * 100 * apyCommonUnitMultiplier) /
            Number(Web3.utils.fromWei(totalStake));
        return Math.min(apyPercent, maxApy);
    } catch (e) {
        console.log('Error occured while calculation APY %!!!', e);
        return maxApy;
    }
};

const useFarm = (activeFarm: Farm) => {
    const [farmData, setFarmData] = useState<IFarmData>(defaultFarmData);
    const {
        isLoading: isFarmDataLoading,
        farmContract,
        farmTokenContract,
        hasFarmingStarted,
        dailyRollReward: dailyRollReward,
        userData,
    } = farmData;
    const { isLoading: isUserDataLoading, totalStakedAmount } = userData;
    const updateFarmData = useCallback(
        (updatedFarmData: Partial<IFarmData>) =>
            setFarmData((currentFarmData) => ({ ...currentFarmData, ...updatedFarmData })),
        [setFarmData]
    );
    const updateUserData = useCallback(
        (updatedUserData: Partial<IUserFarmData>) =>
            setFarmData((currentFarmData) => ({
                ...currentFarmData,
                userData: { ...currentFarmData.userData, ...updatedUserData },
            })),
        [setFarmData]
    );

    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const shouldSetFarmData = !isWeb3ContextLoading && isEthProviderAvailable && isNetworkSupported;

    // set farm data on farm switch
    useEffect(() => {
        const farmToken = getFarmToken(activeFarm);

        if (!shouldSetFarmData) {
            updateFarmData({ isLoading: false, farmToken, farmContract: null, farmTokenContract: null });
            return;
        }

        updateFarmData({ isLoading: true, farmToken });

        (async () => {
            const farmContractAddress = getFarmContractAddress(activeFarm);
            const farmContract = new web3.eth.Contract(RollerCoasterFarmAbi, farmContractAddress);
            const farmTokenAddress = (await farmContract.methods.farmTokenAddress().call()) as string;
            const farmTokenContract = new web3.eth.Contract(IERC20Abi, farmTokenAddress);
            const hasFarmingStarted = (await farmContract.methods.farmingActive().call()) as boolean;

            if (!hasFarmingStarted) {
                updateFarmData({ isLoading: false, farmContract, farmTokenContract, hasFarmingStarted });
                return;
            }
            const totalRollSupply = Web3.utils.toBN(await farmContract.methods.totalRewardSupply().call());
            const currentIntervalTotalReward = Web3.utils.toBN(await farmContract.methods.intervalReward().call());
            const rewardIntervalLengthInDays = Web3.utils.toBN(
                (await farmContract.methods.rewardIntervalLength().call()) / (60 * 60 * 24)
            );
            const dailyRollReward = currentIntervalTotalReward.div(rewardIntervalLengthInDays);

            const nextHalvingTimestamp = Number(await farmContract.methods.nextIntervalTimestamp().call());
            updateFarmData({
                isLoading: false,
                hasFarmingStarted,
                farmContract,
                farmTokenContract,
                totalRollSupply,
                dailyRollReward,
                nextHalvingTimestamp,
            });
        })();
    }, [shouldSetFarmData, web3, activeFarm, updateFarmData]);

    const refreshFarmData = useCallback(
        async (showLoading: boolean) => {
            if (!farmContract || !farmTokenContract || !hasFarmingStarted) {
                return;
            }

            updateUserData({ isLoading: showLoading });

            const hasApproved = !!account
                ? Web3.utils
                      .toBN(await farmTokenContract.methods.allowance(account, farmContract.options.address).call())
                      .gt(new BN(0))
                : false;

            const availableAmountForStaking = !!account
                ? Web3.utils.toBN(await farmTokenContract.methods.balanceOf(account).call())
                : new BN(0);

            const stakedAmount = !!account
                ? Web3.utils.toBN(await farmContract.methods.singleStaked(account).call())
                : new BN(0);

            const totalStakedAmount = Web3.utils.toBN(await farmContract.methods.totalStaked().call());

            const harvestableReward = !!account
                ? Web3.utils.toBN(await farmContract.methods.harvestable(account).call())
                : new BN(0);

            const claimableHarvestedReward = !!account
                ? Web3.utils.toBN(await farmContract.methods.claimable(account).call())
                : new BN(0);

            const totalHarvestedReward = !!account
                ? Web3.utils.toBN(await farmContract.methods.harvested(account).call())
                : new BN(0);

            updateUserData({
                isLoading: false,
                hasApproved,
                availableAmountForStaking,
                stakedAmount,
                totalStakedAmount,
                harvestableReward,
                claimableHarvestedReward,
                totalHarvestedReward,
            });
        },
        [farmContract, farmTokenContract, hasFarmingStarted, account, updateUserData]
    );

    // harvestable reward refresh
    useEffect(() => {
        if (!hasFarmingStarted || !farmContract || !account) {
            return;
        }

        const intervalId = setInterval(() => {
            (async () => {
                const harvestableReward = Web3.utils.toBN(await farmContract.methods.harvestable(account).call());
                updateUserData({ harvestableReward });
            })();
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, [farmContract, hasFarmingStarted, account, updateUserData]);

    // whenever refresh farm data function updates, we need to call it to get the most recent data
    useEffect(() => {
        refreshFarmData(true);
    }, [refreshFarmData]);

    // apy refresh
    useEffect(() => {
        updateUserData({ isApyLoading: true });
        if (isWeb3ContextLoading || !farmTokenContract || isFarmDataLoading || isUserDataLoading) {
            return;
        }
        (async () => {
            const apyPercent = await getApyPercent(
                web3,
                activeFarm,
                farmTokenContract.options.address,
                dailyRollReward,
                totalStakedAmount
            );
            updateUserData({ isApyLoading: false, apyPercent });
        })();
    }, [
        web3,
        farmTokenContract,
        isFarmDataLoading,
        isUserDataLoading,
        isWeb3ContextLoading,
        activeFarm,
        dailyRollReward,
        totalStakedAmount,
        updateUserData,
    ]);

    return { farmData, refreshFarmData };
};

export default useFarm;
