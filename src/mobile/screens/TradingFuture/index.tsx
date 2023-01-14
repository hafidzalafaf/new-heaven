import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { TradingViewEmbed, widgetType } from 'react-tradingview-embed';
import { useMarketsFetch, useMarketsTickersFetch, useDocumentTitle } from '../../../hooks';
import {
    selectCurrencies,
    selectMarketTickers,
    MarketsTickersData,
    Currency,
    selectMarkets,
    Market,
} from '../../../modules';
import { Decimal } from '../../../components';
import { ModalFullScreenMobile } from 'src/mobile/components';

export const TradingFutureMobileScreen: React.FC = (): React.ReactElement => {
    const { currency = '' } = useParams<{ currency?: string }>();
    useDocumentTitle('Trading');

    return (
        <React.Fragment>
            <h1>Trading Future</h1>
        </React.Fragment>
    );
};
