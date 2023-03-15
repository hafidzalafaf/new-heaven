import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import './WalletWithdrawalInfo.pcss';

export interface WalletWithdrawalInfoProps {
    textColor: string;
}

export const WalletWithdrawalInfo: React.FC<WalletWithdrawalInfoProps> = (props) => {
    const { textColor } = props;
    const intl = useIntl();
    const history = useHistory();
    const { currency = '' } = useParams<{ currency?: string }>();

    return (
        <React.Fragment>
            <div className={`cr-wallet-withdraw-info dark-bg-main p-3 radius-md ${textColor}`}>
                <h6 className="mb-8 font-bold text-md">Note :</h6>
                <p className="mb-1 text-xs">
                    1. The transaction fees will be deducted from the balance with priority or from the withdrawn amount
                    in case of insufficient balance .
                </p>
                <p className="mb-1 text-xs">
                    2. Amount available for withdrawal ≤ Account available assets - Unconfirmed digital assets.
                </p>
                <p className="mb-1 text-xs">
                    3. Do not withdraw directly to a crowdfund or ICO address, as your account will not be credited with
                    tokens from such sales
                </p>

                {currency == 'xrp' && (
                    <p className="mb-1 text-xs">
                        4.{' '}
                        <span className="danger-text">
                            The minimum transfer for activating a Ripple address is 21 XRP after deducting the fee, if
                            you don't fulfill it you will fail.
                        </span>
                    </p>
                )}
            </div>
        </React.Fragment>
    );
};
