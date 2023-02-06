export const CustomStylesSelect = {
    control: (provided, state) => ({
        ...provided,
        borderColor: 'rgba(35, 38, 47)',
        background: 'rgb(14, 17, 20)',
        borderRadius: '4px',
        boxShadow: state.isFocused ? null : null,
        padding: '8px 16px',
        marginBottom: '24px',
        cursor: 'pointer',
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
        color: 'rgba(181, 179, 188)',
        background: state.isSelected ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        '&:hover': {
            background: state.isFocused ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
        },
    }),
    indicatorSeparator: () => {},
};
