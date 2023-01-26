import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../../';
import { Table } from '../../../components';
import { Pagination } from '../../components';
import { DeviceIcon } from '../../../assets/images/ProfileIcon';
import { getUserAgent, localeDate } from '../../../helpers';
import {
    getUserActivity,
    RootState,
    selectTotalNumber,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityLoading,
    selectUserActivityNextPageExists,
    selectUserActivityPageCount,
    UserActivityDataInterface,
} from '../../../modules';
import { NoData } from '../../components';

interface ReduxProps {
    loading: boolean;
    total: number;
    page: number;
    pageCount: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    userActivity: UserActivityDataInterface[];
}

interface DispatchProps {
    getUserActivity: typeof getUserActivity;
}

const paginationLimit = 5;

type Props = ReduxProps & DispatchProps & IntlProps;

class ProfileAccountActivityComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.getUserActivity({ page: 0, limit: paginationLimit });
    }

    public render() {
        const { loading, userActivity } = this.props;
        const emptyMsg = this.props.intl.formatMessage({ id: 'page.noDataToShow' });

        return (
            <div className="pg-profile-page__activity">
                <div className={`pg-history-elem ${userActivity.length ? '' : 'pg-history-empty'}`}>
                    {userActivity.length ? this.renderContent() : null}
                    {!userActivity.length && !loading ? <p className="pg-history-elem__empty">{emptyMsg}</p> : null}
                </div>
            </div>
        );
    }

    public renderContent = () => {
        const { total, firstElemIndex, lastElemIndex, page, nextPageExists, userActivity } = this.props;

        return (
            <React.Fragment>
                <div className="px-24">
                    <div className="row">
                        <div className="col-12">
                            <h6 className="text-md font-semibold white-text">Login Device and Ip Address</h6>
                            <Table header={this.getHeaders()} data={this.getActivityData(userActivity)} />
                            <Pagination
                                firstElemIndex={firstElemIndex}
                                lastElemIndex={lastElemIndex}
                                total={total}
                                page={page}
                                nextPageExists={nextPageExists}
                                onClickPrevPage={this.onClickPrevPage}
                                onClickNextPage={this.onClickNextPage}
                            />
                            {userActivity.length < 1 && <NoData text="No Data Yet" />}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    private getHeaders = () => {
        return ['Trusted Device', 'Date', 'Recent Acticity', 'IP Address'];
    };

    private getActivityData(userData: UserActivityDataInterface[]) {
        return userData.map((item) => {
            return [
                <div className="d-flex align-items-center">
                    <span className="mr-2">
                        <DeviceIcon />
                    </span>
                    <p className="mb-0 text-sm grey-text-accent">{getUserAgent(item.user_agent)}</p>
                </div>,
                <p className="mb-0 text-sm grey-text-accent">{localeDate(item.created_at, 'fullDate')}</p>,
                <p className="mb-0 text-sm grey-text-accent">{this.getResultOfUserAction(item.action)}</p>,
                <p className="mb-0 text-sm grey-text-accent">{item.user_ip}</p>,
            ];
        });
    }

    private renderResult(result: string) {
        const className = classnames({
            'pg-profile-page__activity-result-succeed':
                result === this.props.intl.formatMessage({ id: 'page.body.profile.content.result.succeed' }),
            'pg-profile-page__activity-result-failed':
                result === this.props.intl.formatMessage({ id: 'page.body.profile.content.result.failed' }) ||
                result === this.props.intl.formatMessage({ id: 'page.body.profile.content.result.denied' }),
        });

        return <span className={className}>{result}</span>;
    }

    private getResultOfUserAction = (value: string) => {
        switch (value) {
            case 'login':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.login' });
            case 'logout':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.logout' });
            case 'request QR code for 2FA':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.request2fa' });
            case 'enable 2FA':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.enable2fa' });
            case 'login::2fa':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.login.2fa' });
            case 'request password reset':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.requestPasswordReset' });
            case 'password reset':
                return this.props.intl.formatMessage({ id: 'page.body.profile.content.action.passwordReset' });
            default:
                return value;
        }
    };

    private onClickPrevPage = () => {
        const { page } = this.props;
        this.props.getUserActivity({ page: Number(page) - 1, limit: paginationLimit });
    };

    private onClickNextPage = () => {
        const { page } = this.props;
        this.props.getUserActivity({ page: Number(page) + 1, limit: paginationLimit });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userActivity: selectUserActivity(state),
    loading: selectUserActivityLoading(state),
    total: selectTotalNumber(state),
    page: selectUserActivityCurrentPage(state),
    pageCount: selectUserActivityPageCount(state, paginationLimit),
    firstElemIndex: selectUserActivityFirstElemIndex(state, paginationLimit),
    lastElemIndex: selectUserActivityLastElemIndex(state, paginationLimit),
    nextPageExists: selectUserActivityNextPageExists(state, paginationLimit),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    getUserActivity: (params) => dispatch(getUserActivity(params)),
});

export const ProfileDeviceTable = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ProfileAccountActivityComponent)
) as any;
