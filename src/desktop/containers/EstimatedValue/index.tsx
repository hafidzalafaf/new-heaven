import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import { formatWithSeparators, Decimal } from '../../../components';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue, estimateLokcedValue } from '../../../helpers/estimateValue';
import { selectCurrencies, selectMarkets, selectMarketTickers, Wallet } from '../../../modules';

interface EstimatedValueProps {
    wallets: Wallet[];
    type: string;
}

type Props = EstimatedValueProps;

const EstimatedValue: React.FC<Props> = (props: Props): React.ReactElement => {
    const { formatMessage } = useIntl();
    const translate = React.useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [
        formatMessage,
    ]);

    const { wallets, type } = props;
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);

    useMarketsTickersFetch();
    useMarketsFetch();
    useWalletsFetch();

    const estimatedValue = React.useMemo(() => {
        return estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    }, [currencies, wallets, markets, tickers]);

    const dataWallet = wallets.map((item) => ({
        ...item,
        currencyItem: currencies.find((curr) => curr.id == item.currency),
    }));

    const spotBalance = dataWallet.map(
        (sum) => (Number(sum?.balance) + Number(sum?.locked)) * Number(sum?.currencyItem?.price)
    );

    const totalEstimateSpot = spotBalance?.reduce((accumulator, current) => {
        return accumulator + current;
    }, 0);

    const p2pBalance = dataWallet.map(
        (sum) => (Number(sum?.p2p_balance) + Number(sum?.p2p_locked)) * Number(sum?.currencyItem?.price)
    );

    const totalEstimateP2P = p2pBalance?.reduce((accumulator, current) => {
        return accumulator + current;
    }, 0);

    // let USDollar = new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'usd',
    // });

    return (
        <div className="d-flex mb-24">
            <div className="mr-5">
                <p className="text-ms grey-text-accent font-extrabold mb-12">Total Estimated Balance</p>
                <div className="d-flex align-items-center">
                    <span className="value-container text-md white-text">
                        <span className="value">
                            <Decimal fixed={2}>{type == 'p2p' ? totalEstimateP2P : totalEstimateSpot}</Decimal>{' '}
                        </span>
                        <span className="value-sign mr-24">{VALUATION_PRIMARY_CURRENCY.toUpperCase()}</span>
                    </span>
                </div>
            </div>
            {/* <div>
                <p className="text-ms grey-text-accent font-extrabold mb-12">Locked Estimated Balance</p>
                <div className="d-flex align-items-center">
                    <span className="value-container text-md white-text">
                        <span className="value">{formatWithSeparators(estimatedLockedValue, ',')} </span>
                        <span className="value-sign mr-24">{VALUATION_PRIMARY_CURRENCY.toUpperCase()}</span>
                    </span>
                </div>
            </div> */}
        </div>
    );
};

export { EstimatedValue };
