// Ваш проект/frontend/src/graphql/queries.js

import { gql } from '@apollo/client';

export const CONTACTS_QUERY = gql`
    query ContactsQuery {
        contacts {
            id
            first_name
            last_name
            mobile_phone
            email
            sibnipi_email
            position {
                id
                name
            }
        }
    }
`;
export const POSITIONS_NAMES_QUERY = gql`
    query PositionNamesQuery {
        positionsNames {
            id
            name
        }
    }
`;
export const ORGANIZATION_NAMES_QUERY = gql`
    query OrganizationNamesQuery {
        organizationNames {
            id
            name
        }
    }
`;
export const ORGANIZATION_AND_POSITION_NAMES_QUERY = gql`
    query OrganizationNamesQuery {
        organizationNames {
            id
            name
        }
        positionsNames {
            id
            name
        }
    }
`;
export const CURRENT_USER_QUERY = gql`
    query CurrentUser {
        currentUser {
                id
                name
                email
                role {
                    id
                    name
                }
        }
    }
`;


export const ADD_CONTACT_MUTATION = gql`
    mutation AddContact($first_name: String!, $last_name: String!,$patronymic: String!, $mobile_phone: String!, $email: String!, $sibnipi_email: String!, $position_id: ID! ) {
        addContact(
            first_name: $first_name
            last_name: $last_name
            patronymic: $patronymic
            mobile_phone: $mobile_phone
            email: $email
            sibnipi_email: $sibnipi_email
            position_id: $position_id
            organization_id: $organization_id
        ) {
            id
            first_name
            last_name
            patronymic
            mobile_phone
            email
            sibnipi_email
            position {
                id
                name
            }
            position {
                id
                name
            }
        }
    }
`;

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

