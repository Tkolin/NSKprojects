// Запросы групп данных
import {gql} from "@apollo/client";

export const CONTACT_FORM_QUERY = gql`
    query ContactsFormQuery {
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
    }
`;

export const PROJECT_FORM_QUERY = gql`
    query ProjectFormQuery {
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
    }
`;
