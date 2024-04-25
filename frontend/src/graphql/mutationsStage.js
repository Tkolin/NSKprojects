
// Мутации
import {gql} from "@apollo/client";
export const DELETE_STAGE_MUTATION = gql`
    mutation DeleteStage($id: ID! ) {
        deleteStage(
            id: $id
        )
    }
`;
export const ADD_STAGE_MUTATION = gql`
    mutation AddStage(
        $name: String!,
    ) {
        createStage(
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

