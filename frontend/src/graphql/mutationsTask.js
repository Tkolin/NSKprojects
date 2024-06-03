import {gql} from "@apollo/client";
export const DELETE_TASK_TO_PROJECT_MUTATION = gql`
    mutation DeleteTaskToProject(
        $id: ID!
    ) {
        deleteTaskToProject(
            id: $id
        ) 
    }
`;export const UPDATE_TASK_TO_PROJECT_MUTATION = gql`
    mutation UpdateTaskToProject(
        $data: [TasksToProject]
    ) {
        updateTaskToProject(
            data: $data
        ) 
    }
`;
export const ADD_TASK_TO_PROJECT_MUTATION = gql`
    mutation AddTaskToProject(
        $data: [TasksToProject]
    ) {
        createTaskToProject(
            data: $data
        ) 
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