import {useMutation, useQuery} from "@apollo/client";

import React, {useEffect, useState} from "react";
import {Button, Form, InputNumber, Modal, notification, Select, Space} from "antd";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {StyledButtonGreen} from "../../../style/ButtonStyles";
import {StyledFormBig} from "../../../style/FormStyles";
import {UPDATE_IRDS_TEMPLATE_MUTATION} from "../../../../graphql/mutationsTemplate";
import IrdForm from "../../simpleForm/IrdForm";
import {IRDS_QUERY, TEMPLATE_IRDS_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";

const IrdsTemplateForm = ({typeProjectId, triggerMethod, setTriggerMethod, disabled}) => {
        // Состояния
        const [formIRD] = Form.useForm();
        const [irdFormViewModalVisible, setIrdFormViewModalVisible] = useState(false);
        const [autoCompleteIrd, setAutoCompleteIrd] = useState('');
        const handleAutoCompleteIrdSelect = (value) => {
            setAutoCompleteIrd('');

        };
        const handleAutoCompleteIrd = (value) => {
            setAutoCompleteIrd(value)
        };
        const handleIrdFormView = () => {
            setIrdFormViewModalVisible(false);
        };
        // Функции уведомлений
        const openNotification = (placement, type, message) => {
            notification[type]({
                message: message, placement,
            });
        };

        // Получение данных для выпадающих списков
        const [dataIrds, setDataIrds] = useState(null);
        const {loading: loadingIrds, refetch: refetchIrds, data: dataIrdsQuery} = useQuery(IRDS_QUERY, {
            fetchPolicy: 'network-only',
            variables: {queryOptions: {search: autoCompleteIrd, limit: 10, page: 1}},
            onCompleted: (data) => setDataIrds(data)
        });
        const {
            loading: loadingTemplate, error: errorTemplate, data: dataTemplate
        } = useQuery(TEMPLATE_IRDS_TYPE_PROJECTS_QUERY, {
            variables: {typeProject: typeProjectId},
            fetchPolicy: 'network-only',
            onCompleted: (data) =>{
                loadTemplate();
                addingIrds(data?.templatesIrdsTypeProjects?.map((titp) => titp.ird))}
        });

        // Загрузка шаблонов при редактировании
    useEffect((dataIrdsQuery) => {
        dataIrdsQuery ?? setDataIrds(dataIrdsQuery);
    }, [dataIrdsQuery]);
        const addingIrds = (value) => {
            if (!dataIrds || !value) return;
            const newIrds = value.map(a => ({
                id: a?.id ?? null, name: a?.name ?? null,
            }));
            const existingIrds = dataIrds.irds ? dataIrds.irds.items : [];
            const updatedIrds = [...existingIrds, ...newIrds];
            setDataIrds({
                ...dataIrds,
                irds: {
                    ...dataIrds.irds,
                    items: updatedIrds,
                },
            });
        };

        // Мутации для добавления и обновления
        const [updateTemplateIrds] = useMutation(UPDATE_IRDS_TEMPLATE_MUTATION, {
            onCompleted: () => {
                openNotification('topRight', 'success', 'Данные успешно обновлены! ti');
            }, onError: (error) => {
                openNotification('topRight', 'error', 'Ошибка при обновлении данных: ti' + error.message);
            }
        });

        // Обработчик отправки формы
        const handleSubmit = () => {
            const irdsData = formIRD.getFieldsValue().irdList.map(ird => ({
                ird_id: ird.ird_item, stage_number: ird.stageNumber_item, app_number: ird.appNumber_item,
            }));
            // Вызов мутаций для обновления данных
            updateTemplateIrds({
                variables: {
                    typeProjectId: typeProjectId,
                    listIrds_id: irdsData.map(ird => parseInt(ird.ird_id)),
                    listStageNumber: irdsData.map(ird => ird.stage_number),
                    listAppNumber: irdsData.map(ird => ird.app_number)
                }
            });
        };

        // Триггер
        if (triggerMethod) {
            handleSubmit();
            setTriggerMethod(false); // Reset the trigger
        }
        // Подстановка значений
        const loadTemplate = () => {
            if (dataTemplate) {
                const irds = dataTemplate?.templatesIrdsTypeProjects ?? null;
                const initialValuesIrds = irds && irds.map(data => ({
                    ird_item: data.ird.id, stageNumber_item: data.stage_number, appNumber_item: data.application_to_project,
                }));
                formIRD.setFieldsValue({irdList: initialValuesIrds});
            }
        };
        useEffect(() => {
            console.log("dataIrds ", dataIrds);
        }, [dataIrds]);
        if (loadingTemplate)
            return <LoadingOutlined
                style={{
                    fontSize: 24,
                }}
                spin
            />
        return (<>
            <StyledFormBig
                name="dynamic_form_nest_itemы"
                style={{maxWidth: 600}}
                form={formIRD}
                disabled={disabled}
            >

                <Form.List name="irdList">
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                display: 'flex', marginBottom: 0, marginTop: 0
                            }}
                            align="baseline"
                        >
                            <Form.Item
                                {...restField}
                                style={{
                                    display: 'flex', marginBottom: 0, marginTop: 0
                                }}
                                name={[name, 'ird_item']}
                            >
                                <Select
                                    style={{maxWidth: 570, minWidth: 570, marginBottom: 0}}
                                    popupMatchSelectWidth={false}
                                    filterOption={false}
                                    placeholder="Начните ввод..."
                                    onSearch={(value) => handleAutoCompleteIrd(value)}
                                    onSelect={(value) => handleAutoCompleteIrdSelect(value)}
                                    allowClear
                                    showSearch
                                    loading={loadingIrds}
                                >
                                    {dataIrds?.irds?.items?.map(ird => (
                                        <Select.Option key={ird.id}
                                                       value={ird.id}>
                                            {ird.name}
                                        </Select.Option>))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                style={{
                                    display: 'flex', marginBottom: 0, marginTop: 0
                                }}
                                name={[name, 'stageNumber_item']}
                            >
                                <InputNumber
                                    size={"middle"}
                                    min={1}
                                    max={100}
                                    style={{
                                        width: 60
                                    }}/>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                style={{
                                    display: 'flex', marginBottom: 0, marginTop: 0
                                }}
                                name={[name, 'appNumber_item']}
                            >
                                <InputNumber
                                    size={"middle"}
                                    min={1}
                                    max={100}
                                    style={{
                                        width: 60
                                    }}/>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Добавить ИРД к шаблону
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
                <div style={{textAlign: 'center'}}>
                    <StyledButtonGreen
                        style={{marginBottom: 0}}
                        type={'dashed'}
                        onClick={() => setIrdFormViewModalVisible(true)}>Создать ИРД</StyledButtonGreen></div>

            </StyledFormBig>
            <Modal
                open={irdFormViewModalVisible}
                onCancel={() => setIrdFormViewModalVisible(false)}
                footer={null}
                onClose={handleIrdFormView}
            >
                <IrdForm/>
            </Modal>
        </>);
    }
;
export default IrdsTemplateForm;
