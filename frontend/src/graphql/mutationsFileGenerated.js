import {gql} from "@apollo/client";

export const EXECUTOR_ORDER_GENERATED = gql`
    mutation ExecutorOrderGenerated($data: [ID]! ) {
        executorOrderGenerated(project_task_ids: $data) {
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