import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab, Dropdown } from 'react-bootstrap';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect, NoData } from '../../../desktop/components';
import { Loading, Table } from '../../../components';
import { HideIcon, GreyCheck, ActiveCheck, VerificationIcon, MobileMoreArrow } from '../../../assets/images/P2PIcon';
import { Link, useHistory } from 'react-router-dom';
import { orderFetch, selectP2POrder, selectP2POrderLoading, p2pFiatFetch, selectP2PFiatsData, selectP2PUserAccountOffer, p2pOfferFetch, p2pUserOfferFetch, selectP2PUserAccountOfferCancelSuccess } from 'src/modules';
import { capitalizeFirstLetter } from 'src/helpers';
import './OrderP2PTableMobile.pcss'

export const OfferP2PTableMobile = ({type, data, loading, side=''}) => {

    function renderContent (){
        switch(type){
            case 'offer' :
                return <FilterredItem data={data}/>;
            case 'detail' :
                return <FilterredItemDetail data={data}/>;
            default:
                return null;
        }
        
    }

    const FilterredItem = ({data}) => {
       return (
        <React.Fragment>
        { data[0]?
        data?.map((item)=>
            <div className='d-flex flex-column com-mobile-card-order-list gap-20 border-bottom border-white p-2 grey-text'>

                <div className='d-flex flex-row justify-content-between my-1'>
                    <div>
                    <span className={item?.side === `buy` ? `contrast-text` : `danger-text`}>{capitalizeFirstLetter(item?.side)} </span>
                    <span className='grey-text-accent font-bold'>{item?.currency?.name?.toUpperCase()}</span>
                    </div>

                    <Link to={`/p2p/offer/${item?.offer_number}`}>
                        <span className={item?.state === 'success' ? `gradient-text` : item?.state.includes('cancel') ? `danger-text` : ``}>{capitalizeFirstLetter(item?.state)}</span>
                        <MobileMoreArrow className={''}/>
                    </Link>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Coin</span>
                    <div className='d-flex flex-row align-items-center'>
                        <img 
                            height={24}
                            width={24}
                            src={item?.fiat.icon_url}
                            alt={item?.fiat.name}
                        />
                        <span className='grey-text-accent font-bold ml-1'>{item?.fiat.name}</span>
                    </div>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Date</span>
                    <span>{moment(item?.created_at).format('DD/MM/YYYY')}</span>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Amount</span>
                    <span>{item?.price}</span>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Crypto Amount</span>
                    <span>{item?.amount}</span>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Order ID</span>
                    <span>{item?.order_number}</span>
                </div>
                <button className='btn-secondary radius-lg my-2'>Cancel</button>
            </div>
        )
        : <NoData text='No Offer Found'/>
        }
    </React.Fragment>
    )}

    const FilterredItemDetail = ({data}) => {
        return (
        <React.Fragment>
        { data[0] ?
        data?.map((item)=>
            <div className='d-flex flex-column com-mobile-card-order-list gap-20 border-bottom border-grey p-2 grey-text'>

                <div className='d-flex flex-row justify-content-between my-1'>
                    <div>
                    <span className={side === `buy` ? `contrast-text` : `danger-text`}>{capitalizeFirstLetter(side)} </span>
                    <span className='grey-text-accent font-bold'>{item?.currency?.name?.toUpperCase()}</span>
                    </div>

                    <Link to={`/p2p/offer/${item?.offer_number}`}>
                        <span className={item?.state === 'success' ? `gradient-text` : item?.state.includes('cancel') ? `danger-text` : ``}>{capitalizeFirstLetter(item?.state)}</span>
                        <MobileMoreArrow className={''}/>
                    </Link>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Coin</span>
                    <div className='d-flex flex-row align-items-center'>
                        <img 
                            height={24}
                            width={24}
                            src={item?.fiat.icon_url}
                            alt={item?.fiat.name}
                        />
                        <span className='grey-text-accent font-bold ml-1'>{item?.fiat.name}</span>
                    </div>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Date</span>
                    <span>{moment(item?.created_at).format('DD/MM/YYYY')}</span>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Amount</span>
                    <span>{item?.price}</span>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Crypto Amount</span>
                    <span>{item?.amount}</span>
                </div>
                <div className='d-flex flex-row justify-content-between my-1'>
                    <span>Order ID</span>
                    <span>{item?.order_number}</span>
                </div>
            </div>
        )
        : <NoData text='No Offer Found' />
        }
    </React.Fragment>
    )}

    return (
        <React.Fragment>
            <div className="com-order-p2p-table">
                <div className="d-flex justify-content-between align-items-start mb-24">
                    <div className="position-relative w-100">
                    {loading ? (
                                    <Loading />
                                ) : (
                                    renderContent()
                                )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
