export const CustomStyleSelectFiatMobile = {
    control: (provided, state) => ({
        ...provided,
        borderColor: 'rgb(21, 25, 29)',
        borderLeft: 'none',
        background: 'rgb(21, 25, 29)',
        borderRadius: '0 8px 8px 0',
        boxShadow: state.isFocused ? null : null,
        padding: '0 8px',
        height: '54px',
        cursor: 'pointer',
        '&:hover': {
            borderColor: 'rgb(21, 25, 29)',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'rgba(111, 111, 111)',
        fontWeight: '400',
        fontSize: '14px',
    }),
    option: (provided, state) => ({
        ...provided,
        margin: '0',
        background: state.isSelected ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        '&:hover': {
            background: state.isFocused ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        },
    }),
    indicatorSeparator: () => {},
};
