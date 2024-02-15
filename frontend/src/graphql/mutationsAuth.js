import {gql} from "@apollo/client";

export const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            user {
                id
                name
                email
            }
            access_token
        }
    }
`;
export const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            user {
                id
                name
                email
                role {
                    id
                    name
                }
            }
            access_token
        }
    }
`;