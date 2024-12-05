import { gql } from "@apollo/client";

export const DELETE_PARAMETER_MUTATION = gql`
  mutation DeleteParameter($id: ID!) {
    deleteParameter(data: $data) {
      id
      name
      group_id
      unit_id
      min
      max
    }
  }
`;
export const CREATE_PARAMETER_MUTATION = gql`
  mutation CreateParameter($data: ParameterInput!) {
    createParameter(data: $data) {
      id
      name
      group_id
      unit_id
      min
      max
    }
  }
`;

export const UPDATE_PARAMETER_MUTATION = gql`
  mutation UpdateParameter($data: ParameterInput!, $id: ID!) {
    updateParameter(data: $data, id: $id) {
      id
      name
      group_id
      unit_id
      min
      max
    }
  }
`;
