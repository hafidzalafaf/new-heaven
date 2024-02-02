import * as React from 'react';

export const DropdownIcon = ({ fillColor }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path
                d="M4 10L8 6L12 10"
                stroke={fillColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
