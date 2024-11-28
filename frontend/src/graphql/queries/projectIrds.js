import { gql } from "@apollo/client";

export const PROJECT_IRDS_QUERY = gql`
  query ProjectIrds($projectId: ID) {
    projectIrds(projectId: $projectId) {
      id
      project_id
      ird_id

      ird {
        id
        name
      }
      received_date
      stage_number
      application_project
      is_broken
      is_viewed
      acceptance_date
    }
  }
`;
