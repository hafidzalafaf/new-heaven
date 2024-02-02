/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import { EmptyData } from '../../../assets/images/NoData';

interface NoDataProps {
    text: string;
}

export const NoData: React.FC<NoDataProps> = ({ text }) => {
    return (
        <div className="d-flex justify-content-center flex-column align-items-center mt-4">
            <EmptyData />
            <p className="white-text font-extrabold mt-4 mb-0 text-md">NO DATA</p>
            <p className="grey-text-accent font-normal mt-2 mb-0 text-sm">Empty Data</p>
            <p className="grey-text-accent font-normal mb-0 text-sm">{text}</p>
        </div>
    );
};
