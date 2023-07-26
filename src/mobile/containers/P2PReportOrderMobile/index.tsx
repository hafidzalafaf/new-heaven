import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Loading } from 'src/components';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { InfoWarningIcon } from 'src/assets/images/P2PIcon';
import Select from 'react-select';
import { selectP2PCreateReportLoading, selectP2PCreateReportSuccess, orderReportCreate } from 'src/modules';
import { UploadIcon } from 'src/assets/images/P2PIcon';
export interface P2PReportOrderMobileProps {
    detail: any;
    order_number: string;
    showReport: boolean;
    handleShowReport: () => void;
    handleCloseReport: () => void;
}

export const P2PReportOrderMobile: React.FunctionComponent<P2PReportOrderMobileProps> = (props) => {
    const { detail, order_number, showReport, handleShowReport, handleCloseReport } = props;

    const dispatch = useDispatch();
    const location: { state: { side: string } } = useLocation();

    const createReportSuccess = useSelector(selectP2PCreateReportSuccess);
    const createReportLoading = useSelector(selectP2PCreateReportLoading);

    const [reason, setReason] = React.useState([]);
    const [text_message, setTextMessage] = React.useState('');
    const [upload_payment, setUplodPayment] = React.useState(null);
    const [fileName, setFileName] = React.useState('');

    React.useEffect(() => {
        setReason([]);
        setTextMessage('');
        setUplodPayment(null);
    }, [createReportSuccess]);

    const handleChecked = (e) => {
        setReason([
            ...reason,
            {
                key: e.target.name,
                message: e.target.name !== 'payment' ? e.target.value : e.target.files[0].name,
            },
        ]);
        if (!e.target.checked) {
            setReason(reason.filter((item) => item.message !== e.target.id));
        }
    };

    const handleReport = () => {
        const formData = new FormData();
        formData.append('reason', JSON.stringify(reason));
        formData.append('text_message', text_message);
        formData.append('upload_payment', upload_payment);

        dispatch(
            orderReportCreate({
                FormData: formData,
                order_number: order_number,
            })
        );
    };

    return (
        <div className="w-100">
            <div className="position-fixed nav-chat-info-top dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-24 w-100">
                    <div className="d-flex align-items-center gap-8">
                        <p className="m-0 p-0 text-ms font-extrabold grey-text-accent">Report</p>
                    </div>
                    <span onClick={handleCloseReport} className="chat-close position-absolute cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>

                <div className="order-step-info-warning d-flex align-items-center justify-content-between p-16 gap-8 radius-sm mb-24">
                    <p className="m-0 p-0 grey-text-accent text-xxs ">
                        Malicious activity reports will freeze the account.
                    </p>
                    <InfoWarningIcon />
                </div>

                <form className="d-flex flex-column gap-16 w-100">
                    <div className="mb-24">
                        <label className="m-0 p-0 mb-16 white-text text-ms">QR Code (Optional)</label>
                        <input
                            id="payment"
                            type="file"
                            name="payment"
                            onChange={(e) => {
                                setUplodPayment(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                            }}
                            placeholder="Enter Full Name"
                            className="custom-input-add-payment w-100 white-text d-none"
                        />
                        <label
                            htmlFor="payment"
                            className="d-flex justify-content-center align-content-center custom-input-file cursor-pointer dark-bg-accent border-1 p-16 radius-lg mb-16">
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <UploadIcon />
                                <p className="m-0 p-0 text-xxs grey-text">{fileName ? fileName : 'Upload'}</p>
                            </div>
                        </label>
                        <p className="m-0 p-0 text-right grey-text-accent text-xxs font-bold">
                            JPG,SVG,PNG, GIF and PDF, Maximum file size is 20MB.
                        </p>
                    </div>

                    <div className="mb-16 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="Didn’t Not Receive My Stable Coin"
                            name="selected"
                            onChange={handleChecked}
                            checked={reason.find((item) => item.message.includes('Didn’t Not Receive My Stable Coin'))}
                            value={'Didn’t Not Receive My Stable Coin'}
                            className="m-0 p-0 check-with-label"
                        />
                        <label htmlFor="Didn’t Not Receive My Stable Coin" className="m-0 p-0 grey-text-accent text-sm">
                            Didn’t Not Receive My Stable Coin
                        </label>
                    </div>

                    <div className="mb-16 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="Transaction Taking To Long"
                            name="selected"
                            onChange={handleChecked}
                            checked={reason.find((item) => item.message.includes('Transaction Taking To Long'))}
                            value={'Transaction Taking To Long'}
                            className="m-0 p-0"
                        />
                        <label htmlFor="Transaction Taking To Long" className="m-0 p-0 grey-text-accent text-sm">
                            Transaction Taking To Long
                        </label>
                    </div>

                    <div className="mb-24 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="Transaction Ammount Is Different to Order Value"
                            name="selected"
                            onChange={handleChecked}
                            checked={reason.find((item) =>
                                item.message.includes('Transaction Ammount Is Different to Order Value')
                            )}
                            value={'Transaction Ammount Is Different to Order Value'}
                            className="m-0 p-0"
                        />
                        <label
                            htmlFor="Transaction Ammount Is Different to Order Value"
                            className="m-0 p-0 grey-text-accent text-sm">
                            Transaction Ammount Is Different to Order Value
                        </label>
                    </div>

                    <div className="mb-24">
                        <label className="m-0 p-0 mb-16 white-text text-ms">Your Message</label>
                        <textarea
                            placeholder=""
                            name="message"
                            value={text_message}
                            onChange={(e) => setTextMessage(e.target.value)}
                            className="form-message border-1 radius-lg p-16 white-text w-100"></textarea>
                    </div>

                    <button
                        type="button"
                        onClick={handleReport}
                        disabled={(!reason && !reason[0]) || !text_message || createReportLoading}
                        className="btn-primary w-100">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
