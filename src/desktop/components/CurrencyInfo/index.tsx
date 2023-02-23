import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Wallet } from '../../../modules';
import { Decimal } from '../../../components';

export interface CurrencyInfoProps {
    wallet: Wallet;
    handleClickTransfer?: (value: string) => void;
}

interface CurrencyIconProps {
    icon?: string | null;
    currency: string;
}

export const CurrencyIcon: React.FunctionComponent<CurrencyIconProps> = (props: CurrencyIconProps) => {
    return <img alt={props.currency} className="img-thumbnail" src={props.icon} />;
};

const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
    const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';
    const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';
    const currency = (props.wallet || { currency: '' }).currency.toUpperCase();
    const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

    const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
    const iconUrl = props.wallet ? props.wallet.iconUrl : null;

    return (
        <div>
            <CurrencyIcon icon={iconUrl} currency={currency} />
            <div>
                <FormattedMessage id="page.body.wallets.balance.spot" />
                <span>
                    <Decimal fixed={selectedFixed}>{balance}</Decimal>
                </span>
                {currency}
            </div>
            <div>
                <FormattedMessage id="page.body.wallets.balance.available" />
                <span>
                    <Decimal fixed={selectedFixed}>{balance}</Decimal>
                </span>
                {currency}
            </div>
            <div>
                <FormattedMessage id="page.body.wallets.locked" />
                <span>
                    <Decimal fixed={selectedFixed}>{stringLocked}</Decimal>
                </span>
                {currency}
            </div>
        </div>
    );
};

export { CurrencyInfo };
