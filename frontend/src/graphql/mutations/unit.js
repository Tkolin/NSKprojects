import { gql } from "@apollo/client";

export const DELETE_UNIT_MUTATION = gql`
  mutation DeleteUnit($id: ID!) {
    deleteUnit(data: $data)
  }
`;
export const CREATE_UNIT_MUTATION = gql`
  mutation CreateUnit($data: UnitInput!) {
    createUnit(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_UNIT_MUTATION = gql`
  mutation UpdateUnit($data: UnitInput!, $id: ID!) {
    updateUnit(data: $data, id: $id) {
      id
      name
    }
  }
`;
