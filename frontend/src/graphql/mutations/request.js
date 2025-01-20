import { gql } from "@apollo/client";

export const ADD_REQUEST_MUTATION = gql`
  mutation CreateRequests($data: RequestInput) {
    createRequests(data: $data) {
      id
      name
      start_file_url
      organization_customer {
        id
        name
        full_name
      }
    }
  }
`;

export const UPDATE_REQUEST_MUTATION = gql`
  mutation UpdateRequests($id: ID!, $data: RequestInput) {
    updateRequests(data: $data, id: $id) {
      id
      name
      start_file_url
      organization_customer {
        id
        name
        full_name
      }
    }
  }
`;
