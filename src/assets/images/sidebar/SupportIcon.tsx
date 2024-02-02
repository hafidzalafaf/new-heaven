import * as React from 'react';

export const SupportIcon = ({ fillColor }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path
                d="M4.49999 7.125C4.49999 5.63316 5.09263 4.20242 6.14752 3.14752C7.20241 2.09263 8.63315 1.5 10.125 1.5C11.6168 1.5 13.0476 2.09263 14.1025 3.14752C15.1574 4.20242 15.75 5.63316 15.75 7.125C15.75 7.32391 15.671 7.51468 15.5303 7.65533C15.3897 7.79598 15.1989 7.875 15 7.875C14.8011 7.875 14.6103 7.79598 14.4697 7.65533C14.329 7.51468 14.25 7.32391 14.25 7.125C14.25 6.03098 13.8154 4.98177 13.0418 4.20818C12.2682 3.4346 11.219 3 10.125 3C9.03098 3 7.98177 3.4346 7.20818 4.20818C6.43459 4.98177 5.99999 6.03098 5.99999 7.125C5.99999 7.32391 5.92098 7.51468 5.78032 7.65533C5.63967 7.79598 5.44891 7.875 5.24999 7.875C5.05108 7.875 4.86032 7.79598 4.71966 7.65533C4.57901 7.51468 4.49999 7.32391 4.49999 7.125ZM17.625 11.25C17.1875 11.2495 16.7568 11.3588 16.3725 11.5678C16.2576 11.2124 16.0683 10.8856 15.817 10.6092C15.5658 10.3329 15.2584 10.1133 14.9156 9.96517C14.5727 9.81707 14.2021 9.74384 13.8287 9.75039C13.4552 9.75693 13.0875 9.8431 12.75 10.0031V7.125C12.75 6.42881 12.4734 5.76113 11.9811 5.26884C11.4889 4.77656 10.8212 4.5 10.125 4.5C9.4288 4.5 8.76112 4.77656 8.26884 5.26884C7.77656 5.76113 7.49999 6.42881 7.49999 7.125V14.625L7.14187 14.0503C6.79166 13.4485 6.21671 13.0104 5.54352 12.8325C4.87032 12.6546 4.15402 12.7514 3.55218 13.1016C2.95035 13.4518 2.51228 14.0267 2.33436 14.6999C2.15643 15.3731 2.25322 16.0894 2.60343 16.6912L5.35218 21.3787C5.39828 21.47 5.46257 21.5509 5.54109 21.6165C5.61961 21.682 5.7107 21.7308 5.80877 21.7598C5.90683 21.7889 6.0098 21.7975 6.11134 21.7853C6.21289 21.7731 6.31085 21.7402 6.39922 21.6887C6.48759 21.6372 6.5645 21.5682 6.62522 21.4859C6.68593 21.4036 6.72917 21.3098 6.75228 21.2101C6.77538 21.1105 6.77787 21.0072 6.75958 20.9066C6.74129 20.806 6.70262 20.7101 6.64593 20.625L3.89999 15.9375C3.8229 15.8095 3.7721 15.6673 3.75055 15.5194C3.729 15.3715 3.73714 15.2208 3.77449 15.0761C3.81184 14.9314 3.87766 14.7955 3.96809 14.6765C4.05853 14.5575 4.17177 14.4578 4.3012 14.383C4.43063 14.3083 4.57366 14.2601 4.72193 14.2412C4.8702 14.2224 5.02074 14.2333 5.16476 14.2732C5.30878 14.3132 5.44338 14.3815 5.56071 14.4741C5.67804 14.5667 5.77575 14.6817 5.84812 14.8125L5.86124 14.8341L7.61249 17.6466C7.69848 17.7853 7.82737 17.8922 7.97962 17.951C8.13187 18.0099 8.29916 18.0175 8.4561 17.9726C8.61304 17.9277 8.75106 17.8329 8.84922 17.7025C8.94738 17.5721 9.00032 17.4132 8.99999 17.25V7.125C8.99999 6.82663 9.11852 6.54048 9.3295 6.3295C9.54048 6.11853 9.82663 6 10.125 6C10.4234 6 10.7095 6.11853 10.9205 6.3295C11.1315 6.54048 11.25 6.82663 11.25 7.125V13.5C11.25 13.6989 11.329 13.8897 11.4697 14.0303C11.6103 14.171 11.8011 14.25 12 14.25C12.1989 14.25 12.3897 14.171 12.5303 14.0303C12.671 13.8897 12.75 13.6989 12.75 13.5V12.375C12.75 12.0766 12.8685 11.7905 13.0795 11.5795C13.2905 11.3685 13.5766 11.25 13.875 11.25C14.1734 11.25 14.4595 11.3685 14.6705 11.5795C14.8815 11.7905 15 12.0766 15 12.375V14.25C15 14.4489 15.079 14.6397 15.2197 14.7803C15.3603 14.921 15.5511 15 15.75 15C15.9489 15 16.1397 14.921 16.2803 14.7803C16.421 14.6397 16.5 14.4489 16.5 14.25V13.875C16.5 13.5766 16.6185 13.2905 16.8295 13.0795C17.0405 12.8685 17.3266 12.75 17.625 12.75C17.9234 12.75 18.2095 12.8685 18.4205 13.0795C18.6315 13.2905 18.75 13.5766 18.75 13.875V17.25C18.75 19.2759 18.0844 20.6531 18.0787 20.6644C17.9899 20.8423 17.9753 21.0482 18.0383 21.2368C18.1012 21.4255 18.2365 21.5814 18.4144 21.6703C18.5184 21.7229 18.6334 21.7502 18.75 21.75C18.8893 21.7501 19.0259 21.7114 19.1445 21.6382C19.2631 21.565 19.3589 21.4602 19.4212 21.3356C19.4559 21.2672 20.2509 19.6481 20.2509 17.25V13.875C20.2509 13.5302 20.183 13.1888 20.051 12.8702C19.919 12.5517 19.7256 12.2623 19.4818 12.0185C19.2379 11.7747 18.9484 11.5814 18.6298 11.4495C18.3112 11.3177 17.9698 11.2499 17.625 11.25Z"
                fill={fillColor}
            />
        </svg>
    );
};
