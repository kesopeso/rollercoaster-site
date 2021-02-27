import { useContext } from 'react';
import { AlertType } from './alert';
import MetaMaskAlert from './metamask-alert';
import { Web3Context } from './web3-context-provider';

const Content: React.FC<{}> = ({ children }) => {
    const { isEthProviderAvailable, isNetworkSupported, account } = useContext(Web3Context);

    return (
        <main>
            {!isEthProviderAvailable && (
                <MetaMaskAlert type={AlertType.WARNING}>
                    MetaMask was not detected, therefore features requiring blockchain access will not be available.
                </MetaMaskAlert>
            )}

            {isEthProviderAvailable && !isNetworkSupported && (
                <MetaMaskAlert type={AlertType.WARNING}>
                    Sorry, the selected Ethereum network is not supported. Please connect to Binance Smart Chain. Click{' '}
                    <a
                        href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain"
                        target="_blank"
                        className="alert-link"
                    >
                        here
                    </a>{' '}
                    for instructions.
                </MetaMaskAlert>
            )}

            {isEthProviderAvailable && isNetworkSupported && !account && (
                <MetaMaskAlert type={AlertType.INFO}>
                    Connect your account by clicking on the navbar connect wallet button.
                </MetaMaskAlert>
            )}

            {children}
        </main>
    );
};

export default Content;
