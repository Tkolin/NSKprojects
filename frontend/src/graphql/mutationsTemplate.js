import {gql} from "@apollo/client";

export const UPDATE_STAGES_TEMPLATE_MUTATION = gql`
    mutation UpdateStagesTemplate(
        $typeProjectId: ID!,
        $listStages_id: [ID!]!,
        $listPercent: [Int],
        $listNumber: [Int],
    ) {
        updateStagesTemplate(
            typeProjectId: $typeProjectId
            listStages_id: $listStages_id
            listPercent: $listPercent
            listNumber: $listNumber
        ) 
    }
`;

export const UPDATE_IRDS_TEMPLATE_MUTATION = gql`
    mutation UpdateIrdsTemplate(
        $typeProjectId: ID!,
        $listIrds_id: [ID!]!,
        $listStageNumber: [Int],
        $listAppNumber: [Int],
    ) {
        updateIrdsTemplate(
            typeProjectId: $typeProjectId
            listIrds_id: $listIrds_id
            listStageNumber: $listStageNumber
            listAppNumber: $listAppNumber
        ) 
    }
`;
export const UPDATE_TASKS_TEMPLATE_MUTATION = gql`
    mutation UpdateTaskTemplate(
        $typeProjectId: ID!,
        $listTasks_id: [ID!]!,      
        $listInheritedTasks_id: [ID],   
        $stageNumber: [Int],
    ) {
        updateTaskTemplate(
            typeProjectId: $typeProjectId
            listTasks_id: $listTasks_id
            listInheritedTasks_id: $listInheritedTasks_id
            stageNumber: $stageNumber
        ) 
    }
`;
