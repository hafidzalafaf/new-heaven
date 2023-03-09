import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Loading } from 'src/components';

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
        <React.Fragment>
            <p>a</p>
        </React.Fragment>
    );
};
