import { gql } from "@apollo/client";

export const DELETE_UNIT_MUTATION = gql`
  mutation DeleteUnit($id: ID!) {
    deleteUnit(data: $data)
  }
`;
export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($data: RoleInput!) {
    createRole(data: $data) {
      name
    }
  }
`;

export const UPDATE_ROLE_MUTATION = gql`
  mutation updateRole($data: RoleInput!, $name_key: String!) {
    updateRole(data: $data, name_key: $name_key) {
      name
    }
  }
`;
