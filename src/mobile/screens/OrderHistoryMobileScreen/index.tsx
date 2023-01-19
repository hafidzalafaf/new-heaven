import * as React from 'react';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { useHistory } from 'react-router-dom';
import { useDocumentTitle, useWalletsFetch, useUserOrdersHistoryFetch, useMarketsFetch } from '../../../hooks';
import {
    selectCurrencies,
    Currency,
    selectMarkets,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    RootState,
    selectCurrentPageIndex,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    selectShouldFetchCancelAll,
    selectShouldFetchCancelSingle,
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

    const page = useSelector(selectCurrentPageIndex);
    const orders = useSelector(selectOrdersHistory);
    const currencies: Currency[] = useSelector(selectCurrencies);

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 5));
    const lastElementIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectOrdersNextPageExists(state));

    useUserOrdersHistoryFetch({ pageIndex: currentPageIndex, type: tab, limit: 15 });

    React.useEffect(() => {
        const filter = orders.filter((order) => ['done'].includes(order.state));
        setData(filter);
    }, [orders]);

    const dataListWithIcon = data.map((item) => ({
        ...item,
        dataCurrency: currencies.find(
            ({ id }) => id == item.market.replace('usdt', '') || id == item.market.replace('trx', '')
        ),
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
                    src={item.dataCurrency && item.dataCurrency.icon_url}
                    alt="icon"
                />
            </div>,
            <div className="d-flex align-items-center text-sm">
                <div className="">
                    <p className="mb-0 grey-text-accent font-bold text-sm">
                        {item.price} {item.market.toUpperCase()}
                    </p>
                    <p className="mb-0 grey-text text-xxs text-nowrap">
                        {moment(item.created_at).format('D MMM YYYY')}
                    </p>
                </div>
            </div>,
            <p className={`badge grey-text text-sm mb-0`}>{item.price}</p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>
                {item.side.charAt(0).toUpperCase() + item.side.slice(1)}
            </p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>
                {item.state.charAt(0).toUpperCase() + item.state.slice(1)}
            </p>,
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
