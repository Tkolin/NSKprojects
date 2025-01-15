import { gql } from "@apollo/client";

export const CHECKED_SEND_DOCUMENTS_STAGE_EXECUTOR = gql`
  mutation CheckedSendDocumentsStageExecutors($projectId: ID!, $stageId: ID!) {
    checkedSendDocumentsStageExecutors(
      projectId: $projectId
      stageId: $stageId
    ) {
      number
      stage {
        id
        name
        task_id
      }
      is_send_executor
    }
  }
`;
