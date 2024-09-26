import { gql } from '@apollo/client';

export const TASKS_QUERY_COMPACT = gql`
    query TasksQueryCompact    {
        tasks  (queryType: "COMPACT")  {
            items {
                id
                name
                __typename
            }
        }
    }
`;
export const TS_CHAPTERS_QUERY = gql`
    query TechnicalSpecificationChapters  {
        technicalSpecificationChapters  (queryType: "COMPACT") {
            items {
                id
                name
            }
            count
        }
    }
`;
export const PROJECTS_STAGES_TEMPLATES = gql`
    query ProjectsStagesTemplates {
        projects (queryType: "COMPACT")  {
            items {
                id
                number
                name
                date_start
                date_end
                project_stages {
                    project_id
                    stage_id
                    stage {
                        name
                    }
                    duration
                    offset
                    percent
                }
            }
        }
    }
`;
export const PROJECTS_IRDS_TEMPLATES = gql`
    query ProjectsIrdsTemplates {
        projects  (queryType: "COMPACT") {
            items {
                id
                number
                name
                date_start
                date_end
                project_irds {
                    project_id
                    ird_id
                    ird {
                        name
                    }
                }
            }
        }
    }
`;
export const GROUP_TYPE_PROJECTS_QUERY_COMPACT = gql`
    query GroupTypeProjectsQueryCompact {
        groupTypeProjects   {
            id
            code
            name
        }
    }
`;
export const BANKS_QUERY_COMPACT = gql`
    query BanksQueryCompact   {
        banks (queryType: "COMPACT")
        {
            items{
                id
                name
            }
        }
    }
`;
export const PASSPORTS_PLACE_ISSUES_QUERY_COMPACT = gql`
    query PPIQueryCompact  {
        passportPlaceIssues  (queryType: "COMPACT") {
            items{
                id
                name
            }
        }
    }
`;
export const REFERENCES_QUERY_COMPACT = gql`
    query ReferencesQueryCompact  {
        references  (queryType: "COMPACT") {
            items{
                id
                name
                description
                content{
                    name
                    key
                    description
                }
            }
        }
    }
`;
export const PROJECT_STATUSES_QUERY_COMPACT = gql`
    query ProjectStatusesQueryCompact {
        projectStatuses   {
            name_key
            name
        }
    }
`;

export const PERMISSIONS_QUERY_COMPACT = gql`
    query PermissionsQuery {
        permissions (queryType: "COMPACT")  {
            items{
                description
                name_key
                name
            }
        }
    }
`;
export const ORGANIZATIONS_QUERY_COMPACT = gql`
    query OrganizationsQuery  {
        organizations (queryType: "COMPACT"){
            items {
                id
                name
            }
        }
    }
`;
export const PROJECT_COUNT_BY_ORGANIZATION = gql`
    query CountProjectByOrganizations ($organizationId: ID!) {
        countProjectByOrganizations (organizationId: $organizationId )
    }
`;


export const IRDS_QUERY_COMPACT = gql`
    query IrdQueryCompact {
        irds (queryType: "COMPACT") {
            items {
                id
                name
            }
        }
    }
`;
export const TYPES_PROJECTS_QUERY_COMPACT = gql`
    query TypeProjectsQueryCompact {
        typeProjects (queryType: "COMPACT") {
            items {
                id
                name
                code
                group {
                    id
                    name
                }
            }
        }
    }
`;
export const PROJECTS_QUERY_COMPACT = gql`
    query ProjectQueryCompact  {
        projects (queryType: "COMPACT") {
            items{
                id
                name
            }
        }
    }
`;
export const PPI_QUERY_COMPACT = gql`
    query PpiQueryCompact {
        passportPlaceIssues(queryType: "COMPACT") {
            items{
                id
                name
            }
        }
    }
`;
export const PERSONS_QUERY_COMPACT = gql`
    query PersonQueryCompact {
        persons(queryType: "COMPACT") {
            items {
                id
                passport{
                    first_name
                    last_name
                    patronymic
                    birth_date
                }
            }
        }
    }
`;

export const STAGES_QUERY_COMPACT = gql`
    query StagesQueryCompact {
        stages (queryType: "COMPACT") {
            items {
                id
                name
            }
        }
    }
`;
export const CONTACTS_QUERY_COMPACT = gql`
    query ContactsQueryCompact  {
        contacts(queryType: "COMPACT") {
            items {
                id
                first_name
                last_name
                patronymic
                birth_day
            }
        }
    }
`;
export const CONTACTS_QUERY_COMPACT_AND_ORGID = gql`
    query ContactsQueryCompact ($organizationId: ID) {
        contacts(queryType: "COMPACT", organizationId: $organizationId) {
            items {
                id
                first_name
                last_name
                patronymic
                birth_day
            }
        }
    }
`;
export const FACILITYS_QUERY_COMPACT = gql`
    query FacilitiesQueryCompact   {
        facilities  {
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


export const PAYMENTS_QUERY_COMPACT = gql`
    query BikQueryCompact {
        tasks (queryType: "COMPACT") {
            items {
                id
                name
            }
        }
    }
`;
export const LEGAL_FORM_QUERY_COMPACT = gql`
    query LegalFormsCompact {
        legalForms    {
            id
            name
        }
    }
`;
export const BIKS_QUERY_COMPACT = gql`
    query BiksFormsCompact {
        biks (queryType: "COMPACT")  {
            items {
                id
                name
                BIK
            }
        }
    }
`;
export const POSITIONS_QUERY_COMPACT = gql`
    query PositionsQueryCompact   {
        positions  (queryType: "COMPACT"){
            items {
                id
                name
            }
            count
        }
    }
`;