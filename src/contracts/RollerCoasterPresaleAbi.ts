import { AbiItem } from 'web3-utils/types';

export default [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: '_contributor',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_partialContribution',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_totalContribution',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_receivedTokens',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_contributions',
                type: 'uint256',
            },
        ],
        name: 'ContributionAccepted',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: '_contributor',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_contribution',
                type: 'uint256',
            },
        ],
        name: 'ContributionRefunded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'FcfsActivated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'PresaleEnded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'PresaleStarted',
        type: 'event',
    },
    {
        inputs: [],
        name: 'tokenAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'uniswapPairAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'buybackAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'liquidityLockAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'uniswapRouterAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'rcFarmAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'rcEthFarmAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'collectedAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'hardcapAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxContributionAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'isPresaleActive',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'isFcfsActive',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'wasPresaleEnded',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_contributor',
                type: 'address',
            },
        ],
        name: 'isWhitelisted',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_contributor',
                type: 'address',
            },
        ],
        name: 'contribution',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_contributors',
                type: 'address[]',
            },
        ],
        name: 'addContributors',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_hardcap',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_maxContribution',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_uniswapPair',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_buyback',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_liquidityLock',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_uniswapRouter',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_rcFarm',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_rcEthFarm',
                type: 'address',
            },
            {
                internalType: 'address[]',
                name: '_contributors',
                type: 'address[]',
            },
        ],
        name: 'start',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'activateFcfs',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address payable',
                name: '_team',
                type: 'address',
            },
        ],
        name: 'end',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as AbiItem[];
