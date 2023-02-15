import * as React from 'react';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { useHistory } from 'react-router-dom';
import {
    useDocumentTitle,
    useWalletsFetch,
    useUserOrdersHistoryFetch,
    useMarketsFetch,
    useHistoryFetch,
} from '../../../hooks';
import {
    selectCurrencies,
    Currency,
    RootState,
    selectCurrentPage,
    selectFirstElemIndex,
    selectLastElemIndex,
    selectNextPageExists,
    selectHistory,
    selectMarkets,
} from '../../../modules';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Table } from 'src/components';
import { PaginationMobile } from 'src/mobile/components';

interface MarketOrderMobileScreenProps {
    market: string;
    created_at: string;
    type: string;
    price: string;
    amount: string;
    total: string;
    volume: string;
    execute: string;
    unexecute: string;
    market_type: string;
    side: string;
    remaining_volume: string;
    executed_volume: string;
    origin_volume: string;
    dataCurrency: {
        currency: string;
        name: string;
        icon_url: string;
    };
}
const OrderHistoryMobileScreen: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    useMarketsFetch();

    const [tab, setTab] = React.useState('close');
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState('');
    const [asset, setAsset] = React.useState('');
    const [detailData, setDetailData] = React.useState<MarketOrderMobileScreenProps>(
        {} as MarketOrderMobileScreenProps
    );

    const markets = useSelector(selectMarkets);
    const page = useSelector(selectCurrentPage);
    const orders = useSelector(selectHistory);
    const currencies: Currency[] = useSelector(selectCurrencies);

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectFirstElemIndex(state, 8));
    const lastElementIndex = useSelector((state: RootState) => selectLastElemIndex(state, 8));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, 8));

    useHistoryFetch({ page: currentPageIndex, type: 'trades', limit: 8 });

    const dataListWithIcon = orders
        .map((item) => ({
            ...item,
            markets: markets.find((market_item) => market_item.id == item.market),
        }))
        .map((order_item) => ({
            ...order_item,
            dataCurrency: currencies.find(({ id }) => id == order_item?.markets?.base_unit),
        }));

    const onClickPrevPage = () => {
        setPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setPageIndex(currentPageIndex + 1);
    };

    const renderTableHeader = [
        <p className="mb-0 text-sm grey-text">Coins</p>,
        <p className="mb-0 text-sm grey-text">Amount</p>,
        <p className="mb-0 text-sm grey-text">Price</p>,
        <p className="mb-0 text-sm grey-text">Type</p>,
        <p className="mb-0 text-sm grey-text">Status</p>,
    ];

    const renderDataTable = (data) => {
        return data.map((item, index) => [
            <div className="d-flex justify-content-center align-items-stretch">
                <img
                    height={30}
                    width={30}
                    className="icon-history mr-3 rounded-full"
                    src={item?.dataCurrency?.icon_url !== null ? item?.dataCurrency?.icon_url : '/img/dummycoin.png'}
                    alt="icon"
                />
            </div>,
            <div className="d-flex align-items-center text-sm">
                <div className="">
                    <p className="mb-0 grey-text-accent font-bold text-sm text-nowrap">
                        {item.price} {item.market?.toUpperCase()}
                    </p>
                    <p className="mb-0 grey-text text-xxs text-nowrap">
                        {moment(item.created_at).format('D MMM YYYY')}
                    </p>
                </div>
            </div>,
            <p className={`badge grey-text text-sm mb-0`}>{item.price}</p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>
                {item.side?.charAt(0)?.toUpperCase() + item.side?.slice(1)}
            </p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>Done</p>,
            // <p key={index} className={`badge text-sm mb-0 cursor-pointer danger-text`} onClick={()=> handleItemDetail(data[index])}>
            //     Detail
            // </p>,
        ]);
    };

    return (
        <React.Fragment>
            <div className="mobile-container no-header dark-bg-main">
                <div className="head-container position-relative">
                    <div onClick={() => history.goBack()} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </div>
                    <h1 className="text-center text-md grey-text-accent font-bold">Trade History</h1>
                </div>
                <div className="table-mobile-wrapper">
                    <Table data={renderDataTable(dataListWithIcon)} header={renderTableHeader} />
                    <div className="mt-3">
                        {dataListWithIcon[0] && (
                            <PaginationMobile
                                firstElementIndex={firstElementIndex}
                                lastElementIndex={lastElementIndex}
                                page={page}
                                nextPageExists={nextPageExists}
                                onClickPrevPage={onClickPrevPage}
                                onClickNextPage={onClickNextPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export { OrderHistoryMobileScreen };
