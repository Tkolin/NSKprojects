
// Мутации
import {gql} from "@apollo/client";

export const DELETE_IRD_MUTATION = gql`
    mutation DeletIrd($id: ID! ) {
        deleteIrd(
            id: $id
        )
    }
`;

export const ADD_IRD_MUTATION = gql`
    mutation AddIrd(
        $data: IrdInput,
    ) {
        createIrd(
            data: $data
        ) {
            id
            name
        }
    }
`;
export const UPDATE_IRD_MUTATION = gql`
    mutation UpdateIrd(
        $id: ID!,
        $data: IrdInput,
    ) {
        updateIrd(
            id: $id
            data: $data
        ) {
            id
            name
        }
    }
`;

