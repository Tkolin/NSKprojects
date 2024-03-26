import {StyledFormBig} from "../../../style/FormStyles";
import {Button, Form, InputNumber, notification, Select, Space, Tooltip} from "antd";
import {DatePicker} from "antd/lib";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {UPDATE_IRDS_TO_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../../../graphql/mutationsProject";
import {IRDS_QUERY, PROJECTS_QUERY, STAGES_QUERY, TEMPLATE_IRDS_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";
import {ADD_IRD_MUTATION} from "../../../../graphql/mutationsIrd";
import LoadingSpinnerStyles from "../../../style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../../style/ButtonStyles";

const IrdsProjectForm = ({project, setProject , onSubmit, disable}) => {
    // Состояния
    const [formIRD] = Form.useForm();
    const [autoCompleteIrd, setAutoCompleteIrd] = useState('');
    const [dataIrds, setDataIrds] = useState(null);
    const [actualityProjectData, setActualityProjectData] = useState(null);
    const handleAutoCompleteIrd = (value) => {
        setAutoCompleteIrd(value)
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    const handleAutoCompleteIrdSelect = (value) => {
            refetchIrds({search: autoCompleteIrd});
    };

    // Получение данных для выпадающих списков
    const {loading: loadingIrds, refetch: refetchIrds, data: dataIrdsQuery} = useQuery(IRDS_QUERY, {
        fetchPolicy: 'network-only',
        variables: {queryOptions: {search: autoCompleteIrd, limit: 10, page: 1}},
        onCompleted: (data) => setDataIrds(data)
    });
    useEffect((dataIrdsQuery) => {
        dataIrdsQuery ?? setDataIrds(dataIrdsQuery);
    }, [dataIrdsQuery]);
    const {
        loading: loadingTemplate, data: dataTemplate
    } = useQuery(TEMPLATE_IRDS_TYPE_PROJECTS_QUERY, {
        variables: {typeProject: actualityProjectData?.type_project_document?.id},
        fetchPolicy: 'network-only',
        onCompleted: (data) =>{
            loadTemplate();
            addingIrds(data?.templatesIrdsTypeProjects?.map((titp) => titp.ird))}
    });
    //Мутация
    const [addIrd] = useMutation(ADD_IRD_MUTATION, {
        refetchQueries: [{query: IRDS_QUERY}],
        onCompleted: () => {
            openNotification('topRight', 'success', 'ИРД успешно добавлено, произеведите выбор!');
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении ИРД.');
        }
    });

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
    // Подгрузка формы
    const loadTemplate = () => {
        const irds = actualityProjectData?.project_irds?.length > 0 ? actualityProjectData.project_irds :
            (dataTemplate?.templatesIrdsTypeProjects?.length > 0 ? dataTemplate.templatesIrdsTypeProjects
                : null);
        console.log("irds"+irds);
        if (irds) {
            const initialValuesIrds = irds?.map(data => ({
                ird_item: data.ird ? data.ird.id  :  data.IRD.id,
                stage_number_item: data.stage_number ?  data.stage_number : data.stageNumber,
                application_project_item: data.application_to_project ? data.application_to_project : data.applicationProject,
                date_complite_item: data.receivedDate,
            }));
            formIRD.setFieldsValue({ irdList: initialValuesIrds });
        }
    };
    useEffect(() => {
        if (project?.id) {
            refetchProject({ queryOptions: { id: Number(project?.id) }});
            addingIrds( project?.project_irds?.map((pirds) => pirds.IRD));
        }

    }, []);
    useEffect(() => {
        loadTemplate();
    }, [actualityProjectData]);
    const { data: projectData, refetch: refetchProject, loading: projectLoading} = useQuery(PROJECTS_QUERY, {
        variables: { queryOptions: { id: project?.id } },
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
             if (data.projects.items[0]) {
                console.log("data.items[0] ", data.projects.items[0]);
                setProject(data.projects.items[0]);
                setActualityProjectData(data.projects.items[0])
            }
            openNotification('topRight', 'success', 'Данные проекта подргужены!');
        },
            onError: (error) => {
                openNotification('topRight', 'error', 'Ошибка при загрузки проекта: ' + error.message);
            }});
    // Мутации для добавления и обновления
    const [updateIrdsToProject] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
        onCompleted:() => {
            if (onSubmit)
                onSubmit();
            openNotification('topRight', 'success', 'Данные ИРД успешно обновлены !');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных ird: ' + error.message);
        }
    });
    const handleSubmit = () => {
        const irdToProject = formIRD.getFieldsValue().irdList.map(ird => ({
            projectId: actualityProjectData?.id,
            irdId: ird.ird_item,
            stageNumber: parseInt(ird.stage_number_item),
            applicationProject: parseInt(ird.application_project_item),
            receivedDate: ird.date_complite_item,
        }));
        // Вызов мутаций для обновления данных
        updateIrdsToProject({
            variables: {
                data: irdToProject
            }
        });
    };
    if (loadingTemplate || projectLoading)
        return <LoadingSpinnerStyles/>
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
                        <Tooltip title="Номер этапа">
                            <Form.Item
                                {...restField}
                                name={[name, 'stage_number_item']}
                                style={{ display: 'flex', marginBottom: 0  }}
                            >
                                <InputNumber max={100} min={0} prefix={"№"}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Номер в приложении">
                            <Form.Item
                                {...restField}
                                name={[name, 'application_project_item']}
                                style={{ display: 'flex', marginBottom: 0  }}
                            >
                                <InputNumber max={100} min={0} prefix={"№"}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Наименование ИРД">
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
                                    {dataIrds?.irds?.items?.map(ird => (
                                        <Select.Option key={ird.id}
                                                       value={ird.id}>
                                            {ird.name}
                                        </Select.Option>))}
                                </Select>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Дата получения">
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
                        </Tooltip>
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
            <div style={{textAlign: 'center'}}>
                <Space>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        Сохранить проект
                    </StyledButtonGreen>
                </Space>
            </div>
        </StyledFormBig>
    )
};

export default IrdsProjectForm;
