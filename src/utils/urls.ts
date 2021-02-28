import { NextEnvironment } from './enums';

export const getEtherScanUrl = (suffix: string | null = null) => {
    let urlBase: string;
    switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
        case NextEnvironment.DEVELOPMENT:
            urlBase = 'https://testnet.bscscan.com';
            break;

        case NextEnvironment.STAGING:
        case NextEnvironment.PRODUCTION:
            urlBase = 'https://bscscan.com';
            break;

        default:
            throw new Error(`Unsupported environment '${process.env.NEXT_PUBLIC_ENVIRONMENT}'.`);
    }
    return !!suffix ? `${urlBase}/${suffix}` : urlBase;
};
