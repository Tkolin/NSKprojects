import { gql } from "@apollo/client";
export const SET_NEW_PROJECT_LEADER = gql`
  mutation SetNewProjectLeader($personId: ID!, $projectId: ID!) {
    setNewProjectLeader(personId: $personId, projectId: $projectId) {
      id
      leader {
        id
        passport {
          id
          first_name
          last_name
          patronymic
        }
      }
    }
  }
`;
