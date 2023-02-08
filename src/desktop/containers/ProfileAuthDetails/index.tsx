import { History } from 'history';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { IntlProps } from '../../../';
import { isUsernameEnabled } from '../../../api';
import {
    entropyPasswordFetch,
    RootState,
    selectCurrentPasswordEntropy,
    selectUserInfo,
    User,
    selectUserActivity,
    UserActivityDataInterface,
} from '../../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
    toggle2faFetch,
    changePasswordReset,
} from '../../../modules/user/profile';
import { localeDate } from '../../../helpers';
import { ArrowDownIcon } from '../../../assets/images/ArrowDownIcon';

interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
    currentPasswordEntropy: number;
    userActivity: UserActivityDataInterface[];
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    toggle2fa: typeof toggle2faFetch;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
    changePasswordReset: typeof changePasswordReset;
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    code2FA: string;
    code2FAFocus: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & IntlProps & OnChangeEvent;

class ProfileAuthDetailsComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            code2FA: '',
            code2FAFocus: false,
        };
    }

    public componentWillReceiveProps(next: Props) {
        if (next.passwordChangeSuccess) {
            this.setState({ showChangeModal: false });
            this.props.changePasswordReset();
        }
    }

    public render() {
        const { user, userActivity } = this.props;

        return (
            <React.Fragment>
                <div className="profile-detail px-24 py-4 dark-bg-main mb-24">
                    <div className="d-flex align-items-center">
                        <img src="/img/avatar.png" className="img-profile-detail mr-3" alt="profile avatar detail" />
                        <div className="details">
                            <div className="d-flex align-items-center mb-2">
                                <h6 className="white-text font-bold text-ms mb-0 mr-3">
                                    {isUsernameEnabled() ? user.username : null}
                                </h6>
                                {user.level === 3 ? (
                                    <div className="badge badge-success test-xs font-normal white-text">verified</div>
                                ) : (
                                    <div className="badge badge-warning test-xs font-normal white-text">unverified</div>
                                )}
                            </div>
                            <div className="d-flex">
                                <div className="mr-3">
                                    <span className="text-xs grey-text font-normal ">User ID</span>
                                    <p className="text-xs white-text font-bold mb-0">{user.uid}</p>
                                </div>
                                <div className="mr-3">
                                    <span className="text-xs grey-text font-normal ">
                                        Last Login
                                        <ArrowDownIcon strokeColor={''} className={'rotate-90 arrow-profile'} />
                                    </span>
                                    <p className="text-xs white-text font-bold mb-0">
                                        {localeDate(userActivity[0]?.created_at, 'fullDate')}{' '}
                                    </p>
                                </div>
                                <div className="mr-3">
                                    <span className="text-xs grey-text font-normal ">
                                        Email
                                        <ArrowDownIcon strokeColor={''} className={'rotate-90 arrow-profile'} />
                                    </span>
                                    <p className="text-xs white-text font-bold mb-0">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
    userActivity: selectUserActivity(state),
});

const mapDispatchToProps = (dispatch) => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchCurrentPasswordEntropy: (payload) => dispatch(entropyPasswordFetch(payload)),
    changePasswordReset: () => dispatch(changePasswordReset()),
});

const ProfileAuthDetailsConnected = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent)
);
// tslint:disable-next-line:no-any
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export { ProfileAuthDetails };
