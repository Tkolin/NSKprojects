import React, {useContext, useEffect, useState} from 'react';
import {Form, Input} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    ADD_TYPE_PROJECTS_MUTATION,
    UPDATE_TYPE_PROJECTS_MUTATION
} from "../../../graphql/mutationsTypeProject";
import {NotificationContext} from "../../../NotificationProvider";
import {
    GROUP_TYPE_PROJECTS_QUERY_COMPACT
} from "../../../graphql/queriesCompact";
import {CustomAutoComplete, CustomAutoCompleteAndCreate} from "../../style/SearchAutoCompleteStyles";
import {TYPES_PROJECTS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import TypeProjectModalForm from "../../modal/TypeProjectModalForm";
import {nanoid} from "nanoid";

const TypeProjectForm = ({localObject, initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'БИК';

    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(TYPES_PROJECTS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.typeProjects?.items[0]);
            updateForm(data?.typeProjects?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Состояния

    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_TYPE_PROJECTS_MUTATION : ADD_TYPE_PROJECTS_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.createTypeProject || data?.updateTypeProject);
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
        console.log("localObject", localObject);
        if (localObject)
            updateForm(localObject);
    }, [localObject]);

    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                ...data,
                group: {selected: data?.group?.id, output: data?.group?.name}
            });
        }
    };
    // Получение данных для выпадающих списков
    const {loading: loadingGroup, error: errorGroup, data: dataGroup} = useQuery(GROUP_TYPE_PROJECTS_QUERY_COMPACT);


    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue()}});
    };
    if (loading || loadingSave) return <LoadingSpinnerStyles/>


    return (
        <div>
            <Form form={form} layout="vertical">

                <Form.Item name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="code" label="код" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="group" label="Группа" rules={[{required: true}]}>
                    <CustomAutoComplete
                        typeData={"CODENAME"}
                        data={dataGroup?.groupTypeProjects}
                    />
                </Form.Item>
                <div style={{textAlign: 'center'}}>
                    <Form.Item>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default TypeProjectForm;
