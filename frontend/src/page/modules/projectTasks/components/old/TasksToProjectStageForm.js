import React, {useState, useEffect} from 'react';
import {Tree, Radio, Form, notification} from 'antd';
import {useMutation, useQuery} from "@apollo/client";
import {
    STAGES_TO_PROJECT_QUERY,
    TASKS_TO_PROJECT_QUERY, TEMPLATE_TASKS_TYPE_PROJECTS_QUERY,

} from "../../../../../graphql/queries";
import LoadingSpinnerStyles from "../../../../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../../../../components/style/ButtonStyles";
import {UPDATE_STAGES_TO_PROJECT_MUTATION, UPDATE_TASKS_TO_PROJECT_MUTATION} from "../../../../../graphql/mutationsProject";
import {ADD_TASK_TO_PROJECT_MUTATION, ADD_TASK_MUTATION} from "../../../../../graphql/mutationsTask";
import {StyledBlockBig} from "../../../../../components/style/BlockStyles";
import {StyledFormItem} from "../../../../../components/style/FormStyles";

const TasksToProjectStageForm = ({project, onSubmit}) => {
    const [stagesArray, setStagesArray] = useState(null);
    const [dataSource, setDataSource] = useState();
    const [formStages] = Form.useForm();

    // Запрос данных с сервера
    const {loading: loadingStage, error: errorStage, data: dataStage} = useQuery(STAGES_TO_PROJECT_QUERY, {
        variables: {projectId: project?.id},

        onCompleted: (data) => setStagesArray(data.projectStages.map(d => d.stage))
    });
    const {loading: loadingTasks, error, data: dataTasks} = useQuery(TEMPLATE_TASKS_TYPE_PROJECTS_QUERY, {
        variables: {typeProject: project?.type_project_document?.id},
        onCompleted: (data) => setDataSource(renderTree(addNumbersToHierarchy(buildHierarchy(data?.templatesTasksTypeProjects || [])))),
    });

    const [selectedStage, setSelectedStage] = useState(1);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedTasksToStage, setSelectedTasksToStage] = useState([{stageId: 1, selectedTasksId: []}]);


    useEffect(() => {
        const initialSelectedTasksToStage = stagesArray?.map(stage => ({
            stageId: stage.id,
            selectedTasksId: []
        }));
        setSelectedTasksToStage(initialSelectedTasksToStage);
    }, [stagesArray]);

    // Логика для построения иерархии задач
    const buildHierarchy = (tasks, parentId = null) => {
        return tasks
            .filter(task => task.inherited_task_id === parentId)
            .map(task => {
                const children = buildHierarchy(tasks, task.id);
                return {...task, children};
            });
    };

    // Логика для добавления номеров к именам задач
    const addNumbersToHierarchy = (tasks, parentNumber = "") => {
        return tasks.map((task, index) => {
            const number = parentNumber === "" ? `${index + 1}` : `${parentNumber}.${index + 1}`;
            const numberedName = `${number} ${task.task.name}`;
            const children = task.children ? addNumbersToHierarchy(task.children, number) : null;
            return {...task, task: {...task.task, name: numberedName}, children};
        });
    };

    // Логика для отображения дерева задач
    const renderTree = (dataSource) => {
        return dataSource.map(item => ({
            key: item.id,
            title: item.task.name,
            disabled: item.disableCheckbox,
            children: item.children ? renderTree(item.children) : null,
        }));
    };

    // Установка состояния выбранных задач для текущего этапа
    const setSelectedTasksForStage = (stageId) => {
        const selectedTasksForStage = selectedTasksToStage.find(item => item.stageId === stageId);
        if (selectedTasksForStage) {
            setSelectedTasks(selectedTasksForStage.selectedTasksId);
        } else {
            setSelectedTasks([]);
        }
    };

    // Обработчик изменения этапа
    const handleStageChange = (stageId) => {
        setSelectedStage(stageId);
        setSelectedTasksForStage(stageId);

        const blockedTasks = selectedTasksToStage
            .filter(item => item.stageId !== stageId)
            .flatMap(item => item.selectedTasksId);

        const setDisabledState = (item, blockedTasks) => {
            const isParentSelected = blockedTasks.includes(item.key);
            const isAnyChildSelected = item.children && item.children.some(child => blockedTasks.includes(child.key));
            return {
                ...item,
                disableCheckbox: isParentSelected || isAnyChildSelected,
                children: item.children ? item.children.map(child => setDisabledState(child, blockedTasks)) : null,
            };
        };

        const updatedDataSource = dataSource.map(item => setDisabledState(item, blockedTasks));
        setDataSource(updatedDataSource);
    };

    // Обработчик выбранных задач
    const handleSelectedTasks = (checkedKeys) => {
        setSelectedTasks(checkedKeys);
        const updatedSelectedTasksToStage = selectedTasksToStage.map(item => {
            if (item.stageId === selectedStage) {
                return {...item, selectedTasksId: checkedKeys};
            }
            return item;
        });
        setSelectedTasksToStage(updatedSelectedTasksToStage);
    };
    // Мутации для добавления и обновления
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    const extractDataFromTree = (treeData, parentKey = null) => {
        const extractedData = [];
        const extract = (data, parentKey) => {
            data.forEach((item) => {
                const currentKey = item.key;
                extractedData.push({
                    task_id: currentKey,
                    up_task_id: parentKey,
                });
                if (item.children) {
                    extract(item.children, currentKey);
                }
            });
        };
        extract(treeData, parentKey);
        return extractedData;
    };
    const [updateTasksToProject] = useMutation(UPDATE_TASKS_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });
    const [addTasksToProject] = useMutation(ADD_TASK_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Этапы зарегистрированны как задачи"!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при регистрации этапов как задач: ' + error.message);
        }
    });
    const handleSubmit = () => {


        const tasksNames = null; // Получить из ArrayStage имена

        addTasksToProject({
                variables: {
                    names: tasksNames
                }
            }
        );

        const data = extractDataFromTree(dataSource); //Перебрать иерархию задач по этапам (которые теперь тоже задачи)

        updateTasksToProject({
            variables: {
                data: data
            }
        })

        if (onSubmit)
            onSubmit();
    }

    if (loadingTasks || loadingStage)
        return <LoadingSpinnerStyles/>

    return (
        <StyledBlockBig>
            <Form form={formStages} style={{width: '50%'}}>
                {stagesArray?.map(stage => (
                    <StyledFormItem key={stage.id}>
                        <h3></h3>
                        <Radio
                            checked={selectedStage === stage.id}
                            style={{marginBottom: 2}}
                            onChange={() => handleStageChange(stage.id)}
                        >
                            {stage.name}
                        </Radio>
                    </StyledFormItem>
                ))}
            </Form>
            <Tree
                checkable
                treeData={dataSource}
                onCheck={(checkedKeys) => handleSelectedTasks(checkedKeys)}
                checkedKeys={selectedTasks}
            />
            <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                Сохранить
            </StyledButtonGreen>
        </StyledBlockBig>
    );
};

export default TasksToProjectStageForm;
