import { gql } from "@apollo/client";

export const DELETE_EQUIPMENT_TYPE_MUTATION = gql`
  mutation DeleteEquipmentType($id: ID!) {
    deleteEquipmentType(data: $data)
  }
`;
export const CREATE_EQUIPMENT_TYPE_MUTATION = gql`
  mutation CreateEquipmentType($data: EquipmentTypeInput!) {
    createEquipmentType(data: $data) {
      id
      name
      type_activity {
        id
        name
      }
      group {
        id
        name
      }
    }
  }
`;

export const UPDATE_EQUIPMENT_TYPE_MUTATION = gql`
  mutation UpdateEquipmentType($data: EquipmentTypeInput!, $id: ID!) {
    updateEquipmentType(data: $data, id: $id) {
      id
      name
      type_activity {
        id
        name
      }
      group {
        id
        name
      }
    }
  }
`;
