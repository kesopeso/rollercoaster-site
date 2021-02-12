import { Web3Context } from '../web3-context-provider';
import { useCallback, useContext, useEffect, useState } from 'react';
import IERC20Abi from '../../contracts/IERC20Abi';
import Web3 from 'web3';
import BN from 'bn.js';



const useGovernance = (isLoading: boolean, isEthProviderAvailable: boolean, isNetworkSupported: boolean, web3: Web3) => {

    const [treasuryBalance, setTreasuryBalance] = useState<BN>(new BN(0));
    const treasuryContractAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS;
    const governanceData = {
        treasuryBalance,
        treasuryContractAddress
    };

    useEffect(() => {

        if(isLoading || !isEthProviderAvailable || !isNetworkSupported) {
            return;
        }

        const contract = new web3.eth.Contract(
            IERC20Abi,
            process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
        );
        (async() => {
            const balance = Web3.utils.toBN(await contract.methods.balanceOf(treasuryContractAddress).call());
            console.log(balance.toString());
            setTreasuryBalance(balance);
        })();
        
        
    },[
        web3,
        isLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        setTreasuryBalance,
        treasuryContractAddress,
        treasuryContractAddress
    ]);
    
    return governanceData;
};

export default useGovernance;