import Head from 'next/head';
import { useContext, useState } from 'react';
import { Farm as FarmType } from '../utils/enums';
import { formatDisplayNumber } from '../utils/numbers';
import Card from '../components/card';
import Alert, { AlertType } from '../components/alert';
import useFarm from '../components/hooks/useFarm';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import Web3 from 'web3';
import { format as formatDate, fromUnixTime } from 'date-fns';
import { getEtherScanUrl } from '../utils/urls';
import FarmActionLink from '../components/farm-action-link';
import ActionButton from '../components/action-button';
import useOnClickLoadingButton from '../components/hooks/useOnClickLoadingButton';
import useFarmActionButtons from '../components/hooks/useFarmActionButtons';
import { Web3Context } from '../components/web3-context-provider';
import BN from 'bn.js';
import FarmSelection from '../components/farm-selection';

export enum FarmActionSection {
    APPROVE = 'approve',
    BUY = 'buy',
    STAKE = 'stake',
    WITHDRAW = 'withdraw',
    HARVEST = 'harvest',
    CLAIM = 'claim',
}

const getBuyFarmTokensLink = (farm: FarmType, farmTokenAddress: string) => {
    switch (farm) {
        case FarmType.ROLL:
            return `https://app.uniswap.org/#/swap?outputCurrency=${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}`;

        case FarmType.ROLL_ETH:
            return `https://app.uniswap.org/#/add/ETH/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}`;

        default:
            throw new Error(`Farm of type '${farm}' is not supported.`);
    }
};

const farmTokenValueDisplayer = (farm: FarmType, amount: BN) => {
    return Web3.utils.fromWei(amount);
};

const Farm: React.FC<{}> = () => {
    const { account } = useContext(Web3Context);
    const [activeFarm, setActiveFarm] = useState<FarmType>(FarmType.ROLL);
    const { farmData, refreshFarmData } = useFarm(activeFarm);
    const {
        isLoading,
        farmToken,
        farmContract,
        farmTokenContract,
        hasFarmingStarted,
        totalRollSupply,
        dailyRollReward,
        nextHalvingTimestamp,
        userData,
    } = farmData;
    const {
        hasApproved,
        apyPercent,
        availableAmountForStaking,
        isApyLoading,
        stakedAmount,
        totalHarvestedReward,
        totalStakedAmount,
        claimableHarvestedReward,
        harvestableReward,
        isLoading: isAccountDataLoading,
    } = userData;

    const isDataValid = !isLoading && !!farmContract && !!farmTokenContract;
    const farmAddress = !!farmContract ? farmContract.options.address : '';
    const farmTokenAddress = !!farmTokenContract ? farmTokenContract.options.address : '';
    const isAccountConnected = !!account;
    const totalRollSupplyDisplay = formatDisplayNumber(Web3.utils.fromWei(totalRollSupply));
    const dailyRollRewardDisplay = formatDisplayNumber(Web3.utils.fromWei(dailyRollReward));
    const nextHalvingFormattedDate =
        nextHalvingTimestamp > 0 ? formatDate(fromUnixTime(nextHalvingTimestamp), 'MM/dd/yyyy') : '';
    const nextHalvingFormattedTime =
        nextHalvingTimestamp > 0 ? formatDate(fromUnixTime(nextHalvingTimestamp), 'HH:mm:ss') : '';
    const yourStakeDisplay = formatDisplayNumber(farmTokenValueDisplayer(activeFarm, stakedAmount));
    const totalStakeDisplay = formatDisplayNumber(farmTokenValueDisplayer(activeFarm, totalStakedAmount));
    const totalStakeNumber = Number(totalStakeDisplay);
    const yourStakeNumber = Number(yourStakeDisplay);
    const yourStakePercent = totalStakeNumber > 0 ? (yourStakeNumber * 100) / totalStakeNumber : 0;
    const yourDailyRollReward = dailyRollReward
        .mul(Web3.utils.toBN(Math.floor(yourStakePercent)))
        .div(Web3.utils.toBN(100));
    const yourDailyRollRewardDisplay = formatDisplayNumber(Web3.utils.fromWei(yourDailyRollReward));
    const harvestableRewardDisplay = formatDisplayNumber(Web3.utils.fromWei(harvestableReward));

    const claimableHarvestedRewardDisplay = formatDisplayNumber(Web3.utils.fromWei(claimableHarvestedReward));
    const totalHarvestedRewardDisplay = formatDisplayNumber(Web3.utils.fromWei(totalHarvestedReward));

    const availableAmountForStakingDisplay = formatDisplayNumber(
        farmTokenValueDisplayer(activeFarm, availableAmountForStaking)
    );

    const apyPercentDisplay = Math.round(apyPercent);

    const [actionSection, setActionSection] = useState<FarmActionSection>(FarmActionSection.APPROVE);

    const {
        onApproveClick,
        onStakeClick,
        onStakeAllClick,
        onWithdrawClick,
        onWithdrawAllClick,
        onHarvestClick,
        onClaimClick,
    } = useFarmActionButtons(farmContract, farmTokenContract, account, refreshFarmData);

    const { isLoading: isApproveLoading, onClickWithLoading: approveOnClickWithLoading } = useOnClickLoadingButton(
        onApproveClick
    );
    const [inputStakeAmount, setInputStakeAmount] = useState('');
    const isStakeDisabled = !hasApproved || availableAmountForStaking.isZero();
    const { isLoading: isStakeLoading, onClickWithLoading: stakeOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            const inputStakeAmountAsNumber = Number(inputStakeAmount);
            if (isNaN(inputStakeAmountAsNumber)) {
                alert('Please input a valid number.');
                return;
            }
            const inputStakeAmountAsBN = new BN(Web3.utils.toWei(inputStakeAmount));
            if (inputStakeAmountAsBN.lte(new BN(0)) || inputStakeAmountAsBN.gt(availableAmountForStaking)) {
                alert('Please input a valid number.');
                return;
            }
            await onStakeClick(inputStakeAmountAsBN);
            setInputStakeAmount('');
        }
    );
    const { isLoading: isStakeAllLoading, onClickWithLoading: stakeAllOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            await onStakeAllClick();
            setInputStakeAmount('');
        }
    );
    const areStakeInputsDisabled = isStakeDisabled || isStakeLoading || isStakeAllLoading;
    const [inputWithdrawAmount, setInputWithdrawAmount] = useState('');
    const isWithdrawDisabled = stakedAmount.isZero();
    const { isLoading: isWithdrawLoading, onClickWithLoading: withdrawOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            const inputWithdrawAmountAsNumber = Number(inputWithdrawAmount);
            if (isNaN(inputWithdrawAmountAsNumber)) {
                alert('Please input a valid number.');
                return;
            }
            const inputWithdrawAmountAsBN = new BN(Web3.utils.toWei(inputWithdrawAmount));
            if (inputWithdrawAmountAsBN.lte(new BN(0)) || inputWithdrawAmountAsBN.gt(stakedAmount)) {
                alert('Please input a valid number.');
                return;
            }
            await onWithdrawClick(inputWithdrawAmountAsBN);
            setInputWithdrawAmount('');
        }
    );
    const {
        isLoading: isWithdrawAllLoading,
        onClickWithLoading: withdrawAllOnClickWithLoading,
    } = useOnClickLoadingButton(async () => {
        await onWithdrawAllClick();
        setInputWithdrawAmount('');
    });
    const areWithdrawInputsDisabled = isWithdrawDisabled || isWithdrawLoading || isWithdrawAllLoading;

    const isHarvestDisabled = harvestableReward.isZero();
    const { isLoading: isHarvestLoading, onClickWithLoading: harvestOnClickWithLoading } = useOnClickLoadingButton(
        async () => {
            await onHarvestClick();
        }
    );
    const isClaimDisabled = claimableHarvestedReward.isZero();
    const { isLoading: isClaimLoading, onClickWithLoading: claimOnClickWithLoading } = useOnClickLoadingButton(
        onClaimClick
    );

    return (
        <>
            <Head>
                <title>Rollercoaster | Farm - rolerrcoaster.finance</title>
            </Head>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 py-4">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2">
                                    <FarmSelection
                                        isLoading={isLoading}
                                        activeFarm={activeFarm}
                                        setActiveFarm={setActiveFarm}
                                    />
                                </div>
                            </div>

                            <div className="row align-items-center py-6">
                                <div className="col-lg-7">
                                    <h1 className="text-primary">Farming</h1>
                                    <br />

                                    <p className="lead text-muted mb-4">
                                        Every pool is allocated a certain amount of ROLL tokens immediately after the
                                        presale ends. Every 10 days reward reduction occurs. Reward reduction formula:
                                        <br />
                                        new reward supply = current reward supply - interval reward;
                                        <br />
                                        new interval reward = 0.2 * new reward supply.
                                        <br />
                                        new daily reward = new interval reward / 10;
                                        <br />
                                        Rewards are distributed among the pool contributors. Initial ROLL tokens supply
                                        per pool is defined below.
                                        {!isLoading && isDataValid && (
                                            <span>
                                                {' '}
                                                You can find farm address on &nbsp;
                                                <a
                                                    href={getEtherScanUrl(`address/${farmAddress}`)}
                                                    className="text-primary font-weight-bold"
                                                    target="_blank"
                                                >
                                                    etherscan
                                                </a>
                                            </span>
                                        )}
                                    </p>
                                    {hasFarmingStarted && (
                                        <div className="row">
                                            <div className="col-3 border-right text-center">
                                                {!isLoading ? (
                                                    <>
                                                        {isDataValid ? (
                                                            <h5>
                                                                {totalRollSupplyDisplay}
                                                                <br />
                                                                ROLL
                                                            </h5>
                                                        ) : (
                                                            <Alert type={AlertType.WARNING}>Data unavailable.</Alert>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ComponentLoader color={ComponentLoaderColor.DARK} />
                                                )}
                                                <span className="lead text-muted">Farm supply</span>
                                            </div>
                                            <div className="col-3 text-center border-right">
                                                {!isLoading ? (
                                                    <>
                                                        {isDataValid ? (
                                                            <h5>
                                                                {dailyRollRewardDisplay}
                                                                <br />
                                                                ROLL
                                                            </h5>
                                                        ) : (
                                                            <Alert type={AlertType.WARNING}>Data unavailable.</Alert>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ComponentLoader color={ComponentLoaderColor.DARK} />
                                                )}
                                                <span className="lead text-muted">Daily reward</span>
                                            </div>
                                            <div className="col-3 text-center border-right">
                                                {!isLoading ? (
                                                    <>
                                                        {isDataValid ? (
                                                            <h5>
                                                                {apyPercentDisplay}
                                                                <br />%
                                                            </h5>
                                                        ) : (
                                                            <Alert type={AlertType.WARNING}>Data unavailable.</Alert>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ComponentLoader color={ComponentLoaderColor.DARK} />
                                                )}
                                                <span className="lead text-muted">APY</span>
                                            </div>
                                            <div className="col-3 text-center">
                                                {!isLoading ? (
                                                    <>
                                                        {isDataValid ? (
                                                            <h5>
                                                                {nextHalvingFormattedDate}
                                                                <br />
                                                                {nextHalvingFormattedTime}
                                                            </h5>
                                                        ) : (
                                                            <Alert type={AlertType.WARNING}>Data unavailable.</Alert>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ComponentLoader color={ComponentLoaderColor.DARK} />
                                                )}
                                                <span className="lead text-muted">Next Halving</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-5 d-none d-lg-block">
                                    <img src="/farm.png" className="img-fluid mw-md-150 mw-lg-130 mb-6 mb-md-0"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isLoading ? (
                    <>
                        {isDataValid ? (
                            <>
                                {hasFarmingStarted ? (
                                    <>
                                        <div className="row bg-white py-5">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-lg-6 mb-3">
                                                        <div className="card border-left shadow h-100 py-2">
                                                            <div className="card-body">
                                                                <div className="row no-gutters align-items-center">
                                                                    <div className="col mr-2">
                                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                            Your / total staked
                                                                        </div>
                                                                        {!isAccountConnected ? (
                                                                            <div className="mb-0 text-xs">
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    Connect your wallet to see your
                                                                                    staked amout.
                                                                                </Alert>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="h5 mb-0 text-muted">
                                                                                {yourStakeDisplay} {farmToken} /{' '}
                                                                                {totalStakeDisplay} {farmToken} {' ('}
                                                                                {Math.floor(yourStakePercent)}
                                                                                {'%)'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <i className="fas fa-calendar fa-2x text-muted"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <div className="card border-left shadow h-100 py-2">
                                                            <div className="card-body">
                                                                <div className="row no-gutters align-items-center">
                                                                    <div className="col mr-2">
                                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                            Your daily reward
                                                                        </div>
                                                                        {!isAccountConnected ? (
                                                                            <div className="mb-0 text-xs">
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    Connect your wallet to see your
                                                                                    daily reward.
                                                                                </Alert>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="h5 mb-0 text-muted">
                                                                                {yourDailyRollRewardDisplay} ROLL
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <i className="fas fa-calendar fa-2x text-muted"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <div className="card border-left shadow h-100 py-2">
                                                            <div className="card-body">
                                                                <div className="row no-gutters align-items-center">
                                                                    <div className="col mr-2">
                                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                            Harvestable Reward
                                                                        </div>
                                                                        {!isAccountConnected ? (
                                                                            <div className="mb-0 text-xs">
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    Connect your wallet to see your
                                                                                    harvestable reward.
                                                                                </Alert>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="h5 mb-0 text-muted">
                                                                                {harvestableRewardDisplay} ROLL
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <i className="fas fa-calendar fa-2x text-muted"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 mb-lg-3">
                                                        <div className="card border-left shadow h-100 py-2">
                                                            <div className="card-body">
                                                                <div className="row no-gutters align-items-center">
                                                                    <div className="col mr-2">
                                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                            Claimable / total harvested reward
                                                                        </div>
                                                                        {!isAccountConnected ? (
                                                                            <div className="mb-0 text-xs">
                                                                                <Alert type={AlertType.WARNING}>
                                                                                    Connect your wallet to see your
                                                                                    claimable reward.
                                                                                </Alert>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="h5 mb-0 text-muted">
                                                                                {claimableHarvestedRewardDisplay} /{' '}
                                                                                {totalHarvestedRewardDisplay} ROLL
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <i className="fas fa-calendar fa-2x text-muted"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row py-5">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col">
                                                        <Card titleIconClassName="fas fa-cogs" titleText="Actions">
                                                            <div className="row">
                                                                <div className="col-12 mb-4 col-sm-4 mb-sm-0 col-md-3 mt-sm-5">
                                                                    <ul className="list-group">
                                                                        <FarmActionLink
                                                                            section={FarmActionSection.APPROVE}
                                                                            activeSection={actionSection}
                                                                            onClick={setActionSection}
                                                                        >
                                                                            Approve
                                                                        </FarmActionLink>
                                                                        <FarmActionLink
                                                                            section={FarmActionSection.BUY}
                                                                            activeSection={actionSection}
                                                                            onClick={setActionSection}
                                                                        >
                                                                            Buy
                                                                        </FarmActionLink>
                                                                        <FarmActionLink
                                                                            section={FarmActionSection.STAKE}
                                                                            activeSection={actionSection}
                                                                            onClick={setActionSection}
                                                                        >
                                                                            Stake
                                                                        </FarmActionLink>
                                                                        <FarmActionLink
                                                                            section={FarmActionSection.WITHDRAW}
                                                                            activeSection={actionSection}
                                                                            onClick={setActionSection}
                                                                        >
                                                                            Withdraw
                                                                        </FarmActionLink>
                                                                        <FarmActionLink
                                                                            section={FarmActionSection.HARVEST}
                                                                            activeSection={actionSection}
                                                                            onClick={setActionSection}
                                                                        >
                                                                            Harvest
                                                                        </FarmActionLink>
                                                                        <FarmActionLink
                                                                            section={FarmActionSection.CLAIM}
                                                                            activeSection={actionSection}
                                                                            onClick={setActionSection}
                                                                        >
                                                                            Claim
                                                                        </FarmActionLink>
                                                                    </ul>
                                                                </div>
                                                                <div className="col-12 col-sm-8 col-md-9">
                                                                    {!isAccountDataLoading ? (
                                                                        isAccountConnected ? (
                                                                            <>
                                                                                {actionSection ===
                                                                                    FarmActionSection.APPROVE && (
                                                                                    <>
                                                                                        <h3>Approve</h3>
                                                                                        <hr />
                                                                                        <p className="lead text-muted">
                                                                                            In order for our farm smart
                                                                                            contract to transfer your
                                                                                            funds in and out of the
                                                                                            farm, you need to make an
                                                                                            approval first by clicking
                                                                                            on the button below.
                                                                                        </p>

                                                                                        {hasApproved && (
                                                                                            <Alert
                                                                                                type={AlertType.SUCCESS}
                                                                                            >
                                                                                                You approved
                                                                                                successfully.
                                                                                            </Alert>
                                                                                        )}

                                                                                        <ActionButton
                                                                                            isLoading={isApproveLoading}
                                                                                            onClick={
                                                                                                approveOnClickWithLoading
                                                                                            }
                                                                                            isDisabled={hasApproved}
                                                                                        >
                                                                                            Approve
                                                                                        </ActionButton>
                                                                                    </>
                                                                                )}
                                                                                {actionSection ===
                                                                                    FarmActionSection.BUY && (
                                                                                    <>
                                                                                        <h3>Buy</h3>
                                                                                        <hr />
                                                                                        <p className="lead text-muted">
                                                                                            In order to buy farm tokens
                                                                                            click on the button below.
                                                                                        </p>
                                                                                        <a
                                                                                            href={getBuyFarmTokensLink(
                                                                                                activeFarm,
                                                                                                farmTokenAddress
                                                                                            )}
                                                                                            className="btn btn-outline-primary font-weight-bold text-uppercase"
                                                                                            target="_blank"
                                                                                        >
                                                                                            Buy farm tokens
                                                                                        </a>
                                                                                    </>
                                                                                )}
                                                                                {actionSection ===
                                                                                    FarmActionSection.STAKE && (
                                                                                    <>
                                                                                        <h3>Stake</h3>
                                                                                        <hr />
                                                                                        <p className="lead text-muted">
                                                                                            Input the amount of tokens
                                                                                            you want to stake. Input
                                                                                            amount must be bigger than
                                                                                            zero and equal or less than
                                                                                            your available balance.
                                                                                        </p>

                                                                                        {!hasApproved && (
                                                                                            <Alert
                                                                                                type={AlertType.WARNING}
                                                                                            >
                                                                                                You need to approve
                                                                                                before staking.
                                                                                            </Alert>
                                                                                        )}

                                                                                        {availableAmountForStaking.isZero() && (
                                                                                            <Alert
                                                                                                type={AlertType.WARNING}
                                                                                            >
                                                                                                You have no available
                                                                                                funds for staking.
                                                                                            </Alert>
                                                                                        )}

                                                                                        <div className="form-group">
                                                                                            <label className="mb-0 font-weight-bold">
                                                                                                Available for staking
                                                                                            </label>
                                                                                            <span className="d-block">
                                                                                                {
                                                                                                    availableAmountForStakingDisplay
                                                                                                }{' '}
                                                                                                {farmToken}
                                                                                            </span>
                                                                                        </div>

                                                                                        <div className="form-group">
                                                                                            <form
                                                                                                className="form-inline"
                                                                                                onSubmit={(e) => {
                                                                                                    e.preventDefault();
                                                                                                    stakeOnClickWithLoading();
                                                                                                }}
                                                                                            >
                                                                                                <div className="input-group">
                                                                                                    <input
                                                                                                        disabled={
                                                                                                            areStakeInputsDisabled
                                                                                                        }
                                                                                                        type="number"
                                                                                                        className="form-control"
                                                                                                        placeholder="amount to stake"
                                                                                                        aria-label="amount to stake"
                                                                                                        onChange={(e) =>
                                                                                                            setInputStakeAmount(
                                                                                                                e.target
                                                                                                                    .value
                                                                                                            )
                                                                                                        }
                                                                                                        value={
                                                                                                            inputStakeAmount
                                                                                                        }
                                                                                                    />
                                                                                                    <div className="input-group-append">
                                                                                                        <ActionButton
                                                                                                            isLoading={
                                                                                                                isStakeLoading
                                                                                                            }
                                                                                                            isDisabled={
                                                                                                                areStakeInputsDisabled
                                                                                                            }
                                                                                                            type="submit"
                                                                                                        >
                                                                                                            Stake
                                                                                                        </ActionButton>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="d-block w-100 d-md-none" />

                                                                                                <ActionButton
                                                                                                    isLoading={
                                                                                                        isStakeAllLoading
                                                                                                    }
                                                                                                    isDisabled={
                                                                                                        areStakeInputsDisabled
                                                                                                    }
                                                                                                    className="mt-3 mt-md-0 ml-md-3"
                                                                                                    onClick={
                                                                                                        stakeAllOnClickWithLoading
                                                                                                    }
                                                                                                >
                                                                                                    Stake all
                                                                                                </ActionButton>
                                                                                            </form>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                                {actionSection ===
                                                                                    FarmActionSection.WITHDRAW && (
                                                                                    <>
                                                                                        <h3>Withdrawal</h3>
                                                                                        <hr />
                                                                                        <p className="lead text-muted">
                                                                                            Input the amount of tokens
                                                                                            you want to withdraw. Input
                                                                                            amount must be bigger than
                                                                                            zero and equal or less than
                                                                                            your staked balance.
                                                                                        </p>

                                                                                        {stakedAmount.isZero() && (
                                                                                            <Alert
                                                                                                type={AlertType.WARNING}
                                                                                            >
                                                                                                You have no available
                                                                                                funds for withdrawal.
                                                                                            </Alert>
                                                                                        )}

                                                                                        <div className="form-group">
                                                                                            <label className="mb-0 font-weight-bold">
                                                                                                Staked amount
                                                                                            </label>
                                                                                            <span className="d-block">
                                                                                                {yourStakeDisplay}{' '}
                                                                                                {farmToken}
                                                                                            </span>
                                                                                        </div>

                                                                                        <div className="form-group">
                                                                                            <form
                                                                                                className="form-inline"
                                                                                                onSubmit={(e) => {
                                                                                                    e.preventDefault();
                                                                                                    withdrawOnClickWithLoading();
                                                                                                }}
                                                                                            >
                                                                                                <div className="input-group">
                                                                                                    <input
                                                                                                        disabled={
                                                                                                            areWithdrawInputsDisabled
                                                                                                        }
                                                                                                        type="number"
                                                                                                        className="form-control"
                                                                                                        placeholder="amount to withdraw"
                                                                                                        aria-label="amount to withdraw"
                                                                                                        onChange={(e) =>
                                                                                                            setInputWithdrawAmount(
                                                                                                                e.target
                                                                                                                    .value
                                                                                                            )
                                                                                                        }
                                                                                                        value={
                                                                                                            inputWithdrawAmount
                                                                                                        }
                                                                                                    />
                                                                                                    <div className="input-group-append">
                                                                                                        <ActionButton
                                                                                                            isLoading={
                                                                                                                isWithdrawLoading
                                                                                                            }
                                                                                                            isDisabled={
                                                                                                                areWithdrawInputsDisabled
                                                                                                            }
                                                                                                            type="submit"
                                                                                                        >
                                                                                                            Withdraw
                                                                                                        </ActionButton>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="d-block w-100 d-lg-none" />

                                                                                                <ActionButton
                                                                                                    isLoading={
                                                                                                        isWithdrawAllLoading
                                                                                                    }
                                                                                                    isDisabled={
                                                                                                        areWithdrawInputsDisabled
                                                                                                    }
                                                                                                    className="mt-3 mt-lg-0 ml-lg-3"
                                                                                                    onClick={
                                                                                                        withdrawAllOnClickWithLoading
                                                                                                    }
                                                                                                >
                                                                                                    Withdraw all
                                                                                                </ActionButton>
                                                                                            </form>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                                {actionSection ===
                                                                                    FarmActionSection.HARVEST && (
                                                                                    <>
                                                                                        <h3>Harvest</h3>
                                                                                        <hr />
                                                                                        <p className="lead text-muted">
                                                                                            To harvest the reward and
                                                                                            later on be able to claim
                                                                                            it, click on the button
                                                                                            below.
                                                                                        </p>
                                                                                        <div className="form-group">
                                                                                            <label className="mb-0 font-weight-bold">
                                                                                                Harvestable reward
                                                                                            </label>
                                                                                            <span className="d-block">
                                                                                                {
                                                                                                    harvestableRewardDisplay
                                                                                                }{' '}
                                                                                                ROLL
                                                                                            </span>
                                                                                        </div>

                                                                                        <ActionButton
                                                                                            isLoading={isHarvestLoading}
                                                                                            onClick={
                                                                                                harvestOnClickWithLoading
                                                                                            }
                                                                                            isDisabled={
                                                                                                isHarvestDisabled
                                                                                            }
                                                                                        >
                                                                                            Harvest
                                                                                        </ActionButton>
                                                                                    </>
                                                                                )}
                                                                                {actionSection ===
                                                                                    FarmActionSection.CLAIM && (
                                                                                    <>
                                                                                        <h3>Claim</h3>
                                                                                        <hr />
                                                                                        <p className="lead text-muted">
                                                                                            Once the reward is
                                                                                            harvested, you will be able
                                                                                            to claim it in parts. Every
                                                                                            day 10% of the harvested
                                                                                            reward will be released for
                                                                                            claiming. After one day 10%
                                                                                            is claimable, after two days
                                                                                            20% is claimable, and so
                                                                                            on...
                                                                                        </p>

                                                                                        <div className="form-group">
                                                                                            <label className="mb-0 font-weight-bold">
                                                                                                Claimable / total
                                                                                                harvested reward
                                                                                            </label>
                                                                                            <span className="d-block">
                                                                                                {
                                                                                                    claimableHarvestedRewardDisplay
                                                                                                }{' '}
                                                                                                /{' '}
                                                                                                {
                                                                                                    totalHarvestedRewardDisplay
                                                                                                }{' '}
                                                                                                ROLL
                                                                                            </span>
                                                                                        </div>

                                                                                        <ActionButton
                                                                                            isLoading={isClaimLoading}
                                                                                            onClick={
                                                                                                claimOnClickWithLoading
                                                                                            }
                                                                                            isDisabled={isClaimDisabled}
                                                                                        >
                                                                                            Claim
                                                                                        </ActionButton>
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <Alert type={AlertType.WARNING}>
                                                                                Connect your account to start farming!
                                                                            </Alert>
                                                                        )
                                                                    ) : (
                                                                        <ComponentLoader
                                                                            color={ComponentLoaderColor.DARK}
                                                                            className="py-3"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="container">
                                        <Alert type={AlertType.WARNING}>Farming has not started yet.</Alert>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="container">
                                <Alert type={AlertType.WARNING}>Contract data is unavailable.</Alert>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-6">
                        <ComponentLoader color={ComponentLoaderColor.DARK} className="mt-6" />
                    </div>
                )}
            </div>
        </>
    );
};

export default Farm;
