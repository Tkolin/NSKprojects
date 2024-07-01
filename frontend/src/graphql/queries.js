import {gql} from '@apollo/client';

export const FENRIR_QUERY = gql`
    query FenrirQuery  ($queryOptions: QueryOptions) {
        fenrirs  (queryOptions: $queryOptions) {
            items {
                id
                name
                description
                models
            }
            count
        }
    }
`;export const FENRIR_TEMPLATE_QUERY = gql`
    query FenrirTemplateQuery  ($projectId: ID) {
        templateFenrirsTypeProject  (projectId: $projectId) {
            items {
                id
                name
                description
                models
            }
            count
        }
    }
`;export const TASKS_QUERY = gql`
    query TasksQuery  ($queryOptions: QueryOptions) {
        tasks  (queryOptions: $queryOptions) {
            items {
                id
                name
            }
            count
        }
    }
`;
export const REFERENCES_QUERY = gql`
    query ReferencesQuery  ($oprions: QueryOptions) {
        references  (queryOptions: $oprions) {
            items {
                id
                name
                description
                reference_values
            }
            count
        }
    }
`;
export const FORMULA_BY_KEY_QUERY = gql`
    query FormulaByKey  ($keys: [String!]) {
        formulaByKey  (keys: $keys) {
            items {
                id
                latex_formula
                original_formula
                rpn_formula
                name_key
                name
                description
                variable_data {
                    description
                    name_key
                    name
                    formula_id
                    id
                }
            }
            count
        }
    }
`;
export const TECHNICAL_SPECIFICATION_QUERY = gql`
    query TechnicalSpecificationQuery {
        typeTechnicalSpecification  {
            id
        }
    }
`;
export const SECTION_REFERENCES_QUERY = gql`
    query SectionReferenceQuery {
        sectionReferences  {
            items{
                id
                name
                description
                values
            }
            count
        }
    }
`;
export const GROUP_TYPE_PROJECTS_QUERY = gql`
    query GroupTypeProjectsQuery {
        groupTypeProjects  {
            id
            name
            technical_specification {
                id
                name
            }
        }
    }
`;
export const BANKS_QUERY = gql`
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
            name_key
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
    query OrganizationsQuery ($queryOptions: QueryOptions, $organizationId: ID) {
        organizations (queryOptions: $queryOptions, organizationId: $organizationId){
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
                employees {
                    id
                    first_name
                    last_name
                    work_email
                    work_phone
                    mobile_phone
                    email
                    patronymic
                    birth_day
                    position {
                        id
                        name
                    }
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
                group {
                    id
                    name
                    technical_specification {
                        id
                        name
                    }
                }
            }
            count
        }
    }
`;
export const  PROJECTS_QUERY = gql`
    query ProjectQuery($queryOptions: QueryOptions, $projectId: ID, $projectStatuses: String) {
        projects (queryOptions: $queryOptions, projectId: $projectId, projectStatuses: $projectStatuses) {
            items{
                id
                number
                name
                duration
                organization_customer
                {
                    id
                    name
                }
                type_project_document
                {
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
                facilities
                {
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
                date_create
                date_end
                prepayment
                status
                {
                     name
                    name_key
                }
                date_completion
                delegations{
                    id
                    first_name
                    last_name
                    patronymic
                }
                project_stages {
                    id
                    number
                    stage {
                        id
                        name
                        task_id
                    }
                    date_start
                    duration
                    date_end
                    percent
                    price
                    
                }
                project_irds {
                    id
                    stageNumber
                    applicationProject
                    IRD {
                        id
                        name
                    }
                    receivedDate
                }
                project_tasks {
                    id
                    project_id
                    task {
                        id
                        name
                    }
                    project_task_inherited_id
                    date_start
                    date_end
                    duration
                    stage_number
                    executor {
                        id
                        passport {
                            id
                            firstname
                            lastname
                            patronymic
                        }
                    }
                    price
                    description
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
                    id
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
    query FacilitiesQuery   {
        facilities {
            id
            name
            code
            subselection_facility {
                id
                name
                code
                group_facility {
                    id
                    name
                    code
                    facilities {
                        id
                        name
                        code
                    }
                }
            }
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
                BIK
                correspondent_account
            }
            count
        }
    }
`;
export const STAGES_TO_PROJECT_QUERY = gql`
    query StageToProjectQuery ($projectId: ID){
        projectStages(projectId: $projectId)   {
            id
            project{
                id
                name
            }
            stage{
                id
                name
            }
            number
            price
            percent
            date_start
            duration
            date_end
            progress
        }
    }
`;
export const IRDS_TO_PROJECT_QUERY = gql`
    query BiksForms ($queryOptions: QueryOptions){
        projectIrds(queryOptions: $queryOptions)   {
            id
            project{
                id
                name
            }
            IRD{
                id
                name
            }
            receivedDate
            stageNumber
            applicationProject
        }
    }
`;
export const TASKS_TO_PROJECT_QUERY = gql`
    query TasksToProjectQuery ($projectId: ID){
        projectTasksQuery(projectId: $projectId) {
            id
            task {
                id
                name
            }
            project_task_inherited_id
            date_start
            date_end
            duration
            executor {
                id
                passport {
                    id
                    firstname
                    lastname
                    patronymic
                }
            }
            price
            description

        }
    }
`;
