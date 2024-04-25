
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
        $name: String!,
    ) {
        createIrd(
            name: $name
        ) {
            id
            name
        }
    }
`;
export const UPDATE_IRD_MUTATION = gql`
    mutation UpdateIrd(
        $id: ID!,
        $name: String!,
    ) {
        updateIrd(
            id: $id
            name: $name
        ) {
            id
            name
        }
    }
`;

