import { gql } from "@apollo/client";

export const CREATE_PARAMETER_MUTATION = gql`
  mutation CreateParameter($data: ParameterInput!) {
    createParameter(data: $data) {
      name
      unit_id
      min
      max
    }
  }
`;

export const UPDATE_PARAMETER_MUTATION = gql`
  mutation UpdateParameter($data: ParameterInput!, $id: ID!) {
    updateParameter(data: $data, id: $id) {
      name
      unit_id
      min
      max
    }
  }
`;
