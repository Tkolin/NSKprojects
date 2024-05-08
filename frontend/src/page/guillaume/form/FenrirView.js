import React from 'react';
import {Form, Input, notification, Select} from 'antd';
import {useMutation, useQuery} from '@apollo/client';

import {StyledFormItem, StyledFormRegular} from "../../style/FormStyles";
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {CREATE_FENRIR_MUTATION, CREATE_FENRIR_TEMPLATE_MUTATION} from "../../../graphql/mutationsFormula";
import {CustomSelect} from "../FenrirStyles";
import {nanoid} from "nanoid";
import {FENRIR_QUERY, FORMULA_BY_KEY_QUERY} from "../../../graphql/queries";

const FenrirView = ({type, onClose, onSetModels}) => {

    const {
        loading: loadFenrir,
        error: errorFenrir,
        data: dataFenrir,
        refetch: refetchFenrir
    } = useQuery(FENRIR_QUERY, {
        fetchPolicy: 'network-only',
        onCompleted: (result) => {
            console.log('result ', result);
        }
    });
    // Обработчик отправки формы
    const handleSubmit = (value) => {
        onSetModels(JSON.parse(dataFenrir.fenrirs.items.find(row => row.id === value).models));
        if(onClose) onClose();
    };

    return (
        <StyledBlockRegular label={'Схемы'}>
            <StyledFormItem label="Наименование" rules={[{required: true}]}>
                <Select
                    className={"my-custom-select-functions"}
                    size={'small'}
                    style={{
                        width: '100%'
                    }}
                    loading={loadFenrir}
                    onSelect={(value) => {
                        handleSubmit(value);
                    }}
                >
                    {dataFenrir?.fenrirs?.items?.map(row => (
                        <Select.Option key={row.id} value={row.id}>
                            {row.name}
                        </Select.Option>
                    ))}
                </Select>
            </StyledFormItem>

            <div style={{textAlign: 'center'}}>
                <StyledFormItem>
                    <StyledButtonGreen style={{marginBottom: 0}} type="primary">
                        {type ? "Загрузить схему" : "Загрузить шаблон"}
                    </StyledButtonGreen>
                </StyledFormItem>
            </div>
        </StyledBlockRegular>
    );
};

export default FenrirView;
