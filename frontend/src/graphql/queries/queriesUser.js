import { gql } from "@apollo/client";

export const PERMISSIONS_QUERY = gql`
  query PermissionsQuery($queryOptions: QueryOptions) {
    permissions(queryOptions: $queryOptions) {
      count
      items {
        name
        name_key
        description
        created_at
        updated_at
        group_key
        group {
          name
          comment
        }
      }
    }
  }
`;
