import {gql} from '@apollo/client';

export const EMPLOYEES_TO_TASK_BY_PROJECT_TASK_ID = gql`
    query EmpToTaskByProjectTaskId  ( $taskId: ID)  {
        projectTasksExecutors  (taskId: $taskId)  {
            items {
                id
                project_task {
                    id
                    task {
                        id
                        name
                    }
                }
                executor {
                    id
                    passport {
                        id
                        firstname
                        lastname
                        patronymic
                        birth_date
                    }
                }
            }
        }
    }
`;
export const TASKS_QUERY_BY_ID = gql`
    query TasksQueryByID  ( $id: ID)  {
        tasks  (queryType: "BY_ID", id: $id)  {
            items {
                id
                name
            }
        }
    }
`;
export const GROUP_TYPE_PROJECTS_QUERY_BY_ID = gql`
    query GroupTypeProjectsQueryByID {
        groupTypeProjects  {
            id
            name
        }
    }
`;
export const BANKS_QUERY_BY_ID = gql`
    query BanksQueryByID  ( $id: ID) {
        banks (queryType: "BY_ID", id: $id)
        {
            items{
                id
                name
            }
        }
    }
`;
export const PASSPORTS_PLACE_ISSUES_QUERY_BY_ID = gql`
    query PPIQueryByID ( $id: ID) {
        passportPlaceIssues  (queryType: "BY_ID", id: $id) {
            items{
                id
                name
            }
        }
    }
`;
export const PROJECT_STATUSES_QUERY_BY_ID = gql`
    query ProjectStatusesQueryByID ( $id: ID){
        projectStatuses   {
            name_key
            name
        }
    }
`;
export const ORGANIZATIONS_QUERY_BY_ID = gql`
    query OrganizationsQuery  ( $id: ID){
        organizations (queryType: "BY_ID", id: $id){
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
                    BIK
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
        }
    }
`;
export const ORGANIZATIONS_SHORT_QUERY_BY_ID = gql`
    query OrganizationsQueryByID ( $id: ID) {
        organizations (queryType: "BY_ID", id: $id) {
            items {
                id
                name
            }
        }
    }
`;
export const IRDS_QUERY_BY_ID = gql`
    query IrdQueryByID ( $id: ID){
        irds (queryType: "BY_ID", id: $id) {
            items {
                id
                name
            }
        }
    }
`;
export const TYPES_PROJECTS_QUERY_BY_ID = gql`
    query TypeProjectsQueryByID ( $id: ID){
        typeProjects (queryType: "BY_ID", id: $id) {
            items {
                id
                name
                code
                group {
                    id
                    code
                    name
                }
            }
        }
    }
`;
export const PROJECTS_QUERY_BY_ID = gql`
    query ProjectQueryByID ( $id: ID) {
        projects (queryType: "BY_ID", id: $id) {
            items{
                id
                number
                name
                prepayment
                organization_customer {
                    id
                    name
                }
                type_project_document {
                    id
                    code
                    name
                    template_project_id
                    group {
                        id
                        code
                        name
                    }
                }
                facilities {
                    id
                    name
                    code
                    group_facility {
                        id
                        name
                        code
                        subselection_facility {
                            id
                            name
                            code
                            selection_facility {
                                id
                                name
                                code
                            }
                        }
                    }
                }
                date_signing
                duration
                date_end
                 status {
                    name_key
                    name
                }
                date_completion
                delegations {
                    id
                    first_name
                    last_name
                    patronymic
                }
                project_stages {
                    project_id
                    stage_id
                    number
                    stage {
                        id
                        name
                    }
                    date_start
                    duration
                    date_end
                    offset
                    percent
                    price
                }
                project_tasks {
                    id
                    date_start
                    duration
                    date_end
                    price
                }
                project_irds {
                    project_id
                    ird_id
                    stage_number
                    application_project
                    ird {
                        id
                        name
                    }
                    received_date
                }
                price
            }
            count
        }
    }
`;
export const PPI_QUERY_BY_ID = gql`
    query PpiQueryByID ( $id: ID) {
        passportPlaceIssues(queryType: "BY_ID", id: $id) {
            items{
                id
                name
            }
        }
    }
`;
export const PERSONS_QUERY_BY_ID = gql`
    query PersonQueryByID ( $id: ID) {
        persons(queryType: "BY_ID", id: $id) {
            items {
                id
                passport{
                    id
                    firstname
                    lastname
                    patronymic
                    serial
                    number
                    address_registration
                    address_residential
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
                    BIK
                    name
                }

            }
        }
    }
`;

export const STAGES_QUERY_BY_ID = gql`
    query StagesQueryByID ( $id: ID){
        stages (queryType: "BY_ID", id: $id) {
            items {
                id
                name
            }
        }
    }
`;
export const CONTACTS_QUERY_BY_ID = gql`
    query ContactsQueryByID  ( $id: ID){
        contacts(queryType: "BY_ID", id: $id) {
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
        }
    }
`;
//TODO: Нету
export const REQUEST_QUERY_BY_ID = gql`
    query ContactsQueryByID  ( $id: ID){
        contacts(queryType: "BY_ID", id: $id) {
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
        }
    }
`;



export const PAYMENTS_QUERY_BY_ID = gql`
    query BikQueryByID ( $id: ID){
        tasks (queryType: "BY_ID", id: $id) {
            items {
                id
                name
            }
        }
    }
`;

export const BIKS_QUERY_BY_ID = gql`
    query BiksFormsCompact( $id: ID) {
        biks (queryType: "BY_ID", id: $id)  {
            items {
                id
                name
                BIK
                correspondent_account
            }
        }
    }
`;
export const POSITIONS_QUERY_BY_ID = gql`
    query PositionsQueryByID ( $id: ID)  {
        positions  (queryType: "BY_ID", id: $id){
            items {
                id
                name

            }
            count
        }
    }
`;