
import React from "react";
import {AddressSuggestions} from "react-dadata";
import {StyledAddressSuggestionsInput} from "./InputStyles";

export const AddressSuggestionsCustomComponent = ({value, onChange}) => {
    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;
    return (
        <AddressSuggestions token={TokenDADATA}
                            defaultQuery={address?.mail ?? ""}
                            inputProps={{
                                placeholder: 'Введите адрес',
                                style: StyledAddressSuggestionsInput,
                            }}
                            onChange={(suggestion) => setAddress({
                                ...address,
                                mail: suggestion?.unrestricted_value
                            })}
                            style={{width: '100%'}}/>
    );
};