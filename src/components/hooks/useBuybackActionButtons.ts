import { useCallback, useContext } from 'react';
import { Web3Context } from '../web3-context-provider';
import RollerCoasterBuybackAbi from '../../contracts/RollerCoasterBuyBackAbi';

const useBuybackActionButtons = () => {
    const { web3, isEthProviderAvailable, isNetworkSupported, account } = useContext(Web3Context);
    console.log("onBuybackClick");
    const onBuybackClick = useCallback(async () => {

        const contract = new web3.eth.Contract(
            RollerCoasterBuybackAbi,
            process.env.NEXT_PUBLIC_BUYBACK_CONTRACT_ADDRESS
        );

        if (!contract || !account) {
            return;
        }

        await contract.methods.buyback().send({ from: account });

    }, [
        account
    ]);

    return {
        onBuybackClick
    };
};

export default useBuybackActionButtons;