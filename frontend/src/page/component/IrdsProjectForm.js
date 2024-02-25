import {StyledBlockBig} from "../style/BlockStyles";
import {StyledFormBig} from "../style/FormStyles";
import {Button, Form, Select, Space} from "antd";
import {DatePicker} from "antd/lib";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {SEARCH_IRDS_QUERY} from "../../graphql/queriesSearch";
import {UPDATE_IRDS_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {PROJECT_QUERY} from "../../graphql/queries";
const IrdsProjectForm = ({ project, onSave }) => {

    // Состояния
    const [formIRD] = Form.useForm();

    const [autoCompleteIrd, setAutoCompleteIrd] = useState('');
    const [irdFormViewModalVisible, setIrdFormViewModalVisible] = useState(false);

    const handleAutoCompleteIrdSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        } else {
            setAutoCompleteIrd('');
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

    const addingIrds = (value) => {
        if (dataIrds && value) {
            console.log('addingIrds');

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
            console.log(dataIrds);
        }
    }

    // Мутации для добавления и обновления
    const [updateIrdsToProject] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECT_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: ' + error.message);
        }
    });

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

    return (
            <StyledFormBig form={formIRD} name="dynamic_form_nest_item" autoComplete="off">
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
                                        <Select.Option value="CREATE_NEW">
                                            Создать новый ИРД?
                                        </Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'isChecked']}
                                valuePropName="dateComplite_item"
                                style={{
                                    display: 'flex', marginBottom: 0, marginTop: 0
                                }}
                            >
                                <DatePicker
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