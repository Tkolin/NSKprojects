// Мутации
import { gql } from "@apollo/client";

// export const DELETE_SUPPLIER_MUTATION = gql`
//   mutation DeleteSupplier($id: ID!) {
//     deleteSupplier(id: $id)
//   }
// `;

export const CREATE_SUPPLIER_MUTATION = gql`
  mutation CreateSupplier($data: SupplierInput!) {
    createSupplier(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_SUPPLIER_MUTATION = gql`
  mutation UpdateSupplier($id: ID!, $data: SupplierInput!) {
    updateSupplier(id: $id, data: $data) {
      id
      name
    }
  }
`;
