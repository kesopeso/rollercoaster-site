import { format as formatDate, fromUnixTime } from 'date-fns';
import Web3 from 'web3';
import { IHarvestChunkClaim } from './hooks/useHarvestHistory';
import { formatDisplayNumber } from '../utils/numbers';

interface HarvestChunkClaimTableRowProps {
    claimIndex: number;
    claim: IHarvestChunkClaim;
}

const HarvestChunkClaimTableRow: React.FC<HarvestChunkClaimTableRowProps> = ({ claimIndex, claim }) => {
    return (
        <tr className="text-muted">
            <td className="text-right">{claimIndex + 1}</td>
            <td className="text-right">{formatDate(fromUnixTime(claim.timestamp), 'PPppp')}</td>
            <td className="text-right">{formatDisplayNumber(Web3.utils.fromWei(claim.amount))} ROLL</td>
        </tr>
    );
};

export default HarvestChunkClaimTableRow;
