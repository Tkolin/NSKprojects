import {gql} from "@apollo/client";

export const ADD_PROJECT_MUTATION = gql`
    mutation AddProject(
        $number: String!
        $name: String!
        $organization_customer_id: ID
        $type_project_document_id: ID
        $date_signing: String
        $date_end: String
        $status_id: ID
        $date_completion: String
        $price: Int
    
        $facilitys: [ID]
        $delegates: [ID]
    
        $tasks: [ProjectTasksInput]
        $stages: [ProjectStageInput]
        $irds: [ProjectIrdInput]
    ) {
        addProject(
            number: $number
            name: $name
            organization_customer_id: $organization_customer_id
            type_project_document_id: $type_project_document_id
            date_signing: $date_signing
            date_end: $date_end
            status_id: $status_id
            date_completion: $date_completion
            price: $price
            facilitys: $facilitys
            delegates: $delegates
            tasks : $tasks
            stages: $stages
            irds: $irds
            
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
            delegates {
                id
                first_name
                last_name
                patronymic
            }
            price
        }
    }
`;
export const UPDATE_PROJECT_MUTATION = gql`
    mutation UpdateProject(
        $id: ID!,
        $number: String!,
        $name: String!,
        $organization_customer_id: ID,
        $type_project_document_id: ID,
        $date_signing: String,
        $date_end: String,
        $status_id: ID,
        $date_completion: String
    ) {
        updateProject(
            id: $id
            number: $number
            name: $name
            organization_customer_id: $organization_customer_id
            type_project_document_id: $type_project_document_id
            date_signing: $date_signing
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
            delegates {
                id
                first_name
                last_name
                patronymic
            }
            price
        }
    }
`;
export const UPDATE_IRDS_TO_PROJECT_MUTATION = gql`
    mutation UpdateStagesToProject(
        $irdToProject: [IrdToProject]
    ) {
        updateIrdsToProject(
            irdToProject: $irdToProject
        )
    }                      
`;

export const UPDATE_STAGES_TO_PROJECT_MUTATION = gql`
    mutation UpdateIrdsToProject(
        $stageToProject: [StageToProject]
    ) {
        updateStagesToProject(
            stageToProject: $stageToProject
        )
    }
`;
export const UPDATE_PAYMENTS_TO_PROJECT_MUTATION = gql`
    mutation UpdatePaymentsToProject(
        $ProjectId: ID!,
    ) {
        updatePaymentsToProject(
            project: $ProjectId
        )
    }
`;
