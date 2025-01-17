// Мутации
import { gql } from "@apollo/client";

export const ADD_BIK_MUTATION = gql`
  mutation AddBik($data: BikInput) {
    createBik(data: $data) {
      id
      name
      BIK
      correspondent_account
      city
    }
  }
`;
export const UPDATE_BIK_MUTATION = gql`
  mutation UpdateBik($id: ID!, $data: BikInput) {
    updateBik(id: $id, data: $data) {
      id
      name
      BIK
      city
      correspondent_account
    }
  }
`;
export const DELETE_BIK_MUTATION = gql`
  mutation DeleteBik($id: ID!) {
    deleteBik(id: $id)
  }
`;
