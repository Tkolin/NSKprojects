import { create } from 'zustand';
import {persist} from "zustand/middleware";

export const useProjectStore = create((set => ({
    project: {},
    irds: [],
    stages: [],

    step: 0,
    setSteps: (newStep) => {set({step: newStep})},

    updateProject:  (newProject) => {set({ project: newProject }); console.log("newProject",newProject)},
    updateIrds: (newIrds) => {set({ irds: newIrds }) ; console.log("newIrds",newIrds)},
    updateStages:  (newStages) => {set({ stages: newStages }) ; console.log("newStages",newStages)},
})));
// const [loadContext, {loading, data}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
//     variables: {id: initialObject?.id ?? null},
//     onCompleted: (data) => {
//         setActualObject(data?.projects?.items[0]);
//         updateForm(data?.projects?.items[0]);
//     },
//     onError: (error) => {
//         openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
//     },
// });

// const [mutate] = useMutation(actualObject ? UPDATE_PROJECT_MUTATION : ADD_PROJECT_MUTATION, {
//     onCompleted: (data) => {
//         openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
//         form.resetFields();
//         onCompleted && onCompleted(data);
//     },
//     onError: (error) => {
//         openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
//     },
// });
// const handleSubmit = () => {
//     mutate({
//         variables: {
//             data: {
//                 ...compiletedFormToProjectInput(),
//             }
//         }
//     });
// };







//    const [loadContext, {loading, data}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
//         variables: {projectId: initialObject?.id ?? null},
//         onCompleted: (data) => {
//             setActualObject(data?.projects?.items[0]);
//             updateForm(data?.projects?.items[0]);
//         },
//         onError: (error) => {
//             openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
//         },
//     });
//
//     const [mutate] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
//         onCompleted: (data) => {
//             openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
//             form.resetFields();
//             onCompleted && onCompleted(data);
//         },
//         onError: (error) => {
//             openNotification('topRight', 'error', `Ошибка при выполнении создания ${nameModel}: ${error.message}`);
//         },
//     });