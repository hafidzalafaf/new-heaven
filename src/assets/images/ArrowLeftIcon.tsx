import * as React from 'react';

export const ArrowLeftIcon = ({ className }) => {
    return (
        <svg
            width="32"
            height="32"
            className={className}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_233_14512)">
                <path
                    d="M20.546 9.88L18.666 8L10.666 16L18.666 24L20.546 22.12L14.4393 16L20.546 9.88Z"
                    fill="#F2F0FF"
                />
            </g>
            <defs>
                <clipPath id="clip0_233_14512">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export const ArrowLeftGradient = () => {
    return (
        <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1641_14451)">
                <path
                    d="M20.5465 9.88586L18.6665 8.00586L10.6665 16.0059L18.6665 24.0059L20.5465 22.1259L14.4398 16.0059L20.5465 9.88586Z"
                    fill="url(#paint0_linear_1641_14451)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_1641_14451"
                    x1="10.6665"
                    y1="8.00586"
                    x2="24.9718"
                    y2="16.8394"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#02C3BD" />
                    <stop offset="1" stopColor="#4062BB" />
                </linearGradient>
                <clipPath id="clip0_1641_14451">
                    <rect width="32" height="32" fill="white" transform="translate(0 0.00585938)" />
                </clipPath>
            </defs>
        </svg>
    );
};
