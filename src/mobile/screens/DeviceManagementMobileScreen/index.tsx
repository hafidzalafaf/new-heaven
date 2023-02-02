import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { useSelector } from 'react-redux';
import { useUserActivityFetch } from 'src/hooks';
import {
    RootState,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityNextPageExists,
} from 'src/modules';
import { DeviceIcon } from 'src/assets/images/ProfileIcon';
import { getUserAgent } from 'src/helpers';
import { NoData } from 'src/desktop/components';
import moment from 'moment';
import { PaginationMobile } from 'src/mobile/components';

const DeviceManagementMobileScreen: React.FC = () => {
    const userActivity = useSelector(selectUserActivity);
    const page = useSelector(selectUserActivityCurrentPage);
    const firstElemIndex = useSelector((state: RootState) => selectUserActivityFirstElemIndex(state, 5));
    const lastElemIndex = useSelector((state: RootState) => selectUserActivityLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectUserActivityNextPageExists(state, 5));
    const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
    useUserActivityFetch({ page: currentPageIndex, limit: 5 });
    const history = useHistory();

    const onClickPrevPage = () => {
        setCurrentPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setCurrentPageIndex(currentPageIndex + 1);
    };

    const renderDataDevice = (data) => {
        return data.map((item) => [
            <div className="d-flex justify-content-start align-items-stretch my-2">
                <DeviceIcon className="mr-2" />
                <p className="mb-0 grey-text-accent font-bold text-sm">{getUserAgent(item.user_agent)}</p>
            </div>,
            <div className="d-flex justify-content-between align-items-strech my-1">
                <p className="mb-0 grey-text-accent text-sm">Date :</p>
                <p className="mb-0 grey-text-accent text-sm">{moment(item.created_at).format('D MM YYYY - HH : mm')}</p>
            </div>,
            <div className="d-flex justify-content-between align-items-strech my-1">
                <p className="mb-0 grey-text-accent text-sm">Location:</p>
                <p className="mb-0 grey-text-accent text-sm">{item.user_ip_country}</p>
            </div>,
            <div className="d-flex justify-content-between align-items-strech my-1">
                <p className="mb-0 grey-text-accent text-sm">Recent Activity:</p>
                <p className="mb-0 grey-text-accent text-xs">{item.action}</p>
            </div>,
            <div className="d-flex justify-content-between align-items-strech my-1">
                <p className="mb-0 grey-text-accent text-sm">IP Address:</p>
                <p className="mb-0 grey-text-accent text-xs">{item.user_ip}</p>
            </div>,
            <hr />,
        ]);
    };

    return (
        <React.Fragment>
            <div className="mobile-container no-header dark-bg-main">
                <div className="head-container position-relative">
                    <div onClick={() => history.goBack()} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </div>
                    <h1 className="text-center text-md grey-text-accent font-bold">Device Management</h1>
                </div>
                <div className="content-container mt-5">
                    <p className="grey-text-accent font-bold text-xxs">
                        These are the devices currently allowed to access your account.
                    </p>
                </div>
                {userActivity.length === 0 ? <NoData text="No Data Yet" /> : renderDataDevice(userActivity)}
                {userActivity[0] && (
                    <PaginationMobile
                        firstElementIndex={firstElemIndex}
                        lastElementIndex={lastElemIndex}
                        page={page}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />
                )}
            </div>
        </React.Fragment>
    );
};
export { DeviceManagementMobileScreen };
