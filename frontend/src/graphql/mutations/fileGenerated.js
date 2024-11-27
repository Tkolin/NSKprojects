import { gql } from "@apollo/client";

export const EXECUTOR_ORDER_GENERATED = gql`
    mutation GeneratedExecutorOrder($projecTaskIds: [ID]!, $dateGenerated: String!  ) {
        generatedExecutorOrder(project_task_ids: $projecTaskIds, date_generated: $dateGenerated) {
            url
            file {
                id
                name
                path
                size
            }
        }
    }
`;
export const EXECUTOR_ORDER_REMOVE= gql`
    mutation RemoveExecutorOrder($orederId: ID!  ) {
        removeExecutorOrder(oreder_id: $orederId) 
    }
`;