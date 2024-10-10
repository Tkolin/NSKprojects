import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            user {
                id
                name
                email
            }
            permissions {
                description
                name
            }
            roles {
                description
                name

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
            }
            permissions {
                name_key
                description
                name
            }
            roles {
                description
                name

            }
            access_token
        }
    }
`;