import { gql } from "@apollo/client";

export const EQUIPMENT_TYPE_PARAMETERS_SYNC_MUTATION = gql`
  mutation SyncEquipmentTypeParameters(
    $equipmentTypeId: ID!
    $parametersIds: [ID]!
  ) {
    syncEquipmentTypeParameters(
      equipmentTypeId: $equipmentTypeId
      parametersIds: $parametersIds
    ) {
      id
      parameters {
        name
        id
      }
    }
  }
`;
