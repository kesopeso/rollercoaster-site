import Head from 'next/head';
import ComponentLoader, { ComponentLoaderColor } from '../components/component-loader';
import { Web3Context } from '../components/web3-context-provider';
import { useContext } from 'react';
import useGovernance from '../components/hooks/useGovernance';
import Web3 from 'web3';
import { getEtherScanUrl } from '../utils/urls';
import { formatDisplayNumber } from '../utils/numbers';

const Governance: React.FC<{}> = () => {

    const { web3, isLoading, isEthProviderAvailable, isNetworkSupported } = useContext(Web3Context);
    const { treasuryBalance, treasuryContractAddress } = useGovernance(isLoading, isEthProviderAvailable, isNetworkSupported, web3);
    
    const treasuryBalanceDisplay = formatDisplayNumber(Web3.utils.fromWei(treasuryBalance));
    
    return (
        <>
            <Head>
                <title>RollerCoaster | Governance - rollecoaster.finance</title>
            </Head>

            {isLoading ? (
                <ComponentLoader color={ComponentLoaderColor.DARK} className="py-6" />
            ) : (
                <div className="container-fluid">
                    <div className="row">
                        <div className="container">
                            <div className="row align-items-center py-6">
                                <div className="col-12 col-md-5 col-lg-6 order-md-2">
                                    <h1 className="text-primary">Governance</h1>
                                    <p className="lead text-muted my-4">
                                        ROLL presents a governance infrastructure, which will be absolutely open to the changes our community would impose.
                                        It enables upgrade or improvement of the protocol as the community sees fit.
                                        With each transaction your ROLL ticket makes 5% of tokens will get burned and sent to Treasury.
                                        From each Buyback all ROLL tokens will be sent to Treasury address as well.
                                        The longer you occupy your seats, the higher our ROLLER will take you! 
                                        Don’t sell your ticket cheap!
                                    </p>
                                    <div className="col"><span className="text-muted lead">Balance: </span>{treasuryBalanceDisplay} ROLL</div>
                                    <div className="col"><span className="text-muted lead">Address: </span>
                                        <a target="_blank" href={getEtherScanUrl(`address/${treasuryContractAddress}`)}>{treasuryContractAddress}</a>
                                    </div>
                                </div>
                                <div className="col-12 col-md-7 col-lg-6 order-md-1">
                                <img src="/governance.png" className="img-fluid mw-md-150 mw-lg-130 mb-6 mb-md-0"></img>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row bg-white py-6">
                        <div className="container">
                            <div className="row text-center">
                                <div className="col">
                                    <h1>Coming soon stay tuned</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Governance;
