import {gql} from "@apollo/client";




export const UPDATE_TASK_MUTATION = gql`
    mutation UpdateTask(
        $data: TaskInput
    ) {
        updateTask(
            data: $data
        ) {
            id
            name
        }
    }
`;
export const ADD_TASK_MUTATION = gql`
    mutation AddTask(
        $data: TaskInput
    ) {
        createTask(
            data: $data
        ) {
            id
            name
            __typename
        }
    }
`;
export const DDD = gql`
    query TestMutata {
        testMutata {
            id
            name
        }
    }
`;