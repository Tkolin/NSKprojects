import { gql } from "@apollo/client";

export const PARAMETER_QUERY = gql`
  query ParameterQuery($id: ID!) {
    parameter(id: $id) {
      id
      name
      unit {
        id
        name
      }
      min
      max
    }
  }
`;

export const EQUIPMENT_TYPE_QUERY = gql`
  query EquipmentType($id: ID!) {
    equipmentType(id: $id) {
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
      parameters {
        id
        min
        max
        group {
          id
          name
        }
        unit {
          id
          name
          name_latex
        }
      }
    }
  }
`;
