import { useCallback, useContext } from 'react';
import { Web3Context } from '../web3-context-provider';
import RollerCoasterBuybackAbi from '../../contracts/RollerCoasterBuyBackAbi';
import Web3 from 'web3';

const useBuybackActionButtons = (web3: Web3, isEthProviderAvailable: boolean, isNetworkSupported: boolean, account: string | null) => {

    const onBuybackClick = useCallback(async () => {

        if (!isEthProviderAvailable || !isNetworkSupported  || !account) {
            return;
        }

        const contract = new web3.eth.Contract(
            RollerCoasterBuybackAbi,
            process.env.NEXT_PUBLIC_BUYBACK_CONTRACT_ADDRESS
        );

        if (!contract) {
            return;
        }

        await contract.methods.buyback().send({ from: account });

    }, [
        account,
        isEthProviderAvailable,
        isNetworkSupported
    ]);

    return {
        onBuybackClick
    };
};

export default useBuybackActionButtons;