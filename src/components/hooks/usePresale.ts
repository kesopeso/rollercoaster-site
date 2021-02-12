import { useCallback, useContext, useEffect, useState } from 'react';
import RollerCoasterPresaleAbi from '../../contracts/RollerCoasterPresaleAbi';
import { Web3Context } from '../web3-context-provider';
import BN from 'bn.js';
import Web3 from 'web3';
import { Subscription } from 'web3-core-subscriptions/types';
import { Log } from 'web3-core/types';

interface IContributionAccepted {
    _contributor: string;
    _partialContribution: string;
    _totalContribution: string;
    _receivedTokens: string;
    _contributions: string;
}

interface IPresaleData {
    isLoading: boolean;
    isActive: boolean;
    wasEnded: boolean;
    allowWhiteListAddressesOnly: boolean;
    collectedSupply: BN;
    accountContribution: BN;
    isAccountWhitelisted: boolean;
    totalSupply: BN;
}

const defaultPresaleData: IPresaleData = {
    isLoading: true,
    isActive: false,
    wasEnded: false,
    collectedSupply: Web3.utils.toBN('0'),
    allowWhiteListAddressesOnly: true,
    accountContribution: Web3.utils.toBN('0'),
    isAccountWhitelisted: false,
    totalSupply: Web3.utils.toBN(Web3.utils.toWei('600')),
};

const getContributionAcceptedEventSubscription = (
    web3: Web3,
    eventCallback: (eventData: IContributionAccepted) => void
): Subscription<Log> => {
    const eventAbi = RollerCoasterPresaleAbi.find((el) => el.name === 'ContributionAccepted' && el.type === 'event');
    if (!eventAbi) {
        throw new Error('Invalid RollerCoasterPresale ABI. Event ContributionAccepted was not found.');
    }
    const eventInputs = eventAbi.inputs;
    if (!eventInputs) {
        throw new Error('Invalid RollerCoasterPresale ABI. Event ContributionAccepted does not have inputs defined.');
    }
    const topics = [web3.eth.abi.encodeEventSignature(eventAbi)];
    return web3.eth.subscribe(
        'logs',
        {
            address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
            topics,
        },
        (error, log) => {
            if (!!error) {
                console.log('Something went wrong while recieving ContributionAccepted event.', error);
                return;
            }

            const eventData = (web3.eth.abi.decodeLog(
                eventInputs,
                log.data,
                log.topics.slice(1)
            ) as unknown) as IContributionAccepted;
            eventCallback(eventData);
        }
    );
};

const getPresaleStartedEventSubscription = (
    web3: Web3,
    eventCallback: () => void
): Subscription<Log> => {
    const eventAbi = RollerCoasterPresaleAbi.find((el) => el.name === 'PresaleStarted' && el.type === 'event');
    if (!eventAbi) {
        throw new Error('Invalid RollerCoasterPresale ABI. Event PresaleStarted was not found.');
    }
    const topics = [web3.eth.abi.encodeEventSignature(eventAbi)];
    return web3.eth.subscribe(
        'logs',
        {
            address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
            topics,
        },
        (error, log) => {
            if (!!error) {
                console.log('Something went wrong while recieving PresaleStarted event.', error);
                return;
            }
            eventCallback();
        }
    );
};

const getPresaleEndedEventSubscription = (
    web3: Web3,
    eventCallback: () => void
): Subscription<Log> => {
    const eventAbi = RollerCoasterPresaleAbi.find((el) => el.name === 'PresaleEnded' && el.type === 'event');
    if (!eventAbi) {
        throw new Error('Invalid RollerCoasterPresale ABI. Event PresaleEnded was not found.');
    }
    const topics = [web3.eth.abi.encodeEventSignature(eventAbi)];
    return web3.eth.subscribe(
        'logs',
        {
            address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
            topics,
        },
        (error, log) => {
            if (!!error) {
                console.log('Something went wrong while recieving PresaleEnded event.', error);
                return;
            }
            eventCallback();
        }
    );
};

const getFcfsActivatedEventSubscription = (
    web3: Web3,
    eventCallback: () => void
): Subscription<Log> => {
    const eventAbi = RollerCoasterPresaleAbi.find((el) => el.name === 'FcfsActivated' && el.type === 'event');
    if (!eventAbi) {
        throw new Error('Invalid RollerCoasterPresale ABI. Event FcfsActivated was not found.');
    }
    const topics = [web3.eth.abi.encodeEventSignature(eventAbi)];
    return web3.eth.subscribe(
        'logs',
        {
            address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS,
            topics,
        },
        (error, log) => {
            if (!!error) {
                console.log('Something went wrong while recieving FcfsActivated event.', error);
                return;
            }
            eventCallback();
        }
    );
};

const usePresale = (): IPresaleData => {
    const { web3, isLoading: isWeb3ContextLoading, isEthProviderAvailable, isNetworkSupported, account } = useContext(
        Web3Context
    );
    const [presaleData, setPresaleData] = useState<IPresaleData>(defaultPresaleData);
    const updatePresaleData = useCallback(
        (updatedData: Partial<IPresaleData>) => setPresaleData((currentData) => ({ ...currentData, ...updatedData })),
        [setPresaleData]
    );

    useEffect(() => {
        if (!presaleData.isActive || presaleData.wasEnded || isWeb3ContextLoading) {
            return;
        }

        const fcfsActivatedEventSubscription = getFcfsActivatedEventSubscription(
            web3,
            () => {
                updatePresaleData({ allowWhiteListAddressesOnly: false });
            }
        );

        return () => {
            !!fcfsActivatedEventSubscription && fcfsActivatedEventSubscription.unsubscribe();
        };

    }, [
        presaleData.isActive,
        presaleData.wasEnded,
        presaleData.allowWhiteListAddressesOnly,
        updatePresaleData,
        web3,
        isWeb3ContextLoading
    ]);

    useEffect(() => {
        if (!presaleData.isActive || presaleData.wasEnded || isWeb3ContextLoading) {
            return;
        }

        const presaleEndedEventSubscription = getPresaleEndedEventSubscription(
            web3,
            () => {
                updatePresaleData({ wasEnded: false, isActive: false });
            }
        );

        return () => {
            !!presaleEndedEventSubscription && presaleEndedEventSubscription.unsubscribe();
        };

    }, [
        presaleData.isActive,
        presaleData.wasEnded,
        updatePresaleData,
        web3,
        isWeb3ContextLoading
    ]);

    useEffect(() => {
        if (presaleData.isActive || presaleData.wasEnded || isWeb3ContextLoading) {
            return;
        }

        const presaleStartedEventSubscription = getPresaleStartedEventSubscription(
            web3,
            () => {
                updatePresaleData({ isActive: true });
            }
        );

        return () => {
            !!presaleStartedEventSubscription && presaleStartedEventSubscription.unsubscribe();
        };

    }, [presaleData.isActive, presaleData.wasEnded, updatePresaleData, web3, isWeb3ContextLoading]);

    useEffect(() => {
        if (isWeb3ContextLoading) {
            return;
        }

        if (!isEthProviderAvailable || !isNetworkSupported) {
            updatePresaleData({ isLoading: false });
            return;
        }
        
        const contributionAcceptedEventSubscription = getContributionAcceptedEventSubscription(
            web3,
            ({ _contributor, _totalContribution, _receivedTokens, _contributions }) => {
                
                const collectedSupply = Web3.utils.toBN(_contributions);
                setPresaleData((currentData) => ({
                    ...currentData,
                    collectedSupply,
                    accountContribution:
                        account?.toLowerCase() === _contributor.toLowerCase()
                            ? Web3.utils.toBN(_totalContribution)
                            : currentData.accountContribution,
                }));
            }
        );
        
        (async () => {
            updatePresaleData({ isLoading: true });

            const contract = new web3.eth.Contract(
                RollerCoasterPresaleAbi,
                process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS
            );

            const isActive = await contract.methods.isPresaleActive().call();
            const wasEnded = await contract.methods.wasPresaleEnded().call();
            const allowWhiteListAddressesOnly = !(await contract.methods.isFcfsActive().call());
            const totalSupply = Web3.utils.toBN(await contract.methods.hardcapAmount().call());
            const collectedSupply = Web3.utils.toBN(await contract.methods.collectedAmount().call());
            const accountContribution = !!account
                ? Web3.utils.toBN(await contract.methods.contribution(account).call())
                : new BN(0);
            const isAccountWhitelisted = !!account ? await contract.methods.isWhitelisted(account).call() : false;

            updatePresaleData({
                isLoading: false,
                isActive,
                wasEnded,
                allowWhiteListAddressesOnly,
                collectedSupply,
                accountContribution,
                isAccountWhitelisted,
                totalSupply
            });
        })();

        return () => {
            !!contributionAcceptedEventSubscription && contributionAcceptedEventSubscription.unsubscribe();
        };
    }, [
        account,
        web3,
        isWeb3ContextLoading,
        isEthProviderAvailable,
        isNetworkSupported,
        updatePresaleData,
        setPresaleData,
        presaleData.isActive,
        presaleData.allowWhiteListAddressesOnly,
        presaleData.wasEnded
    ]);

    return presaleData;
};

export default usePresale;