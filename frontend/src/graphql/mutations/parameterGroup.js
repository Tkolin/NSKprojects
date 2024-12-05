import { gql } from "@apollo/client";

export const DELETE_PARAMETER_GROUP_MUTATION = gql`
  mutation DeleteParameterGroup($id: ID!) {
    deleteParameterGroup(id: $id)
  }
`;
export const CREATE_PARAMETER_GROUP_MUTATION = gql`
  mutation CreateParameterGroup($data: ParameterGroupInput!) {
    createParameterGroup(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_PARAMETER_GROUP_MUTATION = gql`
  mutation UpdateParameterGroup($data: ParameterGroupInput!, $id: ID!) {
    updateParameterGroup(data: $data, id: $id) {
      id
      name
    }
  }
`;
