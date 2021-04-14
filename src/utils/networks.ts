import { NextEnvironment } from './enums';
import { ChainId } from '@pancakeswap-libs/sdk';

export const getIsNetworkSupported = (chainId: number) => {
    switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
        case NextEnvironment.DEVELOPMENT:
        case NextEnvironment.STAGING:
            return chainId === ChainId.BSCTESTNET;

        case NextEnvironment.PRODUCTION:
            return chainId === ChainId.MAINNET;

        default:
            throw new Error(`Unsupported environment '${process.env.NEXT_PUBLIC_ENVIRONMENT}'.`);
    }
};
