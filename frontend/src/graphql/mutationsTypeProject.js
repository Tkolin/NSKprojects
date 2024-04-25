// Мутации
import {gql} from "@apollo/client";

export const DELETE_TYPE_PROJECT_MUTATION = gql`
    mutation DeleteTypeProject($id: ID! ) {
        deleteTypeProject(
            id: $id
        )
    }
`;

export const ADD_TYPE_PROJECTS_MUTATION = gql`
    mutation AddTypeProject(
        $name: String!,
        $code: String,
        $group_id: ID,
    ) {
        createTypeProject(
            name: $name
            group_id: $group_id
            code: $code
        ) {
            id
            name
            code
        }
    }
`;
export const UPDATE_TYPE_PROJECTS_MUTATION = gql`
    mutation UpdateTypeProject(
        $id: ID!,
        $name: String!,
        $code: String,        
        $group_id: ID,
     ) {
        updateTypeProject(
            id: $id
            name: $name
            group_id: $group_id
            code: $code

        ) {
            id
            name
             
        }
    }
`;

export const ADD_TECHNICAL_SPECIFICATION_MUTATION = gql`
    mutation AddTypeProject(
        $name: String!,
        $code: String!,
    ) {
        createTypeProject(
            name: $name
            code: $code
        ) {
            id
            name
            code
        }
    }
`;
export const UPDATE_TECHNICAL_SPECIFICATION_MUTATION = gql`
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


export const ADD_GROUP_TYPE_PROJECTS_MUTATION = gql`
    mutation AddTypeProject(
        $name: String!,
        $code: String!,
    ) {
        createTypeProject(
            name: $name
            code: $code
        ) {
            id
            name
            code
        }
    }
`;
export const UPDATE_GROUP_TYPE_PROJECTS_MUTATION = gql`
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

