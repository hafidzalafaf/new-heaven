import * as React from 'react';
import {
    VerificationIcon,
    ShareIcon,
    CheckFillIcon,
    LikeIcon,
    UnLikeIcon,
    RenameIcon,
} from '../../../assets/images/P2PIcon';
import { CardP2PUserInfo } from '../../../desktop/components';
import { useSelector } from 'react-redux';
import { p2pProfileFetch, P2PProfileFetchInterface, selectP2PProfile } from 'src/modules/user/p2pProfile';
import { FormControl, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { p2pPaymentUserFetch, selectP2PPaymentUser, p2pProfileChangeUsername, selectP2PProfileChangeUsernameSuccess } from 'src/modules';
export const P2PUserInfo: React.FC = () => {
    const dispatch = useDispatch();
    const [showChangeUsernameModal, setShowChangeUsernameModal] = React.useState(false);



    const userP2P: P2PProfileFetchInterface = useSelector(selectP2PProfile);
    const userP2PPayment = useSelector(selectP2PPaymentUser)
    const changeUsernameSuccess = useSelector(selectP2PProfileChangeUsernameSuccess);
    const [username, setUsername] = React.useState(userP2P?.trader_name);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
        dispatch(p2pPaymentUserFetch());
    }, [dispatch, changeUsernameSuccess]);

    const changeUsername = () => {
        const payload = {
            username,
        };
        dispatch(p2pProfileChangeUsername(payload));
        setShowChangeUsernameModal(false);
    }

    const ModalChangeName = () => {
        return (
            <form onSubmit={changeUsername} className='bg-black p-10 pt-20' hidden={!showChangeUsernameModal}>
                <div className='d-flex justify-content-between'>
                    <h6 className='text-white my-20'>Set Nickname</h6>
                    <svg onClick={()=> setShowChangeUsernameModal(false)} className='cursor-pointer' width="20px" height="20px" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#606060"/>
                    </svg>
                </div>
                <p className='text-secondary'>It is recommended not to use your real name. <br/> Nickname can only be modified after KYC level 3.</p>
                <label className='text-white'>Nickname</label>
                <div className='d-flex flex-row justify-content-between modal-input border border-white rounded-lg'>
                    <FormControl
                    key='username'
                    type='text'
                    placeholder='Enter your nickname'
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                    autoFocus={true}
                    maxLength={20}
                    className='bg-transparent border-0 border-bottom border-white text-white w-70'
                    />
                    <label className='text-char'>{username.length}/20</label>
                </div>
                <div className='text-center cursor-pointer btn-primary' onClick={changeUsername}>OK</div>
            </form>
        )
    }

    return (
        <React.Fragment>
            <div className="container-p2p-user-info">
                <Modal show={showChangeUsernameModal}>
                    <ModalChangeName />
                </Modal>
                <div className="d-flex justify-content-start align-items-center user-info-header-container gap-8 mb-16">
                    <div className="ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold">
                        {userP2P?.trader_name ? userP2P?.trader_name?.slice(0, 1).toUpperCase() : userP2P?.member?.email?.slice(0, 1).toUpperCase()}
                    </div>
                    <p className="m-0 p-0 text-ms font-extrabold grey-text-accent">{userP2P?.trader_name ? userP2P?.trader_name : userP2P?.member?.email}</p>
                    <RenameIcon
                        onClick={() => setShowChangeUsernameModal(!showChangeUsernameModal)}
                        className="cursor-pointer"
                    />
                    <div className="d-flex align-items-center gap-4 mr-12">
                        <VerificationIcon />

                        <p className="m-0 p-0 grey-text text-xxs font-semibold">Verified Merchant</p>
                    </div>

                    <div className="cursor-pointer">
                        <ShareIcon />
                    </div>
                </div>

                <div className="d-flex align-items-center gap-16 mb-16">
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">Email</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">SMS</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">KYC</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">Address</p>
                    </div>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-16 mb-16">
                    <CardP2PUserInfo title="Positive Feedback" type="feedback" percent="90%" amount="1,419" />

                    <div className="d-flex flex-column justify-content-center gap-8">
                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <div className="progress-bar">
                                <div className="progress" style={{ width: '80%' }} />
                            </div>
                            <LikeIcon />
                            <p className="m-0 p-0 grey-text text-sm">1299</p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <div className="progress-bar">
                                <div className="progress" style={{ width: '20%' }} />
                            </div>
                            <UnLikeIcon />
                            <p className="m-0 p-0 grey-text text-sm">120</p>
                        </div>
                    </div>

                    <CardP2PUserInfo title="All Trade" type="all trade" amount="1,419" />
                    <CardP2PUserInfo title="30d Trade" type="trade" time="713 Time(s)" />
                    <CardP2PUserInfo title="30d Completion Rate" type="completion" percent="90%" />
                    <CardP2PUserInfo title="Avg. Release Time" type="release" minutes="4.50 Minute(s)" />
                    <CardP2PUserInfo title="30d Pay Time" type="pay" minutes="4.50 Minute(s)" />
                </div>
            </div>
        </React.Fragment>
    );
};
