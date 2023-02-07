import * as React from 'react';
import { selectUserInfo, alertPush } from 'src/modules';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '../../assets/Arrow';
import { Table } from '../../../components';
import { copy } from '../../../helpers';
import { ReferralIcon } from '../../assets/ReferralGift';
import { CopyableTextField } from '../../../components';
import { useSelector, useDispatch } from 'react-redux';

const ReferralMobileScreen: React.FC = () => {
    const dispatch = useDispatch();

    const user = useSelector(selectUserInfo);

    const referralLink = `${window.document.location.origin}/signup?refid=${user && user.uid}`;
    const referralCode = user && user.uid;

    const doCopyReferralCode = () => {
        copy('referral-code-mobile');
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
    };

    const referral = [
        { register: '20-12-2022', email: 'tester@nusatech.id', username: 'tester', level: 'level 1', status: 'active' },
    ];

    const getTableData = (data) => {
        return data.map((item) => [
            <p className="grey-text text-xs">{item.register}</p>,
            <p className="grey-text text-xs">{item.email}</p>,
            <p className="grey-text text-xs">{item.username}</p>,
            <p className="grey-text text-xs">{item.level}</p>,
            <p className="grey-text text-xs">{item.status}</p>,
        ]);
    };

    const getTableHeaders = () => {
        return [
            <p className="grey-text text-xs">Register at</p>,
            <p className="grey-text text-xs">Email</p>,
            <p className="grey-text text-xs">Username</p>,
            <p className="grey-text text-xs">Level Verification</p>,
            <p className="grey-text text-xs">Status</p>,
        ];
    };

    console.log(referralLink);
    console.log('JOSS');

    return (
        <React.Fragment>
            <div className="mobile-container referral-mobile-screen no-header home-screen dark-bg-main">
                <div className="head-container position-relative">
                    <Link to={'/profile'} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </Link>
                    <h1 className="text-center text-md grey-text-accent font-bold">My Referral</h1>
                </div>
                <div className="mt-5">
                    <h6 className="text-ms grey-text-accent font-bold">Referral Bonus</h6>
                    <div className="d-flex align-items-center card-referral mb-24 w-100">
                        <div className=" mr-3">
                            <ReferralIcon />
                        </div>
                        <div className="card-referral-desc">
                            <h1 className="text-ms grey-text-accent font-bold">
                                Total rewards : <span>0.00USDT</span>
                            </h1>
                            <p className="text-sm grey-text mb-0">
                                Invite your friend and earn 50% commission on their exchange transaction, Copy link
                                bellow and share referral link to your friends
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <fieldset onClick={doCopyReferralCode}>
                        <CopyableTextField value={referralLink} className="ml-3 w-100" fieldId="referral-code-mobile" />
                    </fieldset>
                </div>
                <div className="table-mobile-wrapper">
                    <Table header={getTableHeaders()} data={getTableData(referral)} />
                </div>
            </div>
        </React.Fragment>
    );
};

export { ReferralMobileScreen };
