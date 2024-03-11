import {gql} from "@apollo/client";

export const ADD_PROJECT_MUTATION = gql`
    mutation AddProject(
        $data: ProjectInput
    
 
    
        $tasks: [ProjectTasksInput]
        $stages: [ProjectStageInput]
        $irds: [ProjectIrdInput]
    ) {
        addProject(
            data: $data
            
        
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
        $data: ProjectInput
        
        $tasks: [ProjectTasksInput]
        $stages: [ProjectStageInput]
        $irds: [ProjectIrdInput]
    ) {
        updateProject(
            data: $data



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
export const UPDATE_IRDS_TO_PROJECT_MUTATION = gql`
    mutation UpdateStagesToProject(
        $data: [IrdToProject]
    ) {
        updateIrdsToProject(
            items: $data
        )
    }                      
`;

export const UPDATE_STAGES_TO_PROJECT_MUTATION = gql`
    mutation UpdateIrdsToProject(
        $data: [StageToProject]
    ) {
        updateStagesToProject(
            items: $data
        )
    }
`;
export const UPDATE_TASKS_TO_PROJECT_MUTATION = gql`
    mutation UpdateTasksToProject(
        $data: [TasksToProject]
    ) {
        updateTasksToProject(
            items: $data
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
