import { useCallback } from 'react';
import { MAX_UINT_256 } from '../../utils/numbers';
import BN from 'bn.js';
import { Contract } from 'web3-eth-contract';

const useFarmActionButtons = (
    farmContract: Contract | null,
    farmTokenContract: Contract | null,
    account: string | null,
    refreshFarmData: (showLoading: boolean) => Promise<void>
) => {
    const onApproveClick = useCallback(async () => {
        if (!farmContract || !farmTokenContract || !account) {
            return;
        }
        await farmTokenContract.methods.approve(farmContract.options.address, MAX_UINT_256).send({ from: account });
        await refreshFarmData(false);
    }, [farmContract, farmTokenContract, account, refreshFarmData]);

    const onStakeClick = useCallback(
        async (stakeAmount: BN) => {
            if (!farmContract || !account) {
                return;
            }
            await farmContract.methods.stake(stakeAmount).send({ from: account });
            await refreshFarmData(false);
        },
        [farmContract, account, refreshFarmData]
    );

    const onStakeAllClick = useCallback(async () => {
        if (!farmTokenContract || !account) {
            return;
        }
        const stakeAmount = new BN(await farmTokenContract.methods.balanceOf(account).call());
        await onStakeClick(stakeAmount);
    }, [farmTokenContract, account, onStakeClick]);

    const onWithdrawClick = useCallback(
        async (withdrawAmount: BN) => {
            if (!farmContract || !account) {
                return;
            }
            await farmContract.methods.withdraw(withdrawAmount).send({ from: account });
            await refreshFarmData(false);
        },
        [farmContract, account, refreshFarmData]
    );

    const onWithdrawAllClick = useCallback(async () => {
        if (!farmContract || !account) {
            return;
        }
        const withdrawAmount = new BN(await farmContract.methods.singleStaked(account).call());
        await onWithdrawClick(withdrawAmount);
    }, [farmContract, account, refreshFarmData, onWithdrawClick]);

    const onHarvestClick = useCallback(async () => {

        if (!farmContract || !account) {
            return;
        }
        await farmContract.methods.harvest().send({ from: account });
        await refreshFarmData(false);
    }, [farmContract, account, refreshFarmData]);

    const onClaimClick = useCallback(async () => {
        if (!farmContract || !account) {
            return;
        }
        await farmContract.methods.claim().send({ from: account });
        await refreshFarmData(false);
    }, [farmContract, account, refreshFarmData]);

    return {
        onApproveClick,
        onStakeClick,
        onStakeAllClick,
        onWithdrawClick,
        onWithdrawAllClick,
        onHarvestClick,
        onClaimClick,
    };
};

export default useFarmActionButtons;
