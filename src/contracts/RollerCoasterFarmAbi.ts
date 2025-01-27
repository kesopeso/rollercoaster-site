import { AbiItem } from 'web3-utils/types';

export default [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: '_harvestId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'Claim',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_id',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'Harvest',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'Stake',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'Withdraw',
        type: 'event',
    },
    {
        inputs: [],
        name: 'farmingActive',
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
        name: 'totalRewardSupply',
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
        name: 'intervalReward',
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
        name: 'rewardIntervalLength',
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
        name: 'harvestIntervalLength',
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
        name: 'nextIntervalTimestamp',
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
        name: 'rewardTokenAddress',
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
        name: 'farmTokenAddress',
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
        inputs: [
            {
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
        ],
        name: 'singleStaked',
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
        name: 'totalStaked',
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
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'stake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'harvest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
        ],
        name: 'harvestable',
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
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
        ],
        name: 'claimable',
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
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
        ],
        name: 'harvested',
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
                internalType: 'address',
                name: '_staker',
                type: 'address',
            },
            {
                internalType: 'uint56',
                name: '_id',
                type: 'uint56',
            },
        ],
        name: 'harvestChunk',
        outputs: [
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'claimed',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'total',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as AbiItem[];
