import Head from 'next/head';
import { useContext } from 'react';
import React from "react";
import useBuyBack from '../components/hooks/useBuyBack';
import { Web3Context } from '../components/web3-context-provider';
import BN from 'bn.js';
import Web3 from 'web3';
import useOnClickLoadingButton from '../components/hooks/useOnClickLoadingButton';
import useBuybackActionButtons from '../components/hooks/useBuybackActionButtons';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import BuyBackTimer from '../components/buyback-timer';

const BuyBack: React.FC<{}> = () => {

    const { web3, account, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);

    const {
        isLoading,
        isInitialized,
        nextBuybackTimestamp,
        totalBuyBack,
        singleBuyBack,
        alreadyBoughtBack,
    } = useBuyBack();

    const { onBuybackClick } = useBuybackActionButtons(web3, isEthProviderAvailable, isNetworkSupported, account);

    const { isLoading: isbuybackLoading, onClickWithLoading: buybackOnClickWithLoading } = useOnClickLoadingButton(
        onBuybackClick
    );

    const totalBuyBackDisplay = Web3.utils.fromWei(totalBuyBack);
    const singleBuyBackDisplay = Web3.utils.fromWei(singleBuyBack);
    const buyBackRemaingAmount = totalBuyBack.sub(new BN(alreadyBoughtBack));
    const buyBackRemaingAmountDisplay = Web3.utils.fromWei(buyBackRemaingAmount);

    return (
        <>
            <Head>
                <title>RollerCoaster | Buyback - rollecoaster.finance</title>
            </Head>

            <div className="container-fluid">
                <div className="row">
                    <div className="container py-6">
                        <div className="row d-flex align-items-center">
                            <div className="col-12 col-md-6 order-md-2">
                                <img src="/buyback.png" className="img-fluid mw-md-150 mw-lg-130 mb-6 mb-md-0"></img>
                            </div>
                            <div className="col-12 col-md-6 order-md-1">
                                <h1 className="text-primary">Buy Back</h1>
                                <p className="lead text-center text-md-left text-muted my-4">
                                    Do you want to earn extra ETH in just few clicks? Trigger buyback proccess first and earn reward.
                                    User who will fist trigger buyback transaction will be rewarded 1% of total buyback amount.
                                </p>
                                {isLoading ? (
                                    <ComponentLoader color={ComponentLoaderColor.DARK} className="py-3" />
                                ) : (
                                        <>
                                            {!!isInitialized && buyBackRemaingAmount.gt(new BN(0)) && (
                                                <BuyBackTimer
                                                    isBuyBackLoading={isbuybackLoading}
                                                    isAccountSet={!!account}
                                                    buyBackOnClick={buybackOnClickWithLoading}
                                                    nextBuyBackTimestamp={nextBuybackTimestamp}
                                                />
                                            )}
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row py-6 bg-white">
                    <div className="container">
                        <div className="row">
                            <div className="row align-items-center text-center">
                                <div className="col-8 offset-2">
                                    <h1><span className="text-primary">How does it work?</span></h1>
                                    <br />
                                    <p className="lead text-center text-muted mb-5">
                                        A buyback, also known as a token repurchase, is when a project owners buys its own outstanding tokens to reduce the number of tokens available on the open market.
                                        Smart contract will buy back
                                        {
                                            isInitialized ? (
                                                <span> {totalBuyBackDisplay}</span>
                                            ) : (
                                                    <span> 40%</span>
                                                )
                                        } ETH worth of ROLL. Buyback will occure 3 times every 24h. Each time smart contarct will buy
                                        {
                                            isInitialized ? (
                                                <span> {singleBuyBackDisplay}</span>
                                            ) : (
                                                    <span> 1/3</span>
                                                )
                                        } ETH worth of ROLL.
                                    {
                                            !!isInitialized ? (
                                                <span> Buy back statistic is defined below.</span>
                                            ) : (
                                                    <span> Buy back statistic will be defined below.</span>
                                                )}
                                    </p>
                                </div>
                                {!!isInitialized && isNetworkSupported && isEthProviderAvailable && (
                                    <>
                                        <div className="col-3 offset-2 border-right">
                                            <h5>
                                                {buyBackRemaingAmountDisplay}
                                            </h5>
                                            <span className="lead text-muted">ETH to be bought back</span>
                                        </div>
                                        <div className="col-3 border-right">
                                            <h5>{totalBuyBackDisplay}</h5>
                                            <span className="lead text-muted">Total ETH</span>
                                        </div>
                                        <div className="col-3">
                                            <h5>{singleBuyBackDisplay}</h5>
                                            <span className="lead text-muted">ETH single amount</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyBack;