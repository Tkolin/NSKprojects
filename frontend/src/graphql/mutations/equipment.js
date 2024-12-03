import { gql } from "@apollo/client";

export const DELETE_EQUIPMENT_TYPE_MUTATION = gql`
  mutation DeleteEquipmentType($id: ID!) {
    deleteEquipmentType(data: $data) {
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
