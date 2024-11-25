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
