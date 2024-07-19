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
        $data: TypeProjectInput
    ) {
        createTypeProject(
            data: $data
        ) {
            id
            name
            code
            group {
                id
                name
            }
        }
    }
`;
export const UPDATE_TYPE_PROJECTS_MUTATION = gql`
    mutation UpdateTypeProject(
        $id: ID!,
        $data: TypeProjectInput
     ) {
        updateTypeProject(
            id: $id
            data: $data

        ) {
            id
            name
            code
            group {
                id
                name
            }
             
        }
    }
`;


export const ADD_GROUP_TYPE_PROJECTS_MUTATION = gql`
    mutation AddTypeProject(
        $data: GroupTypeProject
    ) {
        createTypeProject(
         data: $data
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
        $data: GroupTypeProject

    ) {
        updateTypeProject(
            id: $id
            data: $data

        ) {
            id
            name
            code
        }
    }
`;

