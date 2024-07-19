
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
        $data: StageInput,
    ) {
        createStage(
            data: $data
        ) {
            id
            name
        }
    }
`;
export const UPDATE_STAGE_MUTATION = gql`
    mutation UpdateStage(
        $id: ID!,
        $data: StageInput,
    ) {
        updateStage(
            id: $id
            data: $data
        ) {
            id
            name
        }
    }
`;

