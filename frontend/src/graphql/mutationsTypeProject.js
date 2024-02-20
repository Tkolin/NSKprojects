// Мутации
import {gql} from "@apollo/client";

export const DELETE_TYPE_PROJECT_MUTATION = gql`
    mutation DeleteTypeProject($id: ID! ) {
        deleteTypeProject(
            id: $id
        )
    }
`;

export const ADD_TYPE_PROJECTS_MUTATIOM = gql`
    mutation AddTypeProject(
        $name: String!,
        $code: String!,
    ) {
        addTypeProject(
            name: $name
            code: $code
        ) {
            id
            name
            code
        }
    }
`;
export const UPDATE_TYPE_PROJECTS_MUTATIOM = gql`
    mutation UpdateTypeProject(
        $id: ID!,
        $name: String!,
        $code: String!,
    ) {
        updateTypeProject(
            id: $id
            name: $name
            code: $code
        ) {
            id
            name
            code
        }
    }
`;

