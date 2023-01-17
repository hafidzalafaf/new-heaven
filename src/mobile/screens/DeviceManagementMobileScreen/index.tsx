import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { useSelector, useDispatch } from 'react-redux';
import { useUserActivityFetch } from 'src/hooks';
import { selectCurrentPage, selectUserActivity } from 'src/modules';







const DeviceManagementMobileScreen: React.FC = () => {
    const userActivity = useSelector(selectUserActivity);
    const page = useSelector(selectCurrentPage);
    const [currentPage, setCurrentPage] = React.useState(0);
    useUserActivityFetch({page: currentPage});
    const dispatch = useDispatch();
    const history = useHistory();

    console.log('userActivity', userActivity);

    return (
    <>
    <div className='mobile-container no-header dark-bg-main'>
    <div className="head-container position-relative">
                    <div onClick={()=> history.goBack()} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </div>
                    <h1 className="text-center text-md grey-text-accent font-bold">Device Management</h1>
                </div>
    </div>
    </>
);}
export { DeviceManagementMobileScreen };