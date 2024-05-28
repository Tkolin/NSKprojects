import styled from 'styled-components';
import {AddressSuggestions} from "react-dadata";

const StyledAddressSuggestionsInput = {
    width: '100%',
    height: '32px',
    padding: '4px 11px',
    fontSize: '14px',
    lineHeight: '1.5715',
    color: 'rgba(0,0,0,.65)',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #d9d9d9',
    borderRadius: '2px',
    transition: 'border-color .3s',
    boxShadow: 'none',
    outline: '0',
    boxSizing: 'border-box',
};
export const StyledAddressSuggestions = styled(AddressSuggestions)`

 ${StyledAddressSuggestionsInput}

`;
export  {StyledAddressSuggestionsInput}