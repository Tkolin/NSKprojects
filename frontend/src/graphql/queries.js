// Ваш проект/frontend/src/graphql/queries.js

import { gql } from '@apollo/client';

export const CONTACTS_QUERY = gql`
    query Contacts {
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

export const ADD_CONTACT_MUTATION = gql`
    mutation AddContact($first_name: String!, $last_name: String!, $mobile_phone: String!, $email: String!, $sibnipi_email: String!) {
        addContact(
            first_name: $first_name
            last_name: $last_name
            mobile_phone: $mobile_phone
            email: $email
            sibnipi_email: $sibnipi_email
            position_id: "1"
        ) {
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

