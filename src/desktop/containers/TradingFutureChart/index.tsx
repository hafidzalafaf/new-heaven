import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrencies } from 'src/modules';
import { useParams } from 'react-router-dom';
import './TradingFutureChart.pcss';

export const TradingFutureChart: FC = (): ReactElement => {
    const currencies = useSelector(selectCurrencies);
    const { currency = '' } = useParams<{ currency?: string }>();

    return <React.Fragment>AAAAA</React.Fragment>;
};
