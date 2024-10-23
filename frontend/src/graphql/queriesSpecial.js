import { gql } from "@apollo/client";

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
            is_tasks_completed
            is_project_completed
            payment_file_completed
            number
            original_file_id
            signed_file_id
            project_tasks {
                id
                project_id
                is_delay
            }
            executor_order_payments {
                id
                file_id
                status
            }
        }
    }
`;
export const EXECUTOR_ORDERS_PROJECT_QUERY = gql`
    query ExecutorOrders ($projectId: ID!) {
        executorOrders(projectId: $projectId
        ) {
            id
            is_tasks_completed
            payment_file_completed
            is_project_completed
            date_generate
            date_order
            date_attachment
            number
            original_file_id
            signed_file_id
            project_tasks {
                id
                project_id
                date_start
                date_end
                is_delay
                status
                task {
                    name
                }
                executor {
                    id
                    passport {
                        id
                        first_name
                        last_name
                        patronymic
                    }
                }
            }
            executor_order_payments {
                id
                file_id
                status
            }
        }
    }
`;

