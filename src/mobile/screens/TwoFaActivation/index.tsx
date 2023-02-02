import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '../../assets/Arrow';
import { Form } from 'react-bootstrap';
import { selectUserInfo } from 'src/modules';
import { useHistory } from 'react-router';

const TwoFaActivationMobileScreen: React.FC = () => {
    const history = useHistory();
    const user = useSelector(selectUserInfo);

    const handleActivateTwoFa = () => {
        user.otp ? history.push('/two-fa') : history.push('/two-fa-authentication');
    };

    const [state, setState] = React.useState(user.otp);
    const handleTwoFa = () => {
        setState(!state);
        window.location.reload()
    };
    return (
        <React.Fragment>
            <div className="mobile-container two-fa-mobile no-header pt-5 home-screen dark-bg-main">
                <div className="head-container mb-36 mt-50 d-flex flex-row gap-10 justifycontent-around">
                    <div onClick={()=>history.goBack()} className="cursor-pointer">
                        <ArrowLeft className={'back'} />
                    </div>
                    <h1 className="text-center text-md grey-text-accent font-bold">Two-factor Authentication</h1>
                </div>
                <div className="two-container">
                    <div className="card-fa d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column card-fa-content">
                            <h4 className="grey-text-accent text-ms font-bold mb-1">Two-Factor Authentication (2FA)</h4>
                            <h5 className="text-xxs grey-text">
                                To protect yout account, it is recommend to turn on at least one 2FA.
                            </h5>
                        </div>
                        <Form>
                            <Form.Check
                                type="switch"
                                id={`two-fa`}
                                label=""
                                onClick={handleActivateTwoFa}
                                onChange={handleTwoFa}
                                checked={state}
                                className="cursor-pointer"
                            />
                        </Form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export { TwoFaActivationMobileScreen };
