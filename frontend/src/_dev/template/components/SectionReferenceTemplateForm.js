import {StyledFormBig} from "../../../../style/FormStyles";
import {Button, Form, InputNumber, notification, Select, Space, Tooltip} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    PROJECTS_QUERY,
    SECTION_REFERENCES_QUERY, TEMPLATE_SECTION_REFERENCES_TYPE_PROJECTS_QUERY
} from "../../../../../graphql/queries";
import LoadingSpinnerStyles from "../../../../style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../../../style/ButtonStyles";
import {UPDATE_SECTION_REFERENCES_TEMPLATE_MUTATION} from "../../../../../graphql/mutationsTemplate";

const SectionReferenceTemplateForm = ({project, setProject , onSubmit, disable}) => {
    const [formSectionReference] = Form.useForm();
    const [autoCompleteSectionReference, setAutoCompleteSectionReference] = useState('');
    const [dataSectionReference, setDataSectionReference] = useState(null);
    const [actualityProjectData, setActualityProjectData] = useState(null);
    const handleAutoCompleteSectionReference = (value) => {
        setAutoCompleteSectionReference(value)
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    const handleAutoCompleteSectionReferenceSelect = (value) => {
        refetchSectionReference({search: autoCompleteSectionReference});
    };

    // Получение данных для выпадающих списков
    const {loading: loadingSectionReference, refetch: refetchSectionReference, data: dataSectionReferenceQuery} =
        useQuery(SECTION_REFERENCES_QUERY, {
            fetchPolicy: 'network-only',
            variables: {queryOptions: {search: autoCompleteSectionReference, limit: 10, page: 1}},
            onCompleted: (data) => setDataSectionReference(data)
        });
    useEffect((dataSectionReferenceQuery) => {
        dataSectionReferenceQuery ?? setDataSectionReference(dataSectionReferenceQuery);
    }, [dataSectionReferenceQuery]);
    const {
        loading: loadingTemplate, data: dataTemplate
    } = useQuery(TEMPLATE_SECTION_REFERENCES_TYPE_PROJECTS_QUERY, {
        variables: {typeProject: actualityProjectData?.type_project_document?.id},
        fetchPolicy: 'network-only',
        onCompleted: (data) =>{
            loadTemplate();
            addingSectionReference(data?.templatesSectionReferencesTypeProjects?.map((titp) => titp.section_reference ))}
    });


    const addingSectionReference = (value) => {
        if (!dataSectionReference || !value) return;
        const newSectionReferences  = value.map(a => ({
            id: a?.id ?? null, name: a?.name ?? null,
        }));
        const existingSectionReference = dataSectionReference.sectionReferences ? dataSectionReference.sectionReferences.items : [];
        const updatedSectionReferences = [...existingSectionReference, ...newSectionReferences];
        setDataSectionReference({
            ...dataSectionReference,
            sectionReferences: {
                ...dataSectionReference.sectionReferences,
                items: updatedSectionReferences,
            },
        });
    };
    // Подгрузка формы
    const loadTemplate = () => {
        const sectionReferences = actualityProjectData?.project_sectionReferences?.length > 0 ? actualityProjectData.project_sectionReferences :
            (dataTemplate?.templatesSectionReferencesTypeProjects?.length > 0 ? dataTemplate.templatesSectionReferencesTypeProjects
                : null);
        console.log("sectionReferences"+sectionReferences);
        if (sectionReferences) {
            const initialValuesSectionReferences = sectionReferences?.map(data => ({
                sectionReference_item: data.sectionReference ? data.sectionReference.id  :  data.Ird.id,
                stage_number_item: data.stage_number ?  data.stage_number : data.stage_number,
                application_project_item: data.application_to_project ? data.application_to_project : data.application_project,
                date_complite_item: data.received_date,
            }));
            formSectionReference.setFieldsValue({ sectionReferenceList: initialValuesSectionReferences });
        }
    };
    useEffect(() => {
        if (project?.id) {
            refetchProject({ queryOptions: { id: Number(project?.id) }});
            addingSectionReference( project?.project_sectionReferences?.map((psectionReferences) => psectionReferences.Ird));
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
    const [updateSectionReferencesToProject] = useMutation(UPDATE_SECTION_REFERENCES_TEMPLATE_MUTATION, {
        onCompleted:() => {
            if (onSubmit)
                onSubmit();
            openNotification('topRight', 'success', 'Данные ИРД успешно обновлены !');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных sectionReference: ' + error.message);
        }
    });
    const handleSubmit = () => {
        const sectionReferenceToProject = formSectionReference.getFieldsValue().sectionReferenceList.map(sectionReference => ({
            projectId: actualityProjectData?.id,
            sectionReferenceId: sectionReference.sectionReference_item,
            stage_number: parseInt(sectionReference.stage_number_item),
            application_project: parseInt(sectionReference.application_project_item),
            received_date: sectionReference.date_complite_item,
        }));
        // Вызов мутаций для обновления данных
        updateSectionReferencesToProject({
            variables: {
                data: sectionReferenceToProject
            }
        });
    };
    if (loadingTemplate || projectLoading)
        return <LoadingSpinnerStyles/>
    return (
        <StyledFormBig form={formSectionReference} name="dynamic_form_nest_item" autoComplete="off" disabled={disable}>
            <Form.List name="sectionReferenceList">
                {(fields, {add, remove}) => (<>
                    {fields.map(({key, name, ...restField}) => (<Space
                        key={key}
                        style={{
                            display: 'flex', marginBottom: 2, marginTop: 2
                        }}
                        align="baseline"
                    >
                        <Tooltip title="Номер Задачи">
                            <Form.Item
                                {...restField}
                                name={[name, 'stage_number_item']}
                                style={{ display: 'flex', marginBottom: 0  }}
                            >
                                <InputNumber max={100} min={0} prefix={"№"}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Наименование Раздела">
                            <Form.Item
                                {...restField}
                                style={{width: 570, minWidth: 220, marginBottom: 0}}
                                name={[name, 'section_reference_item']}
                            >
                                <Select
                                    style={{width: 570, minWidth: 220, marginBottom: 0}}
                                    popupMatchSelectWidth={false}
                                    filterOption={false}
                                    placeholder="Начните ввод..."
                                    onSearch={(value) => handleAutoCompleteSectionReference(value)}
                                    onSelect={(value) => handleAutoCompleteSectionReferenceSelect(value)}
                                    allowClear
                                    showSearch
                                    loading={loadingSectionReference}
                                >
                                    {dataSectionReference?.sectionReferences?.items?.map(sectionReference => (
                                        <Select.Option key={sectionReference.id}
                                                       value={sectionReference.id}>
                                            {sectionReference.name}
                                        </Select.Option>))}
                                </Select>
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

export default SectionReferenceTemplateForm;
