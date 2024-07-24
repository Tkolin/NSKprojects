import {gql} from "@apollo/client";

export const STATUS_PROJECTS_QUERY = gql`
    query StagesQuery ($projectStatuses: [String]!) {
        projectsStatistic (projectStatuses: $projectStatuses) {
            project_ids
            status {
                name_key
                name
            }
        }
    }
`;export const EXECUTOR_ORDERS_QUERY = gql`
    query ExecutorOrders ($projectId: ID!,  $executorId: ID!) {
        executorOrders(projectId: $projectId,  executorId: $executorId
        ) {
            id
            date_generate
            date_order
            date_attachment
            number
            original_file_id
            signed_file_id
            project_tasks {
                id
                project_id
            }
        }
    }

`;