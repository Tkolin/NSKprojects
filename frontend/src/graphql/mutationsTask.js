import {gql} from "@apollo/client";
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
    mutation UpdateTaskToProject($data: [TasksToProject], $rules: String) {
        updateTaskToProject(data: $data, rules: $rules) {
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
        }
    }
`;