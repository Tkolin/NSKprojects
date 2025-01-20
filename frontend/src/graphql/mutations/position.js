import { gql } from "@apollo/client";

export const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePositionMutation($data: PositionInput!, $id: ID!) {
    updatePosition(data: $data, id: $id) {
      id
      name
    }
  }
`;
export const CREATE_POSITION_MUTATION = gql`
  mutation CreatePositionMutation($data: PositionInput!) {
    createPosition(data: $data) {
      id
      name
    }
  }
`;
export const DELETE_POSITION_MUTATION = gql`
  mutation DeletePositionMutation($id: ID!) {
    deletePosition(id: $id)
  }
`;
