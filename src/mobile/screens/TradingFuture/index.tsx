import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks';

export const TradingFutureMobileScreen: React.FC = (): React.ReactElement => {
    const { currency = '' } = useParams<{ currency?: string }>();
    useDocumentTitle('Trading');

    return (
        <React.Fragment>
            <h1>Trading Future</h1>
        </React.Fragment>
    );
};
