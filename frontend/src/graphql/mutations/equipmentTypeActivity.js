import { gql } from "@apollo/client";

export const DELETE_EQUIPMENT_TYPE_ACTIVITY_MUTATION = gql`
  mutation DeleteEquipmentTypeActivity($id: ID!) {
    deleteEquipmentTypeActivity(id: $id)
  }
`;
export const CREATE_EQUIPMENT_TYPE_ACTIVITY_MUTATION = gql`
  mutation CreateEquipmentTypeActivity($data: EquipmentTypeActivityInput!) {
    createEquipmentTypeActivity(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_EQUIPMENT_TYPE_ACTIVITY_MUTATION = gql`
  mutation UpdateEquipmentTypeActivity(
    $data: EquipmentTypeActivityInput!
    $id: ID!
  ) {
    updateEquipmentTypeActivity(data: $data, id: $id) {
      id
      name
    }
  }
`;
