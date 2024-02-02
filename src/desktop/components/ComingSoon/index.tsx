/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import { ComingSoonIcon } from '../../../assets/images/ComingSoonIcon';

interface ComingSoonProps {
    text?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ text }) => {
    return (
        <div className="d-flex justify-content-center flex-column align-items-center mt-4">
            <ComingSoonIcon />
            <p className="white-text font-extrabold mt-4 mb-0 text-lg">Coming Soon</p>
            <p className="grey-text-accent font-normal mt-2 mb-0 text-ms">
                {text ?? 'This Feature Is Under Develope, Stay tune for the Amazing Trade Experience'}
            </p>
        </div>
    );
};
