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
`;

export const CONTACTS_BY_ORGANIZATION = gql`
    query ContactsQuery ( $organizationId: ID) {
        contacts( organizationId : $organizationId, queryType: "BY_ORGANIZATIONS") {
            items {
                id
                first_name
                last_name
                patronymic
            }
            count
        }
    }
`;
export const EXECUTOR_ORDERS_QUERY = gql`
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
export const EXECUTOR_ORDERS_QUERY_PAYMENT = gql`
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