export const CustomStyleAddPayment = {
    control: (provided, state) => ({
        ...provided,
        borderColor: 'rgba(35, 38, 47)',
        background: 'rgb(14, 17, 20)',
        borderRadius: '6px',
        boxShadow: state.isFocused ? null : null,
        // padding: '8px 16px',
        marginRight: '0px',
        cursor: 'pointer',
        height: '16px',
        '&:hover': {
            borderColor: 'rgba(35, 38, 47)',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'rgba(181, 179, 188)',
    }),
    option: (provided, state) => ({
        ...provided,
        margin: '0',
        color: state.isSelected ? '#ffff' : 'rgba(181, 179, 188)',
        background: state.isSelected ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        '&:hover': {
            background: state.isFocused ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#fff',
    }),
    indicatorSeparator: () => {},
};
