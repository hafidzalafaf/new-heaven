export const CustomStyleSelectP2PTransfer = {
 control: (provided, state) => ({
     ...provided,
     border: 'none',
     background: 'rgb(21, 25, 29)',
     borderRadius: '8px',
     boxShadow: state.isFocused ? null : null,
     padding: '6px 8px',
     cursor: 'pointer',
     height: '54px'
    
 }),
 placeholder: (provided) => ({
     ...provided,
     color: 'rgba(181, 179, 188)',
 }),
 option: (provided, state) => ({
     ...provided,
     margin: '0',
     background: state.isSelected ? 'rgb(21, 25, 29)' : 'rgb(11, 14, 17)',
     '&:hover': {
         background: state.isFocused ? 'rgb(21, 25, 29)' : 'rgb(11, 14, 17)',
     },
 }),
 indicatorSeparator: () => {},
};