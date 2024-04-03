import {gql} from "@apollo/client";
export const UPDATE_TASK_TO_PROJECT_MUTATION = gql`
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
export const ADD_TASK_TO_PROJECT_MUTATION = gql`
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