import { useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from '../web3-context-provider';
import Web3 from 'web3';
import BN from 'bn.js';
import RollerCoasterBuyBackAbi from '../../contracts/RollerCoasterBuyBackAbi';
import RollerCoasterPresaleAbi from '../../contracts/RollerCoasterPresaleAbi';
import { Subscription } from 'web3-core-subscriptions/types';
import { Log } from 'web3-core/types';

interface IBuyBackData {
    isLoading: boolean;
    isInitialized: boolean;
    nextBuybackTimestamp: number;
    totalBuyBack: BN;
    singleBuyBack: BN;
    alreadyBoughtBack: BN;
}

const defaultBuyBackData: IBuyBackData = {
    isLoading: true,
    isInitialized: false,
    nextBuybackTimestamp: 0,
    totalBuyBack: new BN(0),
    singleBuyBack: new BN(0),
    alreadyBoughtBack: new BN(0),
};

interface ISingleBuyBackExecuted {
    _sender: string;
    _senderRewardAmount: string;
    _buybackAmount: string;
};

const getSingleBuyBackExecutedEventSubscription = (
    web3: Web3,
    eventCallback: (eventData: ISingleBuyBackExecuted) => void
): Subscription<Log> => {
    const eventAbi = RollerCoasterBuyBackAbi.find((el) => el.name === 'SingleBuybackExecuted' && el.type === 'event');
    if (!eventAbi) {
        throw new Error('Invalid RollerCoasterBuyBack ABI. Event SingleBuybackExecuted was not found.');
    }
    const eventInputs = eventAbi.inputs;
    if (!eventInputs) {
        throw new Error('Invalid RollerCoasterBuyBack ABI. Event SingleBuybackExecuted does not have inputs defined.');
    }
    const topics = [web3.eth.abi.encodeEventSignature(eventAbi)];
    return web3.eth.subscribe(
        'logs',
        {
            address: process.env.NEXT_PUBLIC_BUYBACK_CONTRACT_ADDRESS,
            topics,
        },
        (error, log) => {
            if (!!error) {
                console.log('Something went wrong while recieving SingleBuybackExecuted event.', error);
                return;
            }
            const eventData = (web3.eth.abi.decodeLog(
                eventInputs,
                log.data,
                topics
            ) as unknown) as ISingleBuyBackExecuted;
            eventCallback(eventData);
        }
    );
};



const useBuyBack = (): IBuyBackData => {

    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const [buyBackData, setBuyBackData] = useState<IBuyBackData>(defaultBuyBackData);
    const updateBuyBackData = useCallback(
        (updatedData: Partial<IBuyBackData>) => setBuyBackData((currentData) => ({ ...currentData, ...updatedData })),
        [setBuyBackData]
    );

    const buyBackContract = new web3.eth.Contract(
        RollerCoasterBuyBackAbi,
        process.env.NEXT_PUBLIC_BUYBACK_CONTRACT_ADDRESS
    );

    const presaleContract = new web3.eth.Contract(
        RollerCoasterPresaleAbi,
        process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS
    );

    useEffect(() => {
        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updateBuyBackData({ isLoading: false });
            return;
        }

        const singleBuyBackExecutedEventSubscription = getSingleBuyBackExecutedEventSubscription(
            web3,
            async ({ _senderRewardAmount, _buybackAmount }) => {
                const nextBuybackTimestamp = Number(await buyBackContract.methods.nextBuyback().call());

                setBuyBackData((currentData) => ({
                    ...currentData,
                    alreadyBoughtBack: currentData.alreadyBoughtBack.add(new BN(_buybackAmount).add(new BN(_senderRewardAmount))),
                    nextBuybackTimestamp,
                }));
            }
        );

        (async () => {
            updateBuyBackData({ isLoading: true });

            const totalAmount = Web3.utils.toBN(await buyBackContract.methods.totalAmount().call());
            const singleAmount = Web3.utils.toBN(await buyBackContract.methods.singleAmount().call());
            const alreadyBoughtBack = Web3.utils.toBN(await buyBackContract.methods.boughtBackAmount().call());
            const isInitialized = await presaleContract.methods.wasPresaleEnded().call();
            const nextBuybackTimestamp = Number(await buyBackContract.methods.nextBuyback().call());

            updateBuyBackData({
                isInitialized: isInitialized,
                isLoading: false,
                nextBuybackTimestamp,
                totalBuyBack: totalAmount,
                singleBuyBack: singleAmount,
                alreadyBoughtBack: alreadyBoughtBack,
            });
        })();

        return () => { !!singleBuyBackExecutedEventSubscription && singleBuyBackExecutedEventSubscription.unsubscribe() };
    }, [
        account,
        web3,
        isWeb3ContextLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        updateBuyBackData,
        setBuyBackData,
    ]);

    return buyBackData;
};

export default useBuyBack;