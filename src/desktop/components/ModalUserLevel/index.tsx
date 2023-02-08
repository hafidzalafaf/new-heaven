import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectUserInfo } from 'src/modules';
import { CircleCloseDangerLargeIcon } from 'src/assets/images/CircleCloseIcon';
import { Modal } from '../Modal';
import { Link } from 'react-router-dom';

export interface ModalUserLevelProps {
    show: boolean;
    title: string;
    onClose: () => void;
}

export const ModalUserLevel: React.FunctionComponent<ModalUserLevelProps> = (props) => {
    const { show, title, onClose } = props;
    const intl = useIntl();
    const history = useHistory();
    const { formatMessage } = useIntl();
    const user = useSelector(selectUserInfo);

    const renderHeaderModalUserLevel = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <CircleCloseDangerLargeIcon />
                </div>
            </React.Fragment>
        );
    };

    const renderModalUserLevel = () => {
        return (
            <React.Fragment>
                <h1 className="white-text text-lg mb-24 text-center ">{title} Locked</h1>
                <p className="grey-text text-ms font-extrabold mb-24 text-center">
                    {user?.level == 1
                        ? `For ${title?.toLowerCase()} you must verified your phone number and document first`
                        : `For ${title?.toLowerCase()} you must verified your document first`}
                </p>
                <div className="d-flex justify-content-center align-items-center w-100 mb-0 gap-8">
                    <Link className="w-50" to={`${user?.level == 1 ? '/profile' : '/profile/kyc'}`}>
                        <button type="button" className="btn btn-primary">
                            {user?.level == 1 ? 'Verify Phone Number' : 'Verify Document'}
                        </button>
                    </Link>

                    <button onClick={onClose} type="button" className="btn-secondary btn-outline w-50">
                        Close
                    </button>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <Modal show={show} header={renderHeaderModalUserLevel()} content={renderModalUserLevel()} />
        </React.Fragment>
    );
};
