// import {StyledFormBig} from "../../../style/FormStyles";
// import {Button, Form, InputNumber, Modal, notification, Select, Space, Tooltip} from "antd";
// import {DatePicker} from "antd/lib";
// import {CloudUploadOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
// import React, {useEffect, useState} from "react";
// import {useMutation, useQuery} from "@apollo/client";
// import {UPDATE_TechnicalSpecificationS_TO_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../../../graphql/mutationsProject";
// import {TechnicalSpecificationS_QUERY, PROJECTS_QUERY, STAGES_QUERY, TEMPLATE_TechnicalSpecificationS_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";
// import {ADD_TechnicalSpecification_MUTATION} from "../../../../graphql/mutationsTechnicalSpecification";
// import LoadingSpinnerStyles from "../../../style/LoadingSpinnerStyles";
// import {StyledButtonGreen} from "../../../style/ButtonStyles";
// import TechnicalSpecificationForm from "../../simpleForm/TechnicalSpecificationForm";
//
// const TechnicalSpecificationProjectForm = ({project, setProject, onSubmit, disable}) => {
//     // Состояния
//     const [formTechnicalSpecification] = Form.useForm();
//     const [autoCompleteTechnicalSpecification, setAutoCompleteTechnicalSpecification] = useState('');
//     const [dataTechnicalSpecifications, setDataTechnicalSpecifications] = useState(null);
//     const [actualityProjectData, setActualityProjectData] = useState(null);
//     const [addModalVisible, setAddModalVisible] = useState(false);
//
//     const handleAutoCompleteTechnicalSpecification = (value) => {
//         console.log(value);
//         setAutoCompleteTechnicalSpecification(value);
//     };
//     // Функции уведомлений
//     const openNotification = (placement, type, message) => {
//         notification[type]({
//             message: message, placement,
//         });
//     };
//     const handleAutoCompleteTechnicalSpecificationSelect = (value) => {
//         setAutoCompleteTechnicalSpecification('');
//     };
//
//     // Получение данных для выпадающих списков
//     const {loading: loadingTechnicalSpecifications, refetch: refetchTechnicalSpecifications, data: dataTechnicalSpecificationsQuery} = useQuery(TechnicalSpecificationS_QUERY, {
//         fetchPolicy: 'network-only',
//         variables: {queryOptions: {search: autoCompleteTechnicalSpecification, limit: 10, page: 1}},
//         onCompleted: (data) => {
//             if (autoCompleteTechnicalSpecification)
//                 setDataTechnicalSpecifications(data);
//         },
//
//         onError: (error) => console.log(error)
//     });
//     const handleClose = () => {
//         refetchTechnicalSpecifications();
//         setAddModalVisible(false);
//     };
//     useEffect((dataTechnicalSpecificationsQuery) => {
//         // if(dataTechnicalSpecificationsQuery)
//         //     addingTechnicalSpecifications(dataTechnicalSpecificationsQuery)
//         // else
//         //     dataTechnicalSpecificationsQuery ?? setDataTechnicalSpecifications(dataTechnicalSpecificationsQuery);
//     }, [dataTechnicalSpecificationsQuery]);
//     const {
//         loading: loadingTemplate, data: dataTemplate
//     } = useQuery(TEMPLATE_TechnicalSpecificationS_TYPE_PROJECTS_QUERY, {
//         variables: {typeProject: actualityProjectData?.type_project_document?.id},
//         fetchPolicy: 'network-only',
//         onCompleted: (data) => {
//             loadTemplate();
//             addingTechnicalSpecifications(data?.templatesTechnicalSpecificationsTypeProjects?.map((titp) => titp.TechnicalSpecification))
//         }
//     });
//     //Мутация
//     const addingTechnicalSpecifications = (value) => {
//         if (!value) return;
//         const newTechnicalSpecifications = value.map(a => ({
//             id: a?.id ?? null, name: a?.name ?? null,
//         }));
//         const existingTechnicalSpecifications = dataTechnicalSpecifications?.TechnicalSpecifications ? dataTechnicalSpecifications?.TechnicalSpecifications?.items : [];
//         const updatedTechnicalSpecifications = [...existingTechnicalSpecifications, ...newTechnicalSpecifications];
//         setDataTechnicalSpecifications({
//             ...dataTechnicalSpecifications,
//             TechnicalSpecifications: {
//                 ...dataTechnicalSpecifications?.TechnicalSpecifications,
//                 items: updatedTechnicalSpecifications,
//             },
//         });
//     };
//     useEffect(() => {
//         console.log("dataTechnicalSpecificationsUpdate ", dataTechnicalSpecifications);
//     }, [dataTechnicalSpecifications]);
//     // Подгрузка формы
//     const loadTemplate = () => {
//         const TechnicalSpecifications = actualityProjectData?.project_TechnicalSpecifications?.length > 0 ? actualityProjectData.project_TechnicalSpecifications :
//             (dataTemplate?.templatesTechnicalSpecificationsTypeProjects?.length > 0 ? dataTemplate.templatesTechnicalSpecificationsTypeProjects
//                 : null);
//         if (TechnicalSpecifications) {
//             const initialValuesTechnicalSpecifications = TechnicalSpecifications?.map(data => ({
//                 TechnicalSpecification_item: data.TechnicalSpecification ? data.TechnicalSpecification.id : data.TechnicalSpecification.id,
//                 stage_number_item: data.stage_number ? data.stage_number : data.stageNumber,
//                 application_project_item: data.application_to_project ? data.application_to_project : data.applicationProject,
//                 date_complite_item: data.receivedDate,
//             }));
//             formTechnicalSpecification.setFieldsValue({TechnicalSpecificationList: initialValuesTechnicalSpecifications});
//         }
//     };
//     useEffect(() => {
//         console.log('useEffectStart', project);
//         if (project) {
//             refetchProject({queryOptions: {id: Number(project?.id)}});
//             console.log('useEffectStart', project?.project_TechnicalSpecifications?.map((pTechnicalSpecifications) => pTechnicalSpecifications.TechnicalSpecification));
//             addingTechnicalSpecifications(project?.project_TechnicalSpecifications?.map((pTechnicalSpecifications) => pTechnicalSpecifications.TechnicalSpecification));
//         }
//
//     }, []);
//     useEffect(() => {
//         loadTemplate();
//     }, [actualityProjectData]);
//     const {data: projectData, refetch: refetchProject, loading: projectLoading} = useQuery(PROJECTS_QUERY, {
//         variables: {queryOptions: {id: project?.id}},
//         fetchPolicy: 'network-only',
//         onCompleted: (data) => {
//             if (data.projects.items[0]) {
//                 console.log("data.items[0] ", data.projects.items[0]);
//                 setProject(data.projects.items[0]);
//                 setActualityProjectData(data.projects.items[0])
//             }
//             openNotification('topRight', 'success', 'Данные проекта подргужены!');
//         },
//         onError: (error) => {
//             openNotification('topRight', 'error', 'Ошибка при загрузки проекта: ' + error.message);
//         }
//     });
//     // Мутации для добавления и обновления
//     const [updateTechnicalSpecificationsToProject] = useMutation(UPDATE_TechnicalSpecificationS_TO_PROJECT_MUTATION, {
//         onCompleted: () => {
//             if (onSubmit)
//                 onSubmit();
//             openNotification('topRight', 'success', 'Данные ИРД успешно обновлены !');
//         }, onError: (error) => {
//             openNotification('topRight', 'error', 'Ошибка при добавлении данных TechnicalSpecification: ' + error.message);
//         }
//     });
//     const handleSubmit = () => {
//         const TechnicalSpecificationToProject = formTechnicalSpecification.getFieldsValue().TechnicalSpecificationList.map(TechnicalSpecification => ({
//             projectId: actualityProjectData?.id,
//             TechnicalSpecificationId: TechnicalSpecification.TechnicalSpecification_item,
//             stageNumber: parseInt(TechnicalSpecification.stage_number_item),
//             applicationProject: parseInt(TechnicalSpecification.application_project_item),
//             receivedDate: TechnicalSpecification.date_complite_item,
//         }));
//         // Вызов мутаций для обновления данных
//         updateTechnicalSpecificationsToProject({
//             variables: {
//                 data: TechnicalSpecificationToProject
//             }
//         });
//     };
//     if (loadingTemplate || projectLoading)
//         return <LoadingSpinnerStyles/>
//
//     const saveTemplate = () => {
//         console.log("saveTemplate");
//     }
//
//     return (
//         <StyledFormBig form={formTechnicalSpecification} name="dynamic_form_nest_item" autoComplete="off" disabled={disable}>
//             <Form.List name="TechnicalSpecificationList">
//                 {(fields, {add, remove}) => (<>
//                     {fields.map(({key, name, ...restField}) => (<Space
//                         key={key}
//                         style={{
//                             display: 'flex', marginBottom: 2, marginTop: 2
//                         }}
//                         align="baseline"
//                     >
//                         <Tooltip title="Номер этапа">
//                             <Form.Item
//                                 {...restField}
//                                 name={[name, 'stage_number_item']}
//                                 style={{display: 'flex', marginBottom: 0}}
//                             >
//                                 <InputNumber max={100} min={0} prefix={"№"}/>
//                             </Form.Item>
//                         </Tooltip>
//                         <Tooltip title="Номер в приложении">
//                             <Form.Item
//                                 {...restField}
//                                 name={[name, 'application_project_item']}
//                                 style={{display: 'flex', marginBottom: 0}}
//                             >
//                                 <InputNumber max={100} min={0} prefix={"№"}/>
//                             </Form.Item>
//                         </Tooltip>
//                         <Tooltip title="Наименование ИРД">
//                             <Form.Item
//                                 {...restField}
//                                 style={{width: 570, minWidth: 220, marginBottom: 0}}
//                                 name={[name, 'TechnicalSpecification_item']}
//                             >
//                                 <Select
//                                     style={{width: 570, minWidth: 220, marginBottom: 0}}
//                                     popupMatchSelectWidth={false}
//                                     filterOption={false}
//                                     placeholder="Начните ввод..."
//                                     onSearch={(value) => handleAutoCompleteTechnicalSpecification(value)}
//                                     onSelect={(value) => handleAutoCompleteTechnicalSpecificationSelect(value)}
//                                     allowClear
//                                     showSearch
//                                 >
//                                     {dataTechnicalSpecifications?.TechnicalSpecifications?.items?.map(TechnicalSpecification => (
//                                         <Select.Option key={TechnicalSpecification.id}
//                                                        value={TechnicalSpecification.id}>
//                                             {TechnicalSpecification.name}
//                                         </Select.Option>))}
//                                 </Select>
//                             </Form.Item>
//                         </Tooltip>
//                         <Tooltip title="Дата получения">
//                             <Form.Item
//                                 {...restField}
//                                 name={[name, 'isChecked']}
//                                 valuePropName="date_complite_item"
//                                 style={{
//                                     display: 'flex', marginBottom: 0, marginTop: 0
//                                 }}
//                             >
//                                 <DatePicker
//                                     disabled={disable}
//                                     status={"warning"}
//                                     placeholder="Получено"/>
//                             </Form.Item>
//                         </Tooltip>
//                         <MinusCircleOutlined onClick={() => remove(name)}/>
//                     </Space>))}
//                     <Form.Item block style={{width: "100%"}}>
//                         <Space.Compact block style={{width: "100%"}}>
//                             <Button style={{width: "100%"}} type="dashed" onClick={() => add()}
//                                     icon={<PlusOutlined/>}>
//                                 Добавить ИРД
//                             </Button>
//                             <StyledButtonGreen icon={<SaveOutlined/>}
//                                                onClick={() => setAddModalVisible(true)}>Создать ИРД</StyledButtonGreen>
//                             <Button type={"primary"} onClick={() => saveTemplate()} icon={<CloudUploadOutlined/>}>Сохранить
//                                 в шаблоне</Button>
//
//                         </Space.Compact>
//
//                     </Form.Item>
//                 </>)}
//             </Form.List>
//             <div style={{textAlign: 'center'}}>
//                 <Space>
//                     <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
//                         Сохранить проект
//                     </StyledButtonGreen>
//                 </Space>
//             </div>
//             <Modal
//                 open={addModalVisible}
//                 onCancel={() => setAddModalVisible(false)}
//                 footer={null}
//                 onClose={handleClose}
//             >
//                 <TechnicalSpecificationForm onClose={handleClose}/>
//             </Modal>
//         </StyledFormBig>
//     )
// };
//
// export default TechnicalSpecificationProjectForm;
