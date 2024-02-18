// Запросы групп данных
import {gql} from "@apollo/client";

export const CONTACT_FORM_QUERY = gql`
    query ContactsFormTableQuery($searchPositions: String, $searchOrganizations: String) {
        organizationsTable(page: 1, limit: 20, search: $searchOrganizations) {
            organizations {
                id
                name
            }
            count
        }
        positionsTable(page: 1, limit: 20, search: $searchPositions) {
            positions {
                id
                name
            }
            count
        }
    }
`;
export const PERSON_FORM_QUERY = gql`
    query ContactsFormQuery {
        passportPlaceIssues {
            id
            name
            code
        }
        banks {
            id
            name
        }
        biks {
            id
            name
        }
    }
`;
export const ORGANIZATION_FORM_QUERY = gql`
    query OrganizationsFormQuery {
        legalForms{
            id
            name
        }
        biks{
            id
            Bik
        }
        contacts{
            id
            first_name
            last_name
            patronymic
        }
        irds{
            name
        }
    }
`;

export const PROJECT_FORM_QUERY = gql`
    query ProjectFormQuery ($typeProject: ID) {
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
        contacts {
            id
            first_name
            last_name
            patronymic
        }
        irds {
            id
            name
        }
        templatesIrdsTypeProjects(typeProject: $typeProject) {
            id
            name
        }
    }
`;
