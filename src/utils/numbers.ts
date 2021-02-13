import BN from 'bn.js';

export const MAX_UINT_256 = new BN('2').pow(new BN('256')).sub(new BN('1'));

export const formatDisplayNumber = (numberToFormat: string, decimals: number = 3) => {
    const parts = numberToFormat.split('.');
    if (parts.length === 1) {
        return numberToFormat;
    }
    const decimalPart = parts[1].length > decimals ? parts[1].substr(0, decimals) : parts[1];
    return `${parts[0]}.${decimalPart}`;
};