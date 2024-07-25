import {gql} from "@apollo/client";

export const EXECUTOR_ORDER_GENERATED = gql`
    mutation GeneratedExecutorOrder($data: [ID]! ) {
        generatedExecutorOrder(project_task_ids: $data) {
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