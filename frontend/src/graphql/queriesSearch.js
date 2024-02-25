import {gql} from "@apollo/client";


export const SEARCH_CONTACTS_QUERY = gql`
    query SearchContactsQuery($searchContacts: String){
        contactsTable(page: 1, limit: 20, search: $searchContacts) {
            contacts {
                id
                first_name
                last_name
                patronymic
            }
            count
        }
    }
`;

export const SEARCH_ORGANIZATIONS_QUERY = gql`
    query SearchOrganizationsQuery($searchOrganizations: String){
        organizationsTable(page: 1, limit: 20, search: $searchOrganizations) {
            organizations {
                id
                name
            }
            count
        }
    }
`;
export const SEARCH_POSITIONS_QUERY = gql`
    query SearchPositionsQuery($searchPositions: String){
        positionsTable(page: 1, limit: 20, search: $searchPositions) {
            positions {
                id
                name
            }
            count
        }
    }
`;
export const SEARCH_IRDS_QUERY = gql`
    query SearchIrdsQuery($search: String){
        irdsTable(page: 1, limit: 20, search: $search) {
            irds {
                id
                name
            }
            count
        }
    }
`;

export const SEARCH_STAGES_QUERY = gql`
    query SearchStagesQuery($search: String){
        stagesTable(page: 1, limit: 20, search: $search) {
            stages {
                id
                name
            }
            count
        }
    }
`;
export const SEARCH_TASKS_QUERY = gql`
    query SearchTaskQuery($search: String){
        tasksTable(page: 1, limit: 20, search: $search) {
            tasks {
                id
                name
            }
            count
        }
    }
`;
export const SEARCH_PERSONS_QUERY = gql`
    query SearchTaskQuery($search: String){
        personsTable(page: 1, limit: 20, search: $search) {
            persons {
                id
                passport {
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
export const SEARCH_DELEGATES_OR_ORGANIZATION_QUERY = gql`
    query SearchDelegatesQuery($searchOrganizationId: String){
        contactsTable(searchOrganizationId: $searchOrganizationId) {
            contacts {
                id
                first_name
                last_name
                patronymic
            }
            count
        }
    }
`;
export const GET_TEMPLATES_TASKS_TYPE_PROJECTS  = gql`
    query GetTemplatesTasksTypeProjects ($typeProjectId: ID){
        templatesTasksTypeProjects(typeProject: $typeProjectId) {
            id
            task {
                id
                name
            }
            inherited_task_id
            stage_number
        }
    }
`;
export const SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY = gql`
    query TemplateQuery($typeProject: ID) {
        templatesIrdsTypeProjects(typeProject: $typeProject) {
            id
            ird {
                id
                name
            }
            application_to_project
            stage_number
        }
        templatesStagesTypeProjects(typeProject: $typeProject) {
            id
            stage{
                id
                name
            }
            percentage
        }
        templatesTasksTypeProjects(typeProject: $typeProject) {
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
            stage_number
        }
    }
`;
