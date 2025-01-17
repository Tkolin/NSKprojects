import { gql } from "@apollo/client";

export const ADD_ORGANIZATION_MUTATION = gql`
  mutation AddOrganization($data: OrganizationInput) {
    createOrganization(data: $data) {
      id
      name
      full_name
      legal_form {
        id
        name
      }
      address_legal
      office_number_legal
      address_mail
      office_number_mail
      phone_number
      fax_number
      email
      INN
      OGRN
      OKPO
      KPP
      bik {
        id
        name
        BIK
        city
      }
      payment_account
      director {
        id
        first_name
        last_name
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation AddOrganization($id: ID!, $data: OrganizationInput) {
    updateOrganization(id: $id, data: $data) {
      id
      name
      full_name
      legal_form {
        id
        name
      }
      address_legal
      office_number_legal
      address_mail
      office_number_mail
      phone_number
      fax_number
      email
      INN
      OGRN
      OKPO
      KPP
      bik {
        id
        name
        BIK
        city
      }
      payment_account
      director {
        id
        first_name
        last_name
      }
    }
  }
`;
export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
  }
`;
