import { useEffect, useState } from 'react';
import ActionButton from '../components/action-button';

export interface BuyBackProps {
    isBuyBackLoading: boolean;
    nextBuyBackTimestamp: number;
    buyBackOnClick: () => void;
    isAccountSet: boolean;
    userHasMinTokensForBuybackCall: boolean;
}

const BuyBackTimer: React.FC<BuyBackProps> = ({ isAccountSet, isBuyBackLoading, buyBackOnClick, nextBuyBackTimestamp, userHasMinTokensForBuybackCall }) => {
    const [secondsUntilBuyBack, setSecondsUntilBuyBack] = useState(0);

    useEffect(() => {
        if (!nextBuyBackTimestamp) {
            return;
        }
        const intervalId = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            setSecondsUntilBuyBack(Math.max(nextBuyBackTimestamp - now, 0));
        }, 1000);
        return () => clearInterval(intervalId);
    }, [nextBuyBackTimestamp, setSecondsUntilBuyBack]);

    const seconds = secondsUntilBuyBack % 60;
    const totalMinutes = Math.floor(secondsUntilBuyBack / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    const timeLeftDisplay = `${hours}h ${minutes}m ${seconds}s`;

    return (
        <div className="row">
            <div className="col-11 offset-1">
                <div>
                    <span className="fas fa-clock"></span>
                    <span className="h4">Time until next buyback</span>
                </div>
                <span className="lead text-muted ml-4"><b>{timeLeftDisplay}</b></span>
            </div>
            <div className="mt-3 col offset-1">
                <ActionButton
                    isLoading={isBuyBackLoading}
                    onClick={buyBackOnClick}
                    isDisabled={isBuyBackLoading || !isAccountSet || secondsUntilBuyBack > 0 || !userHasMinTokensForBuybackCall}
                >
                    Send transaction
            </ActionButton>
            </div>
        </div>
    );
};

export default BuyBackTimer;

