import Head from 'next/head';
import { useContext } from 'react';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import Alert, { AlertType } from '../components/alert';
import Card from '../components/card';
import BN from 'bn.js';
import Web3 from 'web3';
import { Web3Context } from '../components/web3-context-provider';
import PresaleContractAddress from '../components/presale-contract-address';
import usePresale from '../components/hooks/usePresale';
import PresaleChart from '../components/presale-chart';

const Presale: React.FC<{}> = () => {
    const { account, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);

    const {
        isLoading,
        isActive,
        wasEnded,
        allowWhiteListAddressesOnly,
        collectedSupply,
        totalSupply,
        accountContribution,
        isAccountWhitelisted,
    } = usePresale();

    const totalAccountContribution = new BN(Web3.utils.toWei('3'));
    const totalAccountContributionDisplay = Web3.utils.fromWei(totalAccountContribution);
    const accountContributionDisplay = Web3.utils.fromWei(accountContribution);
    const accountContributionPercent =
        (Number(accountContributionDisplay) * 100) / Number(totalAccountContributionDisplay);

    const totalSupplyDisplay = Web3.utils.fromWei(totalSupply);
    const collectedSupplyDisplay = Web3.utils.fromWei(collectedSupply);
    const collectedPercent = (Number(collectedSupplyDisplay) * 100) / Number(totalSupplyDisplay);

    return (
        <>
            <Head>
                <title>RollerCoaster | Presale - rollercoaster.finance</title>
            </Head>

            <div className="container-fluid">
                <div className="row py-4">
                    <div className="container">
                        <div className="row align-items-center py-6">
                            <div className="col-12 col-md-5 col-lg-6">
                                <img src="/presale.png" className="mw-100" />
                            </div>
                            <div className="col-12 col-md-7 col-lg-6">
                                <h1 className="text-primary">Presale</h1>
                                <p className="mb-4 lead text-muted">
                                    <b>Presale</b> investors will get <b>100 ROLL</b> for 1 ETH and <b>listing</b> price
                                    will be <b>45 ROLL</b> for 1 ETH. Presale will stop as soon as the hard cap is
                                    reached. If the hard cap isn't reached, we will open contributions for everyone on
                                    the FCFS basis. FCFS duration will be announced on our official channels (Discord,
                                    Telegram). 60% of the collected funds (360 ETH) is going to be used for Uniswap liqudity.
                                    At the Uniswap listing we're going to inject 120 ETH + 5400 ROLL to the liquidity pool. 
                                    We'll start adding 24 ETH to liquidity each day after the listing on Uniswap, and so on for the next 10 days (360ETH in total). 
                                    Liquidity will be locked for 6 months.
                                </p>
                                <div className="row">
                                    <div className="col-1">
                                        <i className="fas fa-xl fa-shopping-cart"></i>
                                    </div>
                                    <div className="col-11 mb-3">
                                        <h4 className="mb-0">Hard cap</h4>
                                        <span className="lead text-muted mb-3">
                                            Total hard cap is <b>600 ETH</b>.{' '}
                                        </span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-1">
                                        <i className="fas fa-shopping-cart"></i>
                                    </div>
                                    <div className="col-11">
                                        <h4 className="mb-0">Maximum contribution</h4>
                                        <span className="lead text-muted">
                                            Maximum contribution per address is <b>3 ETH</b>.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="row bg-white py-6">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 mb-4 col-md-6">
                                        <Card titleIconClassName="fas fa-battery-half" titleText="Status">
                                            {isLoading ? (
                                                <ComponentLoader color={ComponentLoaderColor.DARK} className="py-3" />
                                            ) : isEthProviderAvailable && isNetworkSupported ? (
                                                <>
                                                    {!isActive && (
                                                        <p className="card-text">
                                                            {!wasEnded ? (
                                                                <span className="muted">
                                                                    Presale has not started yet.
                                                                </span>
                                                            ) : (
                                                                <span className="muted">
                                                                    Presale has been concluded.
                                                                </span>
                                                            )}
                                                        </p>
                                                    )}

                                                    {isActive && (
                                                        <>
                                                            <p className="card-text mb-0 lead">
                                                                Presale is live and open for contributions.
                                                            </p>
                                                            <p className="card-text">
                                                                {allowWhiteListAddressesOnly ? (
                                                                    <span className="text-muted">
                                                                        Only whitelist addresses can contribute.
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-primary">
                                                                        Anyone can contribute (FCFS is active).
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </>
                                                    )}

                                                    {(isActive || wasEnded) && (
                                                        <>
                                                            <p className="card-text mb-0">
                                                                Collected ETHs ({collectedSupplyDisplay} /{' '}
                                                                {totalSupplyDisplay})
                                                            </p>
                                                            <div className="progress">
                                                                <div
                                                                    className="progress-bar bg-primary"
                                                                    role="progressbar"
                                                                    style={{ width: `${collectedPercent}%` }}
                                                                    aria-valuenow={collectedPercent}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                ></div>
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="dropdown-divider my-4" />
                                                    {!wasEnded &&
                                                        (!!account ? (
                                                            isAccountWhitelisted || !allowWhiteListAddressesOnly ? (
                                                                <>
                                                                    <p className="carc-text lead text-primary">
                                                                        You are eligible to participate in our presale.
                                                                    </p>
                                                                    <p className="card-text mb-0">
                                                                        Your contribution in ETHs (
                                                                        {accountContributionDisplay} /{' '}
                                                                        {totalAccountContributionDisplay})
                                                                    </p>

                                                                    <div className="progress">
                                                                        <div
                                                                            className="progress-bar bg-primary"
                                                                            role="progressbar"
                                                                            style={{
                                                                                width: `${accountContributionPercent}%`,
                                                                            }}
                                                                            aria-valuenow={accountContributionPercent}
                                                                            aria-valuemin={0}
                                                                            aria-valuemax={100}
                                                                        ></div>
                                                                    </div>
                                                                </>
                                                            ) : isActive ? (
                                                                <p className="card-text text-danger muted">
                                                                    You are not eligible to participate in our presale.
                                                                </p>
                                                            ) : (
                                                                <p className="card-text muted">
                                                                    Please wait until presale starts.
                                                                </p>
                                                            )
                                                        ) : (
                                                            <Alert type={AlertType.INFO}>
                                                                Connect your wallet via MetaMask to check your
                                                                contribution.
                                                            </Alert>
                                                        ))}
                                                </>
                                            ) : (
                                                <Alert type={AlertType.WARNING}>Contract data is unavailable.</Alert>
                                            )}
                                        </Card>
                                    </div>

                                    <div className="col-12 mb-4 col-md-6">
                                        <Card titleIconClassName="fas fa-file-signature" titleText="Contracts">
                                            <ul className="list-group">
                                                <PresaleContractAddress
                                                    address={process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS}
                                                >
                                                    Presale contract
                                                </PresaleContractAddress>
                                                <PresaleContractAddress
                                                    address={process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}
                                                >
                                                    ROLL token contract
                                                </PresaleContractAddress>
                                                <PresaleContractAddress
                                                    address={process.env.NEXT_PUBLIC_LIQUIDITY_LOCK_CONTRACT_ADDRESS}
                                                >
                                                    Liquidity lock contract
                                                </PresaleContractAddress>
                                            </ul>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Presale;
