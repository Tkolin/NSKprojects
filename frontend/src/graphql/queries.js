import {gql} from '@apollo/client';

// Запросы данных
export const BIK_QUERY = gql`
    query BikQuery {
        biks {
            id
            Bik
            name
            correspondent_account
        }
    }
`;
export const TYPES_PAYMENT_QUERY = gql`
    query TypePaymentsQuery {
        TypePayments {
            id
            name
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
export const IRDS_QUERY = gql`
    query IrdQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        irdsTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
            irds {
                id
                name
            }
            count
        }
    }
`;

export const TYPES_PROJECTS_QUERY = gql`
    query TypeProjectsQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        typeProjectsTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
            typeProjects {
                id
                name
                code
            }
            count
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

export const PROJECT_TABLE_QUERY = gql`
    query ProjectTableQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        projectsTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
            projects{
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
            count
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

export const PERSON_TABLE_QUERY = gql`
    query PersonTableQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        personsTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder){
            persons {
                id
                passport{
                    id
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
                    name
                    correspondent_account
                }
            }
            count
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
export const ORGANIZATIONS_TABLE_QUERY = gql`
    query ContactsTableQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        organizationsTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
            organizations {
                id
                legal_form{
                    id
                    name
                }
                name
                full_name
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
                    correspondent_account
                    name
                }
                payment_account
                director{
                    id
                    first_name
                    last_name
                    patronymic
                }
            }
            count
        }
    }
`;
export const CONTACTS_TABLE_QUERY = gql`
    query ContactsTableQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        contactsTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
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
            count
        }
    }
`;
export const STAGES_QUERY = gql`
    query StagesQuery($page: Int, $limit: Int, $search: String, $sortField: String, $sortOrder: String) {
        stagesTable(page: $page, limit: $limit, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
            stages {
                id
                name
            }
            count
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



