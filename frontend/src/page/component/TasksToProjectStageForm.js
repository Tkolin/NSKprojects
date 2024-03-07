import React, { useState, useEffect } from 'react';
import { Tree, Radio, Form } from 'antd';
import { useQuery } from "@apollo/client";
import { StyledBlockBig } from "../style/BlockStyles";
import { StyledFormItem } from "../style/FormStyles";
import {LoadingOutlined} from "@ant-design/icons";
import {TEMPLATE_TASKS_TYPE_PROJECTS_QUERY} from "../../graphql/queries";

const TasksToProjectStageForm = (project, onSubmit ) => {
    const [stagesArray, setStagesArray] = useState(null);


    const [dataSource, setDataSource] = useState();
    const [formStages] = Form.useForm();

    // Запрос данных с сервера
    const { loading, error, data: dataTasks } = useQuery(TEMPLATE_TASKS_TYPE_PROJECTS_QUERY, {
        onCompleted: (data) => setDataSource(renderTree(addNumbersToHierarchy(buildHierarchy(data?.templatesTasksTypeProjects || [])))),
        variables: { typeProjectId: project?.type_project_document?.id },
    });
    const { loading, error, data: dataTasks } = useQuery(TEMPLATE_TASKS_TYPE_PROJECTS_QUERY, {
        onCompleted: (data) => setDataSource(renderTree(addNumbersToHierarchy(buildHierarchy(data?.templatesTasksTypeProjects || [])))),
        variables: { typeProjectId: project?.type_project_document?.id },
    });

    const [selectedStage, setSelectedStage] = useState(1);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedTasksToStage, setSelectedTasksToStage] = useState([{ stageId: 1, selectedTasksId: [] }]);

    useEffect(() => {

    }, [project]);

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
                return { ...task, children };
            });
    };

    // Логика для добавления номеров к именам задач
    const addNumbersToHierarchy = (tasks, parentNumber = "") => {
        return tasks.map((task, index) => {
            const number = parentNumber === "" ? `${index + 1}` : `${parentNumber}.${index + 1}`;
            const numberedName = `${number} ${task.task.name}`;
            const children = task.children ? addNumbersToHierarchy(task.children, number) : null;
            return { ...task, task: { ...task.task, name: numberedName }, children };
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
                return { ...item, selectedTasksId: checkedKeys };
            }
            return item;
        });
        setSelectedTasksToStage(updatedSelectedTasksToStage);
    };
    if(loading)
        return <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    return (
        <StyledBlockBig>
            <Form form={formStages} style={{ width: '50%' }}>
                {stagesArray?.map(stage => (
                    <StyledFormItem key={stage.id}>
                        <h3></h3>
                        <Radio
                            checked={selectedStage === stage.id}
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
        </StyledBlockBig>
    );
};

export default TasksToProjectStageForm;
