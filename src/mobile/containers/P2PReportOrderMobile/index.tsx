import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Loading } from 'src/components';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';

export interface P2PReportOrderMobileProps {
    // detail?: any;
    // order_number?: string;
    // showChat?: boolean;
    // timeLeft: number;
    // days: number;
    // hours: number;
    // minutes: number;
    // seconds: number;
    // handleExpandChat?: () => void;
    // handleModalReport?: () => void;
    // handleMakePayment?: () => void;
}

export const P2PReportOrderMobile: React.FunctionComponent<P2PReportOrderMobileProps> = (props) => {
    // const {
    //     detail,
    //     order_number,
    //     showChat,
    //     timeLeft,
    //     days,
    //     hours,
    //     minutes,
    //     seconds,
    //     handleExpandChat,
    //     handleModalReport,
    //     handleMakePayment,
    // } = props;

    const location: { state: { side: string } } = useLocation();
    const side = location.state?.side;

    return (
        <div className="w-100">
            <div className="position-fixed nav-chat-info-top dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-24 w-100">
                    <div className="d-flex align-items-center gap-8">
                        <p className="m-0 p-0 text-ms font-extrabold grey-text-accent">Report</p>
                    </div>
                    <span
                        // onClick={handleExpandChat}
                        className="chat-close position-absolute cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
            </div>
        </div>
    );
};
