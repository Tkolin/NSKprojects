import {gql} from "@apollo/client";

export const DELETE_CONTACT_MUTATION = gql`
    mutation DeletContact($id: ID! ) {
        deleteContact(
            id: $id
        )
    }
`;

export const ADD_CONTACT_MUTATION = gql`
    mutation AddContact(
        $data: ContactInput
    ) {
        createContact(
            data: $data
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
            work_email
            mobile_phone
            email
            position {
                id
                name
            }
            organization {
                id
                name
            }

        }
    }
`;
export const UPDATE_CONTACT_MUTATION = gql`
    mutation UpdateContact(
        $id: ID!,
        $data: ContactInput
    ) {
        updateContact(
            id: $id
            data: $data
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
            work_email
            mobile_phone
            email
            position {
                id
                name
            }
            organization {
                id
                name
            }
        }
    }
`;
