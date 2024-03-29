import * as React from 'react';

interface PaginationMobileProps {
    firstElementIndex: number;
    lastElementIndex: number;
    onClickPrevPage: () => void;
    onClickNextPage: () => void;
    page: number;
    nextPageExists: boolean;
    total?: number;
    separator?: string;
    totalText?: string;
}

interface PreviousIconProps {
    disabled: boolean;
}

interface NextPageIconProps {
    disabled: boolean;
}

const PreviousIcon: React.FunctionComponent<PreviousIconProps> = ({ disabled }) => {
    return (
        <svg width="22" height="24" viewBox="0 0 22 24" fill="#878D9A" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0545 7.4L12.7782 6L7.30853 12L12.7782 18L14.0545 16.6L9.86105 12L14.0545 7.4Z"
                fill={`${disabled ? 'var(--pagination-disabled)' : 'var(--pagination-active)'}`}
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};

const NextPageIcon: React.FunctionComponent<NextPageIconProps> = ({ disabled }) => {
    return (
        <svg width="23" height="24" viewBox="0 0 23 24" fill="#878D9A" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.61279 7.4L9.88905 6L15.3587 12L9.88905 18L8.61279 16.6L12.8062 12L8.61279 7.4Z"
                fill={`${disabled ? 'var(--pagination-disabled)' : 'var(--pagination-active)'}`}
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};

class PaginationMobile extends React.Component<PaginationMobileProps> {
    public renderInfoElement = () => {
        const { firstElementIndex, lastElementIndex, separator, total, totalText } = this.props;

        if (total) {
            return (
                <p>
                    <span>{firstElementIndex}</span>
                    <span>{separator || ' - '}</span>
                    <span>{lastElementIndex}</span>
                    <span>{totalText || ' of '}</span>
                    <span>{total}</span>
                </p>
            );
        }

        return (
            <p>
                {/* <span>{firstElemIndex}</span>
                <span>{separator || ' - '}</span>
                <span>{lastElemIndex}</span> */}
            </p>
        );
    };

    public render() {
        const { page, nextPageExists } = this.props;
        const prevDisabled = page === 0;
        const nextDisabled = !nextPageExists;

        return (
            <div className="pagination-mobile-component">
                {this.renderInfoElement()}
                <button className="" onClick={this.onClickPrevPage} disabled={prevDisabled}>
                    <PreviousIcon disabled={prevDisabled} />
                </button>
                <button className="" onClick={this.onClickNextPage} disabled={nextDisabled}>
                    <NextPageIcon disabled={nextDisabled} />
                </button>
            </div>
        );
    }

    private onClickPrevPage = () => {
        if (this.props.page === 0) {
            return;
        }
        this.props.onClickPrevPage();
    };

    private onClickNextPage = () => {
        if (!this.props.nextPageExists) {
            return;
        }
        this.props.onClickNextPage();
    };
}

export { PaginationMobile };
