import classnames from 'classnames';
import * as React from 'react';
// import SearchIcon from './Search.svg';
import './FilterInput.pcss';
import { SearchIcon } from '../../../assets/images/ProfileIcon';
import { CloseIconFilter } from '../../../assets/images/CloseIcon';

interface OnChangeEvent {
    target: {
        value: string;
    };
}

export interface FilterInputProps {
    /**
     * Data on which the search will be performed
     */
    data: object[];
    /**
     * filter function prop is used to filter data
     */
    // tslint:disable-next-line
    filter: (item: any, term: string) => boolean;
    /**
     * onFilter prop is called whenever input value changes
     */
    onFilter?: (items: object[]) => void;
    /**
     * Additional class name for styling (by default `cr-search`)
     */
    className?: string;
    /**
     * Value for placeholder of FilterInput components
     */
    placeholder?: string;
}

export interface SearchInputState {
    key: string;
}

/**
 * Component for performing search  and filtering objects of the specific dataset.
 */
export class FilterInput extends React.Component<FilterInputProps, SearchInputState> {
    constructor(props: FilterInputProps) {
        super(props);
        this.state = {
            key: '',
        };
        this.filterList = this.filterList.bind(this);
    }

    public filterList(event?: OnChangeEvent) {
        const value = event ? event.target.value : '';
        const { data, filter } = this.props;

        const result = data.filter((item) => filter(item, value));

        this.props.onFilter && this.props.onFilter(result);
        this.setState({ key: value });
    }

    public render() {
        const { key } = this.state;
        const { className, placeholder } = this.props;
        const cx = classnames('form-input', className);

        return (
            <div className="position-relative input-container">
                <span className="position-absolute search-icon">
                    <SearchIcon />
                </span>
                <input
                    type={'text'}
                    className={cx}
                    value={key}
                    placeholder={placeholder ? placeholder : 'Search Coin'}
                    onChange={this.filterList}
                />
                <span
                    className="position-absolute cancel-icon cursor-pointer grey-text"
                    onClick={(e) => this.filterList()}>
                    <CloseIconFilter />
                </span>
            </div>
        );
    }
}
