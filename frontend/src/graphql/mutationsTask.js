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
        $data: TasksToProject
    ) {
        updateTaskToProject(
            data: $data
        ) 
    }
`;
export const ADD_TASK_TO_PROJECT_MUTATION = gql`
    mutation AddTaskToProject(
        $data: TasksToProject
    ) {
        addTaskToProject(
            data: $data
        ) 
    }
`;
export const UPDATE_TASK_MUTATION = gql`
    mutation AddAndUpdateTask(
        $names: [String!]
    ) {
        updateTask(
            names: $names
        ) {
            id
            name
        }
    }
`;
export const ADD_TASK_MUTATION = gql`
    mutation AddAndUpdateTask(
        $names: [String!]
    ) {
        updateTask(
            names: $names
        ) {
            id
            name
        }
    }
`;