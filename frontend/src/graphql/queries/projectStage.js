import { gql } from "@apollo/client";

export const PROJECT_STAGES_QUERY = gql`
  query ProjectStages($projectId: ID!) {
    projectStages(projectId: $projectId) {
      number
      stage {
        id
        name
        task_id
      }
      is_send_executor
      date_start
      duration
      offset
      date_end
      percent
      price
      payment_file_id
      work_act_file_id
      payment_date
      work_act_singing_date
    }
  }
`;
