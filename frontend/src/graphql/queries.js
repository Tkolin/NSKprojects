import { gql } from '@apollo/client';

// Запросы данных
export const BIK_QUERY = gql`
    query ProjectQuery {
        biks {
            id
            Bik
            name
            correspondent_account
        }
    }
`;
export const ORGANIZATION_QUERY = gql`
    query OrganizationsQuery {
        organizations {
            id
            name
            full_name
            legal_form{
                id
                name
            }
            address_legal
            office_number_legal
            address_mail
            office_number_mail
            phone_number
            fax_number
            email
            INN
            OGRN
            OKPO
            KPP
            Bik{
                id
                Bik
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
// TODO: не реализовано
export const CURRENT_DELEGATE_QUERY = gql`
    query CurrentDelegatesQuery {
        delegates {
            id
            first_name
        }
        
    }
`;
export const PROJECT_QUERY = gql`
    query ProjectQuery {
        projects {
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
            duration
            date_end
            status
            {
                id
                name
            }
            date_completion
            delegate{
                id
                first_name
                last_name
                patronymic
            }
        }
    }
`;
export const PPI_QUERY = gql`
    query PpiQuery {
        passportPlaceIssues {
            id
            name
            code
        }
    }
`;
export const PERSON_QUERY = gql`
    query PersonQuery {
        persons {
                id
            passport{
                firstname
                lastname
                patronymic
                serial
                number
                passport_place_issues{
                    id
                    name
                }
                birth_date
                date
            }
            SHILS
            INN
            payment_account
            phone_number
            email
            email_sibnipi
            bank{
                id
                name
            }
            BIK{
                id
                Bik
            }

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

export const CONTACTS_QUERY = gql`
    query ContactsQuery {
        contacts {
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

export const PROJECT_STAGE_QUERY = gql`
    query ProjectStage {
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



