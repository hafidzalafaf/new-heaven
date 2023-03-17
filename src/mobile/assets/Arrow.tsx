import * as React from 'react';

export const ArrowLeft = ({ className }) => {
    return (
        <svg
            width={24}
            className={className}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#B5B3BC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="#B5B3BC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const ArrowRight = ({ className }) => {
    return (
        <svg
            className={className}
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="#6F6F6F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};


export const ArrowRightL = ({className}) => {
    return (
        <svg width={24} height={24} viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M18.6673 24.5564L16.8006 22.6231L21.534 17.8897L5.33398 17.8897L5.33398 15.2231L21.534 15.2231L16.8006 10.4897L18.6673 8.5564L26.6673 16.5564L18.6673 24.5564Z" fill="#B5B3BC"/>
        </svg>

    )
}
