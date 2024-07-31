import React, {useContext, useEffect, useState} from 'react';
import {Card, Form, Input} from 'antd';
import {useLazyQuery, useMutation} from '@apollo/client';
import {StyledBlockRegular} from "../components/style/BlockStyles";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {NotificationContext} from "../../NotificationProvider";
import {STAGES_QUERY_BY_ID} from "../../graphql/queriesByID";
import LoadingSpinnerStyles from "../components/style/LoadingSpinnerStyles";
import {ADD_STAGE_MUTATION, UPDATE_STAGE_MUTATION} from "../../graphql/mutationsStage";
import {ModalButton} from "./formComponents/ModalButtonComponent";

const IrdForm = ({localObject, initialObject, onCompleted, cardProps}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Этапы';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(STAGES_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.stages?.items[0]);
            updateForm(data?.stages?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_STAGE_MUTATION : ADD_STAGE_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.createStage || data?.createPerson);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id)
            loadContext();
    }, [initialObject]);
    useEffect(() => {
        if (localObject?.id)
            updateForm(localObject);
    }, [localObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                ...data,
            });
        }
    };

    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(actualObject ? {id: actualObject.id} : {}), data: {...form.getFieldsValue()}}});
    };
    if (loading || loadingSave) return <LoadingSpinnerStyles/>

    return (
        <Card style={{width: 400}}
              {...cardProps}
              actions={[
                  <ModalButton
                      modalType={"green"}
                      isMany={cardProps?.actions}
                      loading={loadingSave}
                      onClick={()=>form.submit()}
                      children={actualObject ? `Обновить` : `Создать`}/>
                  , ...cardProps?.actions ?? []
              ]}
              children={
                  <Form form={form} onFinish={handleSubmit} layout="vertical">
                      <Form.Item name="name" label="Наименование" rules={[{required: true}]}>
                          <Input/>
                      </Form.Item>
                  </Form>}
        />
    );
};

export default IrdForm;
