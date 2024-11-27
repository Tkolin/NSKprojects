import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Card,
  Col,
  Form,
  Row,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { nanoid } from "nanoid";
import React, { useContext, useEffect, useState } from "react";
import { TASKS_QUERY_COMPACT } from "../..//graphql/queries/queriesCompact";
import { PROJECT_TASKS_STRUCTURE_UPDATE } from "../../graphql/mutations/project";
import { ADD_TASK_MUTATION } from "../../graphql/mutations/task";
import { NotificationContext } from "../../NotificationProvider";
import { CustomAutoCompleteAndCreate } from "../components/style/SearchAutoCompleteStyles";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";
import TasksTreeComponent from "./components/TasksTreeComponent";

const { Text, Link } = Typography;

const ProjectTasksStructureForm = ({
  actualProject,
  setLoading,
  onCompleted,
  cardProps,
}) => {
  //Вынести за компонен
  const [form] = Form.useForm();
  const { openNotification } = useContext(NotificationContext);
  const [selectedTasksIds, setSelectedTasksIds] = useState([]);
  const [projectTasksTimings, setProjectTasksTimings] = useState({});

  // Функция для обновления состояния с новыми значениями

  // const [addMarker, setAddMarker] = useState();
  // Список задач
  const {
    loading: loadingTasks,
    error: errorTasks,
    data: dataTasks,
    refetch: refetchTasks,
  } = useQuery(TASKS_QUERY_COMPACT);

  const extractKeys = (tasksByStage, project, projectTimers) => {
    const result = [];
    const projectStages = project.project_stages;
    // Подготовка этапов
    projectStages.forEach((stage) => {
      const task = {
        task_id: stage?.stage?.task_id?.toString(),
        local_id: nanoid(),
        local_id_inherited: null,
        stage_number: stage.number,
      };
      result.push(task);
    });

    const traverse = (nodes, stageNumber, parentKey = null) => {
      nodes.forEach((node) => {
        let task = {
          task_id: node.task_id,
          local_id: node.key,
          local_id_inherited:
            parentKey ||
            result.find((t) => t.stage_number === stageNumber)?.local_id ||
            null,
          stage_number: stageNumber,
        };

        result.push(task);
        if (node.children) {
          traverse(node.children, stageNumber, node.key);
        }
      });
    };
    for (const [stageNumber, tasks] of Object.entries(tasksByStage)) {
      traverse(tasks, parseInt(stageNumber));
    }
    console.log("result", result);
    return result;
  };
  const [mutateTasksToProject, { loading: loadingMutation }] = useMutation(
    PROJECT_TASKS_STRUCTURE_UPDATE,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Создание новой записи выполнено успешно`
        );
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении создания: ${error.message}`
        );
      },
    }
  );
  const handleSubmit = () => {
    mutateTasksToProject({
      variables: {
        project_id: actualProject.id,
        data: extractKeys(
          Object.entries(form.getFieldsValue()).reduce(
            (acc, [stageNumber, stageData]) => {
              acc[stageNumber] = stageData.tasks || [];
              return acc;
            },
            {}
          ),
          actualProject,
          projectTasksTimings
        ),
      },
    });
  };
  const handleSelectTask = (index, value, handleDelete) => {
    const key = nanoid();
    setSelectedTasksIds([...selectedTasksIds, key]);
    const oldTasks = form.getFieldValue([index, "tasks"]);
    console.log("value ", value);
    form.setFieldValue(
      [index, "tasks"],
      [
        ...(oldTasks ?? []),
        {
          title: (
            <Space.Compact direction={"horizontal"}>
              <Text>
                {handleDelete && (
                  <Tooltip title={"Удалить задачу (не сохранёная)"}>
                    <Link onClick={() => handleDelete(key)} type={"warning"}>
                      <DeleteOutlined />
                    </Link>
                  </Tooltip>
                )}{" "}
                {value.name}
              </Text>
            </Space.Compact>
          ),
          key: key,
          task_id: value.id,
        },
      ]
    );
  };

  const handleDeleteTaskToProject = (taskToProjectId) => {
    console.log("handleDeleteTaskToProject", taskToProjectId);

    const oldTasks = form.getFieldsValue();
    console.log("oldTasks", oldTasks);

    if (!oldTasks) return;

    const removeTaskWithChildren = (tasks, taskToDeleteKey) => {
      return tasks
        .filter((task) => task.key !== taskToDeleteKey)
        .map((task) => {
          if (task.children && task.children.length > 0) {
            return {
              ...task,
              children: removeTaskWithChildren(task.children, taskToDeleteKey),
            };
          }
          return task;
        });
    };

    const newTasks = {};

    Object.keys(oldTasks).forEach((key) => {
      const oldTask = oldTasks[key];
      newTasks[key] = {
        ...oldTask,
        tasks: removeTaskWithChildren(oldTask?.tasks ?? [], taskToProjectId),
      };
    });

    form.setFieldsValue(newTasks);
  };
  const rebuider = (tasks, handleDelete) => {
    const taskMap = {};
    const tree = [];
    if (!tasks || !tasks.length) {
      return;
    }
    // Создаем хэш-таблицу для быстрого доступа к задачам по их ID
    tasks.forEach((task) => {
      const newTask = {
        stage_number: task?.stage_number,
        task_id: task.task.id,
        key: "o_" + task.id,
        id: task.id,
        title: (
          <Space.Compact direction={"horizontal"}>
            <Text>
              {handleDelete && (
                <Tooltip title={"Удалить задачу"}>
                  <Link
                    onClick={() => handleDelete("o_" + task.id)}
                    type={"danger"}
                  >
                    <DeleteOutlined />{" "}
                  </Link>
                </Tooltip>
              )}
              {task.task.name}
            </Text>
          </Space.Compact>
        ),
        children: [],
      };
      taskMap["o_" + task.id] = newTask;
    });
    // Строим дерево
    console.log("Строим дерево", taskMap);
    tasks.forEach((task) => {
      if (!task.project_task_inherited_id) {
        tree.push(taskMap["o_" + task.id]);
      } else {
        console.log("Строим дерево", "o_" + task.id, taskMap["o_" + task.id]);

        const parentId = "o_" + task.project_task_inherited_id;
        if (taskMap[parentId]) {
          taskMap[parentId].children.push(taskMap["o_" + task.id]);
        }
      }
    });
    console.log("дерево", tree);

    return tree;
  };
  const groupTasksByStageNumber = (tasks) => {
    if (!tasks) return tasks;
    return tasks.reduce((acc, task) => {
      console.log(task);
      const stageNumber = task?.stage_number;
      if (!acc[stageNumber]) {
        acc[stageNumber] = { tasks: [] };
      }
      acc[stageNumber].tasks.push(task);
      return acc;
    }, {});
  };

  useEffect(() => {
    console.log("ptsf actualProject effect", actualProject);
    if (actualProject?.project_tasks.length > 0) {
      setSelectedTasksIds([
        ...actualProject.project_stages.map((row) => row.stage.task_id),
        ...actualProject.project_tasks.map((row) => row.task.id ?? row.task_id),
      ]);
      const taskStagesIdsArray = actualProject.project_tasks
        .filter((row) => row.project_task_inherited_id === null)
        .map((row) => row.id);
      form.setFieldsValue(
        groupTasksByStageNumber(
          rebuider(
            actualProject.project_tasks
              .filter((row) => row.project_task_inherited_id !== null)
              .map((row) => {
                if (
                  taskStagesIdsArray.includes(row.project_task_inherited_id)
                ) {
                  return {
                    ...row,
                    project_task_inherited_id: null,
                  };
                } else {
                  return row;
                }
              }),
            handleDeleteTaskToProject
          )
        )
      );
    }
  }, [actualProject]);

  const [mutate, { loading: loadingSave }] = useMutation(ADD_TASK_MUTATION, {
    onCompleted: (data) => {
      refetchTasks();
      //const rowID = mutate.rowID;
      openNotification("topRight", "success", `Задача создана`);
      //handleSelectTask(rowID, data?.createTask, handleDeleteTaskToProject);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        `Ошибка при создании задачи: ${error.message}`
      );
    },
  });

  return (
    <Card
      style={{ width: 1200 }}
      {...cardProps}
      actions={[
        <ModalButton
          modalType={"green"}
          isMany={cardProps?.actions}
          loading={loadingMutation}
          onClick={() => form.submit()}
          children={"Сохранить"}
        />,
        ...(cardProps?.actions ?? []),
      ]}
      children={
        <>
          <Row gutter={1}>
            <Col span={24}>
              <Form form={form} onFinish={() => handleSubmit()}>
                {!loadingTasks ? (
                  actualProject?.project_stages?.map((row) => (
                    <Card
                      style={{ marginBottom: 5, paddingTop: 0 }}
                      key={row.number + "_stage"}
                      title={row?.number + " " + row?.stage?.name}
                    >
                      <Space.Compact
                        style={{ width: "100%" }}
                        direction={"vertical"}
                      >
                        <div style={{ width: "100%" }}>
                          <Form.Item name={[row.number, "tasks"]}>
                            <TasksTreeComponent draggable />
                          </Form.Item>
                          <Form.Item name={[row.number, "task_adder"]}>
                            <CustomAutoCompleteAndCreate
                              placeholder={"Начните ввод для поиска задачи..."}
                              loading={loadingTasks}
                              firstBtnOnClick={() => {
                                const input =
                                  form.getFieldValue([row.number, "task_adder"])
                                    ?.output ?? null;
                                if (!input) {
                                  openNotification(
                                    "topRight",
                                    "warning",
                                    "Введите название задачи"
                                  );
                                  return;
                                }
                                mutate.rowID = row.number;
                                mutate({
                                  variables: {
                                    data: {
                                      name:
                                        form.getFieldValue([
                                          row.number,
                                          "task_adder",
                                        ])?.output ?? "",
                                    },
                                  },
                                });
                              }}
                              saveSelected={false}
                              onSelect={(value) =>
                                handleSelectTask(
                                  row.number,
                                  value,
                                  handleDeleteTaskToProject
                                )
                              }
                              data={dataTasks?.tasks?.items?.filter(
                                (task) =>
                                  !selectedTasksIds.includes(parseInt(task.id))
                              )}
                            />
                          </Form.Item>
                        </div>
                      </Space.Compact>
                    </Card>
                  ))
                ) : (
                  <Skeleton active />
                )}
              </Form>
            </Col>
          </Row>
        </>
      }
    />
  );
};
export default ProjectTasksStructureForm;
