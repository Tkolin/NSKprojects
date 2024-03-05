import {StyledFormBig} from "../style/FormStyles";
import {Button, Form, notification, Select, Space} from "antd";
import {DatePicker} from "antd/lib";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    SEARCH_IRDS_QUERY,
    SEARCH_TEMPLATE_IRDS_OR_TYPE_PROJECT_QUERY,
} from "../../graphql/queriesSearch";
import {UPDATE_IRDS_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {IRDS_QUERY} from "../../graphql/queries";
import {ADD_IRD_MUTATION} from "../../graphql/mutationsIrd";
import LoadingSpinner from "./LoadingSpinner";
const IrdsProjectForm = ({ typeProjectId, projectId, triggerMethod, setTriggerMethod,disable }) => {
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }

    // Состояния
    const [formIRD] = Form.useForm();
    const [autoCompleteIrd, setAutoCompleteIrd] = useState('');

    //Мутация
    const [addIrd] = useMutation(ADD_IRD_MUTATION, {
        refetchQueries: [{ query: IRDS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'ИРД успешно добавлено, произеведите выбор!');
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении ИРД.');
        }
    });

    const handleAutoCompleteIrdSelect = (value) => {
        if (value == 'CREATE_NEW') {
            addIrd({variables: {name: autoCompleteIrd}});
            refetchIrds({ search: autoCompleteIrd });
        }
    };
    const handleAutoCompleteIrd = (value) => {
        setAutoCompleteIrd(value)
    };

    // Получение данных для выпадающих списков
    const [dataIrds, setDataIrds] = useState(null);
    const {loading: loadingIrds, error: errorIrds, refetch: refetchIrds} = useQuery(SEARCH_IRDS_QUERY, {
        variables: {search: autoCompleteIrd}, onCompleted: (data) => setDataIrds(data)
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_IRDS_OR_TYPE_PROJECT_QUERY, {
        variables: {typeProject: typeProjectId},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addingIrds(data),
    });

    const addingIrds = (value) => {
        if (dataIrds && value) {
            const newIrds = value.templatesIrdsTypeProjects.map(a => ({
                id: a.ird ? a.ird.id : null, name: a.ird ? a.ird.name : null,
            }));
            refetchIrds({search: autoCompleteIrd}).then(({data}) => {
                const existingIrds = dataIrds.irdsTable ? dataIrds.irdsTable.irds : [];
                const updatedIrds = [...existingIrds, ...newIrds];
                setDataIrds({
                    ...dataIrds, irdsTable: {
                        ...dataIrds.irdsTable, irds: updatedIrds,
                    },
                });
            });
            loadTemplate();
        }
    }
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Подгрузка формы
    const loadTemplate = () => {
        if (dataTemplate) {
            const irds = dataTemplate && dataTemplate.templatesIrdsTypeProjects;
            const initialValuesIrds = irds && irds.map(data => ({
                ird_item: data.ird.id, stageNumber_item: data.stage_number, appNumber_item: data.application_to_project,
            }));
            formIRD.setFieldsValue({irdList: initialValuesIrds});
        }
    };

    // Мутации для добавления и обновления
    const [updateIrdsToProject] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены ird!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных ird: ' + error.message);
        }
    });

    const handleSubmit = () => {
        const irdsData = formIRD.getFieldsValue().irdList.map(ird => ({
            ird_id: ird.ird_item, date_complete: ird.date_complete_item
        }));

        // Вызов мутаций для обновления данных
        updateIrdsToProject({
            variables: {
                typeProjectId: typeProjectId,
                listIrds_id: irdsData.map(ird => parseInt(ird.ird_id)),
                listDateComplete: irdsData.map(ird => ird.date_complete),
            }
        });
    }

    if(loadingTemplate)
        return  <LoadingSpinner/>

    return (
            <StyledFormBig form={formIRD} name="dynamic_form_nest_item" autoComplete="off" disabled={disable}>
                <Form.List name="irdList">
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                display: 'flex', marginBottom: 2, marginTop: 2
                            }}
                            align="baseline"
                        >
                            <Form.Item
                                {...restField}
                                style={{width: 570, minWidth: 220, marginBottom: 0}}
                                name={[name, 'ird_item']}
                            >
                                <Select
                                    style={{width: 570, minWidth: 220, marginBottom: 0}}
                                    popupMatchSelectWidth={false}
                                    filterOption={false}
                                    placeholder="Начните ввод..."
                                    onSearch={(value) => handleAutoCompleteIrd(value)}
                                    onSelect={(value) => handleAutoCompleteIrdSelect(value)}
                                    allowClear
                                    showSearch
                                    loading={loadingIrds}
                                >
                                    {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.map(ird => (
                                        <Select.Option key={ird.id}
                                                       value={ird.id}>
                                            {ird.name}
                                        </Select.Option>))}
                                    {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.length === 0 && (
                                        <Select.Option value="CREATE_NEW" style={{ background: '#52c41a',
                                            color: '#fff'}}>
                                            Создать новый ИРД?
                                        </Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'isChecked']}
                                valuePropName="date_complite_item"
                                style={{
                                    display: 'flex', marginBottom: 0, marginTop: 0
                                }}
                            >
                                <DatePicker
                                    disabled={disable}
                                    status={"warning"}
                                    placeholder="Получено"/>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
            </StyledFormBig>
    )
};

export default IrdsProjectForm;