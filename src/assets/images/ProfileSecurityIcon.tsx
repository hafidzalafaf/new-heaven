import * as React from 'react';

interface ProfileSecurityProps {
    className?: string;
}

export const GoogleIcon: React.FC<ProfileSecurityProps> = (props: ProfileSecurityProps) => {
    return (
        <svg
            width={39}
            height={40}
            viewBox="0 0 39 40"
            className={props.className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20 3C10.3359 3 2.5 10.8359 2.5 20.5C2.5 30.1641 10.3359 38 20 38C29.6641 38 37.5 30.1641 37.5 20.5C37.5 10.8359 29.6641 3 20 3ZM26.5234 27.75C24.9375 29.2109 22.7734 30.0703 20.1914 30.0703C16.4531 30.0703 13.2188 27.9258 11.6445 24.8008C10.9961 23.5078 10.625 22.0469 10.625 20.5C10.625 18.9531 10.9961 17.4922 11.6445 16.1992C13.2188 13.0703 16.4531 10.9258 20.1914 10.9258C22.7695 10.9258 24.9336 11.875 26.5938 13.418L23.8516 16.1641C22.8594 15.2148 21.5977 14.7344 20.1953 14.7344C17.7031 14.7344 15.5938 16.418 14.8398 18.6797C14.6484 19.2539 14.5391 19.8672 14.5391 20.5C14.5391 21.1328 14.6484 21.7461 14.8398 22.3203C15.5938 24.582 17.7031 26.2656 20.1914 26.2656C21.4805 26.2656 22.5742 25.9258 23.4297 25.3516C24.4453 24.6719 25.1172 23.6602 25.3398 22.4609H20.1914V18.7578H29.2031C29.3164 19.3867 29.375 20.0391 29.375 20.7148C29.375 23.6328 28.332 26.082 26.5234 27.75Z"
                fill="url(#paint0_linear_198_6582)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_198_6582"
                    x1="2.5"
                    y1={3}
                    x2="37.5"
                    y2={38}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#02C3BD" />
                    <stop offset={1} stopColor="#4062BB" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const PhoneIcon: React.FC<ProfileSecurityProps> = (props: ProfileSecurityProps) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M25.4125 26.85L28.2125 24.05C28.5897 23.6775 29.0668 23.4226 29.586 23.3161C30.1053 23.2096 30.6442 23.2561 31.1375 23.45L34.55 24.8125C35.0486 25.0148 35.476 25.3602 35.7785 25.8051C36.0811 26.25 36.2451 26.7745 36.25 27.3125V33.5625C36.2471 33.9285 36.1702 34.2901 36.0239 34.6255C35.8775 34.961 35.6648 35.2634 35.3986 35.5144C35.1323 35.7655 34.818 35.9601 34.4745 36.0865C34.131 36.213 33.7656 36.2686 33.4 36.25C9.48755 34.7625 4.66255 14.5125 3.75005 6.76249C3.70769 6.38191 3.74639 5.99668 3.86361 5.63213C3.98082 5.26758 4.1739 4.93198 4.43013 4.64741C4.68636 4.36284 4.99994 4.13575 5.35024 3.98107C5.70054 3.82639 6.07962 3.74764 6.46255 3.74999H12.5C13.0388 3.75158 13.5648 3.91432 14.0103 4.21728C14.4558 4.52023 14.8005 4.94954 15 5.44999L16.3625 8.86249C16.5629 9.35383 16.614 9.89329 16.5095 10.4135C16.405 10.9337 16.1495 11.4116 15.775 11.7875L12.975 14.5875C12.975 14.5875 14.5875 25.5 25.4125 26.85Z"
                fill="url(#paint0_linear_207_8575)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_207_8575"
                    x1="3.7334"
                    y1="3.74994"
                    x2="36.2369"
                    y2="36.2666"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#02C3BD" />
                    <stop offset="1" stopColor="#4062BB" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const MailIcon: React.FC<ProfileSecurityProps> = (props: ProfileSecurityProps) => {
    return (
        <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M33.333 6.66666H6.66634C4.83301 6.66666 3.34967 8.16666 3.34967 9.99999L3.33301 30C3.33301 31.8333 4.83301 33.3333 6.66634 33.3333H33.333C35.1663 33.3333 36.6663 31.8333 36.6663 30V9.99999C36.6663 8.16666 35.1663 6.66666 33.333 6.66666ZM33.333 13.3333L19.9997 21.6667L6.66634 13.3333V9.99999L19.9997 18.3333L33.333 9.99999V13.3333Z"
                fill="url(#paint0_linear_198_6718)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_198_6718"
                    x1="3.33301"
                    y1="6.66666"
                    x2="29.3493"
                    y2="39.187"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#02C3BD" />
                    <stop offset={1} stopColor="#4062BB" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const KeyIcon: React.FC<ProfileSecurityProps> = (props: ProfileSecurityProps) => {
    return (
        <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20.0003 3.33334C15.4053 3.33334 11.667 7.07167 11.667 11.6667V16.6667H10.0003C9.11627 16.6667 8.26842 17.0179 7.6433 17.643C7.01818 18.2681 6.66699 19.1159 6.66699 20V33.3333C6.66699 34.2174 7.01818 35.0652 7.6433 35.6904C8.26842 36.3155 9.11627 36.6667 10.0003 36.6667H30.0003C30.8844 36.6667 31.7322 36.3155 32.3573 35.6904C32.9825 35.0652 33.3337 34.2174 33.3337 33.3333V20C33.3337 19.1159 32.9825 18.2681 32.3573 17.643C31.7322 17.0179 30.8844 16.6667 30.0003 16.6667H28.3337V11.6667C28.3337 7.07167 24.5953 3.33334 20.0003 3.33334ZM15.0003 11.6667C15.0003 8.91 17.2437 6.66667 20.0003 6.66667C22.757 6.66667 25.0003 8.91 25.0003 11.6667V16.6667H15.0003V11.6667ZM21.667 29.5383V33.3333H18.3337V29.5383C17.751 29.2047 17.2831 28.7022 16.9917 28.0973C16.7003 27.4923 16.5991 26.8132 16.7015 26.1496C16.8038 25.486 17.1049 24.869 17.5649 24.3799C18.025 23.8908 18.6225 23.5527 19.2787 23.41C19.766 23.3022 20.2714 23.3053 20.7574 23.4188C21.2434 23.5324 21.6978 23.7536 22.087 24.0661C22.4761 24.3787 22.7902 24.7746 23.0059 25.2247C23.2217 25.6748 23.3337 26.1675 23.3337 26.6667C23.3327 27.2496 23.1781 27.8219 22.8855 28.3261C22.5929 28.8302 22.1726 29.2483 21.667 29.5383Z"
                fill="url(#paint0_linear_198_6855)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_198_6855"
                    x1="6.66699"
                    y1="3.33334"
                    x2="39.1873"
                    y2="29.3496"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#02C3BD" />
                    <stop offset={1} stopColor="#4062BB" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const CheckIcon: React.FC<ProfileSecurityProps> = (props: ProfileSecurityProps) => {
    return (
        <svg
            width={16}
            height={16}
            className={props.className}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_i_189_6402)">
                <circle cx={8} cy={8} r={8} transform="rotate(-90 8 8)" fill="#24AE8F" />
            </g>
            <path
                d="M5.19389 8.28368L6.54627 10.0431C6.58233 10.0914 6.6287 10.1311 6.68202 10.1593C6.73533 10.1874 6.79425 10.2033 6.85449 10.2058C6.9151 10.2092 6.97572 10.1994 7.03223 10.1773C7.08874 10.1551 7.13981 10.121 7.18197 10.0773L10.9255 6.20917"
                stroke="#F2F0FF"
                strokeWidth="1.71429"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <filter
                    id="filter0_i_189_6402"
                    x={0}
                    y={0}
                    width={16}
                    height={16}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_189_6402" />
                </filter>
            </defs>
        </svg>
    );
};
