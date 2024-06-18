import {gql} from "@apollo/client";


export const UPDATE_EMPLOYEES_TO_TASKS = gql`
    mutation UpdateEmployeesToTasks(
        $tasksIds: [ID]!
        $employeesIds: [ID]!
        $stageNumber: Int
    ) {
        updateEmployeesToTasks(
            tasksIds: $tasksIds
            employeesIds: $employeesIds
            stageNumber: $stageNumber
        )
        {
            id
            stage_number
            task {
                id
                name
            }
        }
    }
`;
export const UPDATE_EXECUTORS_TO_TASKS = gql`
    mutation UpdateExecutorsToTasks(
        $data: [ExecutorToTask]!
    ) {
        updateExecutorToTasks(
            data: $data
        )
        {
            id
            project_tasks {
                id
                description
                inherited_task_ids {
                    project_task_id
                    project_inherited_task_id
                }
                price
                task {
                    id
                    name
                }
                date_start
                duration
                date_end
                stage_number
                executors {
                    id
                    price
                    executor {
                        id
                        passport {
                            id
                            firstname
                            lastname
                            patronymic
                        }
                        payment_account
                    }
                }
            }
        }
    }
`;

export const DELETE_TASK_TO_PROJECT_MUTATION = gql`
    mutation DeleteTaskToProject(
        $id: ID!
    ) {
        deleteTaskToProject(
            id: $id
        )
    }
`;
export const UPDATE_TASK_TO_PROJECT_MUTATION = gql`
    mutation UpdateTaskToProject($data: [TasksToProject]!) {
        updateTaskToProject(data: $data) {
            id
            project_tasks {
                id
                description
                inherited_task_ids {
                    project_task_id
                    project_inherited_task_id
                }
                price
                task {
                    id
                    name
                }
                date_start
                duration
                date_end
                stage_number
            }

        }
    }
`;
export const CREATE_TASKS_TO_PROJECT = gql`
    mutation CreateTaskToProject($data: [TasksToProjectExs]!) {
        createTasksToProject(data: $data) {
            id
            project_tasks {
                id
                description
                inherited_task_ids {
                    project_task_id
                    project_inherited_task_id
                }
                price
                task {
                    id
                    name
                }
                date_start
                duration
                date_end
                stage_number
                executors {
                    id
                    price
                    executor {
                        id
                        passport {
                            id
                            firstname
                            lastname
                            patronymic
                        }
                        payment_account
                    }
                }
            }

        }
    }
`;

export const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask(
        $name: String
    ) {
        updateTask(
            name: $name
        ) {
            id
            name
        }
    }
`;
export const ADD_TASK_MUTATION = gql`
    mutation AddTask(
        $name: String
    ) {
        createTask(
            name: $name
        ) {
            id
            name
            __typename
        }
    }
`;