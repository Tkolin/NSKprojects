import { gql } from "@apollo/client";

export const GENERATED_DELAY_CUSTOMER_MUTATION = gql`
    mutation GeneratedDelayCustomerMessage($delayId: ID!, $dateFixed: String!) {
        generatedDelayCustomerMessage(delayId: $delayId, dateFixed: $dateFixed) {
            url
        }
    }
`;
export const START_DELAY_MUTATION = gql`
    mutation StartDelay(
        $projectId: ID!, 
        $date_start: String!, 
        $description: String!, 
        $type: String!, 
        $provider: String!, 
        $primaryTaskIds: [ID]!   
    ) {
        startDelay(
            projectId: $projectId, 
            date_start: $date_start, 
            description: $description, 
            type: $type, 
            provider: $provider, 
            primaryTaskIds: $primaryTaskIds
        ) {
            delay {
                id
                date_start
                date_end
        }
         project {   id
            name
            project_tasks {
                id
                is_delay
                task {
                    id
                    name
                }
                date_end
                date_start
                status
            }}
        }
    }
`;
export const STOP_DELAY_MUTATION = gql`
    mutation StopDelay(
        $id: ID!, 
        $date_end: String!,
        $offset_mode: String!
    ) {
        stopDelay(
          id: $id,
          date_end: $date_end,
          offset_mode: $offset_mode
        ) {
            delay {
                id
                date_start
                date_end
            }
         project {   id
            name
            project_tasks {
                id
                is_delay
                task {
                    id
                    name
                }
                date_end
                date_start
                status
            }}
        }
    }
`;
