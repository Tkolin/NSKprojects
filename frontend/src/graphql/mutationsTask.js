// Мутации
import {gql} from "@apollo/client";

export const ADD_AND_UPDATE_TASK_MUTATION = gql`
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

