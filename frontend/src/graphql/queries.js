// Ваш проект/frontend/src/graphql/queries.js

import { gql } from '@apollo/client';

export const CONTACTS_QUERY = gql`
    query ContactsQuery {
        contacts {
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
        organizations {
            id
            name
        }
    }
`;
export const ORGANIZATION_AND_POSITION_NAMES_QUERY = gql`
    query OrganizationNamesQuery {
        organizations {
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

export const PROJECT_QUERY = gql`
    query ProjectQuery {
        projects {
            number
            name

            date_signing

            duration
            date_end
    
            date_completion
        }
    }
`;
export const PROJECT_STAGE_QUERY = gql`
    query CurrentUser {
        projectStages{
            id
            project{
                id
                name
            }
            stage{
                id
                name
            }
            progress
            date_start
            duration
        }
    }
`;
export const ORGANIZATION_QUERY = gql`
    query ContactsQuery {
        organizations {
            legal_form{
                id
                name
            }
            name
            full_name
            address_legal{
                id
                name
            }
            office_number_legal
            address_mail{
                id
                name
            }
            office_number_mail
            phone_number
            fax_number
            email
            INN
            OGRN
            OKPO
            KPP
            BIK{
                id
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;
export const ADD_PROJECT_VIEW_DATA_QUERY = gql`
    query OrganizationNamesQuery {
        positionsNames {
            id
            name
        }
        projectStatuses
        {
            id
            name
        }
        organizations
        {
            id
            name
        }
        typeProjectDocuments
        {
            id
            name
        }
        facilitys
        {
            id
            name
        }
        iads
        {
            id
            name
        }
    }
`;
export const ADD_PROJECT_MUTATION = gql`
    mutation AddProject($number: String!, $name: String!, $organization_customer_id: ID, $type_project_document_id: ID, $facility_id: ID,
        $date_signing: String, $IAD_id: ID, $duration: String, $date_end: String, $status_id: ID, $date_completion: String ) {
        addProject(
            number: $number
            name: $name
            organization_customer_id: $organization_customer_id
            type_project_document_id: $type_project_document_id
            facility_id: $facility_id
            date_signing: $date_signing
            IAD_id: $IAD_id
            duration: $duration
            date_end: $date_end
            status_id: $status_id
            date_completion: $date_completion
        ) {
            id
            number
            name
            organization_customer
            {
                id
                name
            }
            type_project_document
            {
                id
                name
            }
            facility
            {
                id
                name
            }
            date_signing
            IAD
            {
                id
                name
            }
            duration
            date_end
            status
            {
                id
                name
            }
            date_completion
        }
    }
`;
export const ADD_CONTACT_MUTATION = gql`
    mutation AddContact($first_name: String!, $last_name: String,$patronymic: String, $mobile_phone: String, $email: String, $sibnipi_email: String, 
        $position_id: ID, $organization_id: ID ) {
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
            organization {
                id
                name
            }
        }
    }
`;
export const UPDATE_CONTACT_MUTATION = gql`
    mutation AddContact($id: ID!, $first_name: String!, $last_name: String,$patronymic: String, $mobile_phone: String, $email: String, $sibnipi_email: String,
        $position_id: ID, $organization_id: ID ) {
        updateContact(
            id: $id
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
            organization {
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

