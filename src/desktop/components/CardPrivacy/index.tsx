import * as React from 'react';
import { NoData } from '../../components';
import { Link } from 'react-router-dom';
import { DocsIcon } from 'src/assets/images/ProfileIcon';
import { ArrowRightGradient } from 'src/assets/images/ArrowRightIcon';

export interface CardPrivacyProps {
    title: string;
    data?: any;
}

export const CardPrivacy: React.FunctionComponent<CardPrivacyProps> = (props) => {
    const { title, data } = props;

    return (
        <div className="d-flex flex-column gap-16">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
                <h1 className="m-0 p-0 text-md white-text">{title}</h1>
                {data?.length > 4 ? (
                    <Link to={`/${title?.toLowerCase()}`} className="d-flex align-items-center gap-4 cursor-pointer">
                        <p className="m-0 p-0 gradient-text text-sm font-bold">View more</p>
                        <span>
                            <ArrowRightGradient />
                        </span>
                    </Link>
                ) : (
                    ''
                )}
            </div>

            {data?.length > 0 ? (
                data?.slice(0, 4)?.map((item, i) => (
                    <a href={item.url} key={i} target="__blank" rel="noopener noreferrer">
                        <div className="d-flex py-16">
                            <div className="mr-2">
                                <DocsIcon />
                            </div>
                            <p className="text-sm grey-text font-normal mb-0">{item.title}</p>
                        </div>
                    </a>
                ))
            ) : (
                <div className="my-3">
                    <NoData text={`No ${title} yet`} />
                </div>
            )}
        </div>
    );
};
