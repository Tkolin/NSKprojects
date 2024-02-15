import {gql} from "@apollo/client";

export const ADD_PROJECT_MUTATION = gql`
    mutation AddProject(
        $number: String!,
        $name: String!,
        $organization_customer_id: ID,
        $type_project_document_id: ID,
        $facility_id: ID,
        $date_signing: String,
        $duration: Int,
        $date_end: String,
        $status_id: ID,
        $date_completion: String ) {
        addProject(
            number: $number
            name: $name
            organization_customer_id: $organization_customer_id
            type_project_document_id: $type_project_document_id
            facility_id: $facility_id
            date_signing: $date_signing
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
export const UPDATE_PROJECT_MUTATION = gql`
    mutation UpdateProject($number: String!, $name: String!, $organization_customer_id: ID, $type_project_document_id: ID, $facility_id: ID,
        $date_signing: String, $IAD_id: ID, $duration: String, $date_end: String, $status_id: ID, $date_completion: String ) {
        updateProject(
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