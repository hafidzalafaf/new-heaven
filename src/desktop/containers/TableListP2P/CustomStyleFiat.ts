export const CustomStyleFiat = {
 control: (provided, state) => ({
     ...provided,
     borderColor: 'rgba(35, 38, 47)',
     borderLeft: 'none',
     background: 'rgb(14, 17, 20)',
     borderRadius: '0 4px 4px 0',
     boxShadow: state.isFocused ? null : null,
     padding: '8px 16px',
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
     background: state.isSelected ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
     '&:hover': {
         background: state.isFocused ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
     },
 }),
 indicatorSeparator: () => {},
};
