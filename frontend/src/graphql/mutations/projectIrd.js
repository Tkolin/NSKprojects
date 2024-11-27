import { gql } from "@apollo/client";
 export const ACCEPT_IRD_MUTATION = gql`
  mutation AcceptIrd($irdId: ID!, $dateAccept: String!) {
    acceptIrd(irdId: $irdId, dateAccept: $dateAccept) {
      id
      ird_id
      project_id
      ird {
        id
        name
      }
      received_date
      stage_number
      application_project
    }
  }
`;
export const REJECT_IRD_MUTATION = gql`
  mutation RejectIrd($irdId: ID!) {
    rejectIrd(irdId: $irdId) {
      id
      ird_id
      project_id
      ird {
        id
        name
      }
      received_date
      stage_number
      application_project
    }
  }
`;
export const RECEIVED_IRD_MUTATION = gql`
  mutation ReceivedIrd($irdId: ID!, $dateReceived: String!) {
    receivedIrd(irdId: $irdId, dateReceived: $dateReceived) {
      id
      ird_id
      project_id
      ird {
        id
        name
      }
      received_date
      stage_number
      application_project
    }
  }
`;
export const VIEWED_IRD_MUTATION = gql`
  mutation ViewedIrd($irdIds: [ID]!) {
    viewedIrd(irdIds: $irdIds) {
      id
      ird_id
      project_id
      ird {
        id
        name
      }
      received_date
      stage_number
      application_project
    }
  }
`;
