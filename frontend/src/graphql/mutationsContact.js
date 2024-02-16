import {gql} from "@apollo/client";
export const DELETE_CONTACT_MUTATION = gql`
    mutation DeletContact($id: ID! ) {
        deleteContact(
            id: $id
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
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

export const ADD_CONTACT_MUTATION = gql`
    mutation AddContact($first_name: String!,
        $last_name:
        String,
        $patronymic: String,
        $birth_day: String,
        $work_phone: String,
        $work_email: String,
        $mobile_phone: String,
        $email: String,
        $position_id: ID,
        $organization_id: ID,
 
    ) {
        addContact(
            first_name: $first_name
            last_name: $last_name
            patronymic: $patronymic
            birth_day: $birth_day
            work_phone: $work_phone
            work_email: $work_email
            mobile_phone: $mobile_phone
            email: $email
            position_id: $position_id
            organization_id: $organization_id

        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
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
    mutation AddContact($id: ID!, $first_name:
    String!, $last_name: String,$patronymic: String,
        $birth_day: String,
        $work_phone: String,
        $work_email: String,
        $mobile_phone: String,
        $email: String,
        $position_id: ID,
        $organization_id: ID) {
        updateContact(
            id: $id
            first_name: $first_name
            last_name: $last_name
            patronymic: $patronymic
            birth_day: $birth_day
            work_phone: $work_phone
            work_email: $work_email
            mobile_phone: $mobile_phone
            email: $email
            position_id: $position_id
            organization_id: $organization_id
        ) {
            id
            first_name
            last_name
            patronymic
            birth_day
            work_phone
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
