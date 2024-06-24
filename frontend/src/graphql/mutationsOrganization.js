import {gql} from "@apollo/client";


export const DELETE_ORGANIZATION_MUTATION = gql`
    mutation DeletOrganization($id: ID! ) {
        deleteOrganization(
            id: $id
        )
    }
`;

export const ADD_ORGANIZATION_MUTATION = gql`
    mutation AddOrganization(
        $legal_form_id: ID!,
        $name: String!,
        $full_name: String!,
        $address_legal: String,
        $office_number_legal: String,
        $address_mail: String,
        $office_number_mail: String,
        $phone_number: String,
        $fax_number: String,
        $email: String,
        $INN: String,
        $OGRN: String,
        $OKPO: String,
        $KPP: String,
        $bik_id: ID,
        $payment_account: String,
        $director_id: ID
    ) {
        createOrganization(
            legal_form_id: $legal_form_id
            name: $name
            full_name: $full_name
            address_legal: $address_legal
            office_number_legal: $office_number_legal
            address_mail: $address_mail
            office_number_mail: $office_number_mail
            phone_number: $phone_number
            fax_number: $fax_number
            email: $email
            INN: $INN
            OGRN: $OGRN
            OKPO: $OKPO
            KPP: $KPP
            bik_id: $bik_id
            payment_account: $payment_account
            director_id: $director_id
        ) {
            id
            name
            full_name
            legal_form{
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
             bik{
                id
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;

export const UPDATE_ORGANIZATION_MUTATION = gql`
    mutation AddOrganization(
        $id: ID!,
        $legal_form_id: ID!,
        $name: String!,
        $full_name: String!,
        $address_legal: String,
        $office_number_legal: String,
        $address_mail: String,
        $office_number_mail: String,
        $phone_number: String,
        $fax_number: String,
        $email: String,
        $INN: String,
        $OGRN: String,
        $OKPO: String,
        $KPP: String,
        $bik_id: ID,
        $payment_account: String,
        $director_id: ID!
    ) {
        updateOrganization(
            id: $id
            legal_form_id: $legal_form_id
            name: $name
            full_name: $full_name
            address_legal: $address_legal
            office_number_legal: $office_number_legal
            address_mail: $address_mail
            office_number_mail: $office_number_mail
            phone_number: $phone_number
            fax_number: $fax_number
            email: $email
            INN: $INN
            OGRN: $OGRN
            OKPO: $OKPO
            KPP: $KPP
            bik_id: $bik_id
            payment_account: $payment_account
            director_id: $director_id
        ) {
            id
            name
            full_name
            legal_form{
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
             bik{
                id
                name
            }
            payment_account
            director{
                id
                first_name
                last_name
            }
        }
    }
`;