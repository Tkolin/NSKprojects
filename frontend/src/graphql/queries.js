import {gql} from '@apollo/client';

export const TASKS_QUERY = gql`
    query BikQuery {
        tasks  {
            items{
                id
                name
            }
        count
        }
    }
`;
export const BANKS_QUERY  = gql`
    query BanksQuery ($queryOptions: QueryOptions)  {
        banks (queryOptions: $queryOptions) 
        {
            items{
                id
                name
            }
        count
        }
    }
`;
export const PASSPORTS_PLACE_ISSUES_QUERY = gql`
    query PPIQuery ($queryOptions: QueryOptions) {
        passportPlaceIssues (queryOptions: $queryOptions)  {
            items{
                id
                name
            }
        count
        }
    }
`;
export const PROJECT_STATUSES_QUERY = gql`
    query ProjectStatuses {
        projectStatuses  {
            id
            name
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
export const ORGANIZATIONS_QUERY = gql`
    query OrganizationsQuery {
        organizations {
            items {
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
                bik{
                    id
                    bik
                    name
                }
                payment_account
                director{
                    id
                    first_name
                    last_name
                }
            }
            count
        }
    }
`;
export const ORGANIZATIONS_SHORT_QUERY = gql`
    query OrganizationsQuery ($queryOptions: QueryOptions) {
        organizations (queryOptions: $queryOptions) {
            items {
                id
                name
                full_name
                legal_form{
                    id
                    name
                }
            }
            count
        }
    }
`;
export const IRDS_QUERY = gql`
    query IrdQuery($queryOptions: QueryOptions) {
        irds (queryOptions: $queryOptions) {
            items {
                id
                name
            }
            count
        }
    }
`;
export const TYPES_PROJECTS_QUERY = gql`
    query TypeProjectsQuery($queryOptions: QueryOptions) {
        typeProjects (queryOptions: $queryOptions) {
            items {
                id
                name
                code
            }
            count
        }
    }
`;
export const PROJECTS_QUERY = gql`
    query ProjectQuery($queryOptions: QueryOptions) {
        projects (queryOptions: $queryOptions) {
            items{
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
                facilitys
                {
                    id
                    name
                }
                date_signing
                date_end
                status
                {
                    id
                    name
                }
                date_completion
                delegates{
                    id
                    first_name
                    last_name
                    patronymic
                }
                price
            }
            count
        }
    }
`;
export const PPI_QUERY = gql`
    query PpiQuery($queryOptions: QueryOptions) {
        passportPlaceIssues(queryOptions: $queryOptions) {
            items{
            id
            name
            code}
            count
        }
    }
`;
export const PERSONS_QUERY = gql`
    query PersonQuery($queryOptions: QueryOptions) {
        persons (queryOptions: $queryOptions){
            items {
                id
                passport{
                    firstname
                    lastname
                    patronymic
                    serial
                    number
                    passport_place_issue{
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
                bik{
                    id
                    bik
                    name
                }

            }
            count
        }
    }
`;
export const PERSONS_SHORT_QUERY = gql`
    query PersonQuery($queryOptions: QueryOptions) {
        persons (queryOptions: $queryOptions){
            items {
                id
                passport{
                    firstname
                    lastname
                    patronymic
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
export const STAGES_QUERY = gql`
    query StagesQuery( $queryOptions: QueryOptions) {
        stages (queryOptions: $queryOptions) {
            items {
                id
                name
            }
            count
        }
    }
`;
export const CONTACTS_QUERY = gql`
    query ContactsQuery ($queryOptions: QueryOptions) {
        contacts(queryOptions: $queryOptions) {
            items {
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
export const CONTACTS_SHORT_QUERY = gql`
    query ContactsQuery ($queryOptions: QueryOptions, $organizationId: ID) {
        contacts(queryOptions: $queryOptions, organizationId : $organizationId) {
            items {
                id
                first_name
                last_name
                patronymic
            }
            count
        }
    }
`;
export const FACILITYS_QUERY = gql`
    query ContactsQuery  {
        facilitys {
            id
            name
            type_facility {
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
            persent
            date_start
            date_end
        }
    }
`;
export const PAYMENTS_QUERY = gql`
    query BikQuery {
        tasks  {
            items {
                id
                name
            }
            count
        }
    }
`;
export const TEMPLATE_IRDS_TYPE_PROJECTS_QUERY = gql`
    query TemplatesIrdsTypeProjectsQuery ($typeProject: ID) {
        templatesIrdsTypeProjects(typeProject: $typeProject)  {
            id
            project_type{
                id
                name
            }
            ird{
                id
                name 
            }
            stage_number
            application_to_project
        }
    }
`;
export const TEMPLATE_STAGES_TYPE_PROJECTS_QUERY = gql`
    query TemplatesStagesTypeProjectsQuery ($typeProject: ID) {
        templatesStagesTypeProjects(typeProject: $typeProject)  {
            id
            stage{
                id
                name
            }
            project_type{
                id
                name
            }
            duration
            stage_number
            percentage
        }
    }
`;
export const TEMPLATE_TASKS_TYPE_PROJECTS_QUERY = gql`
    query TemplatesTasksTypeProjectsQuery ($typeProject: ID) {
        templatesTasksTypeProjects(typeProject: $typeProject)  {
            id
            task{
                id
                name
            }
            inheritedTask{
                id
                task {
                    id
                    name
                }
            }
            inherited_task_id
            stage_number
        }
    }
`;
export const POSITIONS_QUERY = gql`
    query PositionsQuery ($queryOptions: QueryOptions) {
        positions(queryOptions: $queryOptions)  {
           items {
               id
               name
           }
            count
        }
    }
`;
export const LEGAL_FORM_QUERY = gql`
    query LegalForms {
        legalForms   {
            id
            name
        }
    }
`;
export const BIKS_QUERY = gql`
    query BiksForms ($queryOptions: QueryOptions){
        biks(queryOptions: $queryOptions)   {
            items {
                id
                name
                bik
                correspondent_account
            }
            count
        }
    }
`;

