import React, {useContext, useEffect, useState} from 'react';
import {Card, Form, Input, Skeleton} from 'antd';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ADD_IRD_MUTATION, UPDATE_IRD_MUTATION} from "../../graphql/mutationsIrd";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {NotificationContext} from "../../NotificationProvider";
import {IRDS_QUERY_BY_ID} from "../../graphql/queriesByID";
import LoadingSpinnerStyles from "../components/style/LoadingSpinnerStyles";
import {ModalButton} from "./formComponents/ModalButtonComponent";

const IrdForm = ({localObject, initialObject, onCompleted, cardProps}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'ИРД';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(IRDS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.irds?.items[0]);
            updateForm(data?.irds?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_IRD_MUTATION : ADD_IRD_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.updateIrd || data?.createIrd);
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
        mutate({variables: {...(actualObject ? {id: actualObject.id} : {}), data: {name: form.getFieldValue("name")}}});
    };

    return (
        <Card style={{width: 400}}

              {...cardProps}
              actions={[
                  <ModalButton
                      modalType={"green"}
                      isMany={cardProps?.actions}
                      loading={loadingSave}
                      onClick={() => form.submit()}
                      children={actualObject ? `Обновить` : `Создать`}/>
                  , ...cardProps?.actions ?? []
              ]}
              children={
                  !loading ?
                      <Form form={form} onFinish={handleSubmit} layout="vertical">
                          <Form.Item name="name" label="Наименование" rules={[{required: true}]}>
                              <Input/>
                          </Form.Item>
                      </Form> :
                      <Skeleton active/>
              }
        />
    );
};

export default IrdForm;
