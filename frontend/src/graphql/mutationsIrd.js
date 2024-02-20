
// Мутации
import {gql} from "@apollo/client";

export const ADD_IRD_MUTATION = gql`
    mutation AddIrd(
        $name: String!,
    ) {
        addIrd(
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

