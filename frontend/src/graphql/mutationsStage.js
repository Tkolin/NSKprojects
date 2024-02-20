
// Мутации
import {gql} from "@apollo/client";

export const ADD_STAGE_MUTATION = gql`
    mutation AddStage(
        $name: String!,
    ) {
        addStage(
            name: $name
        ) {
            id
            name
        }
    }
`;
export const UPDATE_STAGE_MUTATION = gql`
    mutation UpdateStage(
        $id: ID!,
        $name: String!,
    ) {
        updateStage(
            id: $id
            name: $name
        ) {
            id
            name
        }
    }
`;

