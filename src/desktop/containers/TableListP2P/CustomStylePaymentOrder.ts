export const CustomStylePaymentOrder = {
    control: (provided, state) => ({
        ...provided,
        borderColor: 'rgba(35, 38, 47)',
        borderRadius: '6px',
        background: 'rgb(14, 17, 20)',
        boxShadow: state.isFocused ? null : null,
        // padding: '16px',
        cursor: 'pointer',
        maxWidth: '100%',
        marginRight: '0px',
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
        background: state.isSelected ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        '&:hover': {
            background: state.isFocused ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        },
    }),
    indicatorSeparator: () => {},
};
