import 'react-phone-number-input/style.css';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CONTRACT_PERSON_MUTATION } from './graphql/mutationsPerson';
import {Form, Input, notification} from 'antd';
import axios from 'axios';
import {AddressSuggestions} from "react-dadata";

const Example = () => {
    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;

    const onchange = () =>{
        console.log(TokenDADATA);
    }
    return (
        <Form>
            <AddressSuggestions
                inputProps={{
                    placeholder: 'Введите адрес',
                    style: {
                        width: '100%',
                        height: '32px',
                        padding: '4px 11px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: '#495057',
                        backgroundColor: '#fff',
                        backgroundImage: 'none',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                        transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
                    },
                }}
                token={TokenDADATA} onChange={onchange}/>

            <Input></Input>
        </Form>

    );
};

export default Example;

