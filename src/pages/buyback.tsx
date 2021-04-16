import Head from 'next/head';
import { useContext } from 'react';
import React from 'react';
import useBuyBack from '../components/hooks/useBuyBack';
import { Web3Context } from '../components/web3-context-provider';
import BN from 'bn.js';
import Web3 from 'web3';
import useOnClickLoadingButton from '../components/hooks/useOnClickLoadingButton';
import useBuybackActionButtons from '../components/hooks/useBuybackActionButtons';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import BuyBackTimer from '../components/buyback-timer';
import { formatDisplayNumber } from '../utils/numbers';
import Alert, { AlertType } from '../components/alert';

const BuyBack: React.FC<{}> = () => {
    const { web3, account, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);

    const {
        isLoading,
        isInitialized,
        nextBuybackTimestamp,
        totalBuyBack,
        singleBuyBack,
        alreadyBoughtBack,
        minTokensForBuybackCall,
        userRollBalance
    } = useBuyBack();

    const minTokensForBuybackCallDisplay = formatDisplayNumber(Web3.utils.fromWei(minTokensForBuybackCall));

    const userHasMinTokensForBuybackCall = userRollBalance.gte(minTokensForBuybackCall);
    const { onBuybackClick } = useBuybackActionButtons(web3, isEthProviderAvailable, isNetworkSupported, account);

    const { isLoading: isbuybackLoading, onClickWithLoading: buybackOnClickWithLoading } = useOnClickLoadingButton(
        onBuybackClick
    );

    const alreadyBoughtBackDisplay = Web3.utils.fromWei(alreadyBoughtBack);
    const totalBuyBackDisplay = Web3.utils.fromWei(totalBuyBack);
    const singleBuyBackDisplay = Web3.utils.fromWei(singleBuyBack);
    const buyBackRemaingAmount = totalBuyBack.sub(new BN(alreadyBoughtBack));
    const singleBuybackAmountToDisplay =
        isInitialized && isNetworkSupported && isEthProviderAvailable
            ? ` (earn ${formatDisplayNumber(Web3.utils.fromWei(singleBuyBack.div(new BN('100'))))} BNB)`
            : '';

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
                                <h1 className="text-primary">Buyback</h1>
                                <p className="lead text-center text-md-left text-muted my-4">
                                    Do you want to earn some extra BNB in just one click? Be the first to trigger the
                                    buyback proccess and earn 1% of the executed buyback amount
                                    {singleBuybackAmountToDisplay}. In order to do so, you need to hold at least 300,000
                                    ROLL tokens.
                                </p>
                                {isLoading ? (
                                    <ComponentLoader color={ComponentLoaderColor.DARK} className="py-3" />
                                ) : isInitialized ? (
                                    
                                    buyBackRemaingAmount.gt(new BN(0)) ? (
                                        <>
                                            <BuyBackTimer
                                                isBuyBackLoading={isbuybackLoading}
                                                isAccountSet={!!account}
                                                buyBackOnClick={buybackOnClickWithLoading}
                                                nextBuyBackTimestamp={nextBuybackTimestamp}
                                                userHasMinTokensForBuybackCall={userHasMinTokensForBuybackCall}
                                            />
                                            {!userHasMinTokensForBuybackCall && (
                                                <Alert type={AlertType.WARNING} className="mt-4">Minimum balance to trigger buyback is {minTokensForBuybackCallDisplay} ROLL.</Alert>
                                            )}
                                        </>
                                    ) : (
                                        <Alert type={AlertType.INFO}>Buyback has been fully executed.</Alert>
                                    )
                                ) : (
                                    <Alert type={AlertType.INFO}>Buyback has not been initialized.</Alert>
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
                                    <h1>
                                        <span className="text-primary">How does it work?</span>
                                    </h1>
                                    <br />
                                    <p className="lead text-center text-muted mb-5">
                                    A buyback, also known as a token repurchase, is when the project owners rebuy their own tokens to reduce the number of tokens available on the open market and consequently drive the price up.
                                    Our token buyback will occur once every 24h for 10 days straight, starting 24h after the concluded presale. 
                                    If we divide the buyback, 0.4 BNB goes to the buyback caller and 39.6 BNB goes for the actual buyback and all this goes to liquidity, tokens that are bought go to the treasury.
                                    And this is where Governance comes into play, where community will decide what happens with treasury, more in Governance tab.
                                    This numbers are only valid if we reach hardcap, meaning if we reach lower number the buyback will also be proportionally lower.
                                        {isInitialized && (
                                            <span>
                                                {' '}
                                                Each time smart contract will buy for{' '}
                                                {formatDisplayNumber(singleBuyBackDisplay)} BNB worth of ROLL tokens.
                                                Buyback stats are defined below.
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {isInitialized && isNetworkSupported && isEthProviderAvailable && (
                                    <>
                                        <div className="col-3 offset-3 border-right">
                                            <h5>{formatDisplayNumber(alreadyBoughtBackDisplay)} BNB</h5>
                                            <span className="lead text-muted">Executed buyback</span>
                                        </div>
                                        <div className="col-3">
                                            <h5>{formatDisplayNumber(totalBuyBackDisplay)} BNB</h5>
                                            <span className="lead text-muted">Total buyback</span>
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
