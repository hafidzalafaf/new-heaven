import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { History } from 'history';
import { RouterProps, withRouter } from 'react-router';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { setDocumentTitle } from '../../../helpers';
import { UsernameIcon, PasswordIcon, DocumentIcon } from '../../../assets/images/ProfileIcon';
interface ProfileSettingState {
    showTwoFaModal: boolean;
}

interface OwnProps {
    history: History;
}

type Props = RouterProps & IntlProps & OwnProps;

class ProfileSettingComponent extends React.Component<Props, ProfileSettingState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showTwoFaModal: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Profile Security');
    }

    public render() {
        return (
            <React.Fragment>
                <div className="profile-setting-screen dark-bg-accent pb-5">
                    <div className="header dark-bg-accent py-4 px-24 mb-24">
                        <h2 className="mb-0 text-xl white-text font-bold py-2">Profile Setting</h2>
                    </div>
                    <div className="px-24">
                        <h5 className="mb-0 text-xl white-text font-semibold py-2 mb-24">My Profile</h5>
                        <div className="row">
                            <div className="col-sm-11 col-lg-9">
                                <div className="box">
                                    <div className="d-flex align-items-start">
                                        <UsernameIcon className="img-avatar" />
                                        <div className="ml-4">
                                            <p className="d-flex text-sm white-text font-bold mb-1">
                                                Username
                                                <span className="text-sm grey-text-accent font-normal ml-2">
                                                    (Nusatech123)
                                                </span>
                                            </p>
                                            <span className="text-sm grey-text-accent font-normal">
                                                Set a customized nickname for your profile.
                                            </span>
                                            <div className="d-flex mt-3">
                                                <a
                                                    href="../../Screen/ForgotUsername/index.html"
                                                    className="btn pl-0 gradient-text text-sm font-bold">
                                                    Change
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="d-flex align-items-start">
                                        <PasswordIcon className="img-avatar" />
                                        <div className="ml-4">
                                            <p className="d-flex text-sm white-text font-bold mb-1">Password</p>
                                            <span className="text-sm grey-text-accent font-normal">
                                                Set or change your password
                                            </span>
                                            <div className="d-flex mt-3">
                                                <button
                                                    type="button"
                                                    className="btn pl-0 gradient-text text-sm font-bold"
                                                    data-toggle="modal"
                                                    data-target="#two-fa-google">
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="d-flex align-items-start">
                                        <DocumentIcon className="img-avatar" />
                                        <div className="ml-4">
                                            <p className="d-flex text-sm white-text font-bold mb-1">
                                                Document Validation
                                            </p>
                                            <span className="text-sm grey-text-accent font-normal">
                                                As part of our commitment to remain the most trusted cryptocurrency
                                                platform, all Identification Documents must be verified . We do not
                                                accept emailed copies of your identity documents for verification
                                                purposes.
                                            </span>
                                            <div className="d-flex mt-3">
                                                <a
                                                    href="../../Screen/Kyc/index.html"
                                                    className="btn pl-0 gradient-text text-sm font-bold">
                                                    Upload
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export const ProfileSetting = compose(
    injectIntl,
    withRouter,
    connect()
)(ProfileSettingComponent) as React.ComponentClass;
