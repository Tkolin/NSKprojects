import { gql } from "@apollo/client";

export const DELETE_EQUIPMENT_TYPE_GROUP_MUTATION = gql`
  mutation DeleteEquipmentTypeGroup($id: ID!) {
    deleteEquipmentTypeGroup(id: $id)
  }
`;
export const CREATE_EQUIPMENT_TYPE_GROUP_MUTATION = gql`
  mutation CreateEquipmentTypeGroup($data: EquipmentTypeGroupInput!) {
    createEquipmentTypeGroup(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_EQUIPMENT_TYPE_GROUP_MUTATION = gql`
  mutation UpdateEquipmentTypeGroup($data: EquipmentTypeGroupInput!, $id: ID!) {
    updateEquipmentTypeGroup(data: $data, id: $id) {
      id
      name
    }
  }
`;
