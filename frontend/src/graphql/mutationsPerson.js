import {gql} from "@apollo/client";

export const DELETE_PERSON_MUTATION = gql`
    mutation DeletContact($id: ID! ) {
        deletePerson(
            id: $id
        ) {
            passport{
                firstname
                lastname
                patronymic
                serial
                number
                passport_place_issue{
                    id
                    name
                }
                birth_date
                date
            }
            SHILS
            INN
            payment_account
            phone_number
            email
            email_sibnipi
            bank{
                name
            }
            bik{
                id
                BIK
                name
            }
        }
    }
`;

export const ADD_PERSON_MUTATION = gql`
    mutation AddPerson(
        $firstname: String!
        $lastname: String!
        $patronymic: String
        $serial: String
        $number: String
        $passport_place_issue_id: ID
        $address_registration: String
        $address_residential: String
        
        $birth_date: String
        $date: String
    
        $SHILS: String
        $INN: String
        $payment_account: String
        $phone_number: String
        $email: String
        $email_sibnipi: String
        $bank_id: ID
        $bik_id: ID
    ) {
        addPerson(
            firstname: $firstname
            lastname: $lastname
            patronymic: $patronymic
            serial: $serial
            number: $number
            passport_place_issue_id: $passport_place_issue_id
            address_registration: $address_registration
            address_residential: $address_residential
            
            birth_date: $birth_date
            date: $date
    
            SHILS: $SHILS
            INN: $INN
            payment_account: $payment_account
            phone_number: $phone_number
            email: $email
            email_sibnipi: $email_sibnipi
            bank_id: $bank_id
            bik_id: $bik_id
        ) {
            passport{
                firstname
                lastname
                patronymic
                serial
                number
                address_registration
                address_residential
                passport_place_issue{
                    id
                    name
                }
                birth_date
                date
            }
            SHILS
            INN
            payment_account
            phone_number
            email
            email_sibnipi
            bank{
                name
            }
            bik{
                id
                name
                BIK
            }
        }
    }
`;
export const UPDATE_PERSON_MUTATION = gql`
    mutation UpdatePerson(
        $id: ID!,
        $firstname: String!
        $lastname: String!
        $patronymic: String
        $serial: String
        $number: String
        $passport_place_issue_id: ID
        $address_registration: String
        $address_residential: String
        
        $birth_date: String
        $date: String

        $SHILS: String
        $INN: String
        $payment_account: String
        $phone_number: String
        $email: String
        $email_sibnipi: String
        $bank_id: ID
        $bik_id: ID
    ) {
        updatePerson(
            id: $id
            firstname: $firstname
            lastname: $lastname
            patronymic: $patronymic
            serial: $serial
            number: $number
            passport_place_issue_id: $passport_place_issue_id
            address_registration: $address_registration
            address_residential: $address_residential            
            
            birth_date: $birth_date
            date: $date

            SHILS: $SHILS
            INN: $INN
            payment_account: $payment_account
            phone_number: $phone_number
            email: $email
            email_sibnipi: $email_sibnipi
            bank_id: $bank_id
            bik_id: $bik_id
        ) {
            passport{
                firstname
                lastname
                patronymic
                serial
                number
                address_registration
                address_residential
                passport_place_issue{
                    id
                    name
                }
                birth_date
                date
            }
            SHILS
            INN
            payment_account
            phone_number
            email
            email_sibnipi
            bank{
                name
            }
            bik{
                id
                name
                BIK
            }
        }
    }
`;

export const ADD_PPI_MUTATION = gql`
    mutation AddPPI(
        $name: String!,
        $code: String!,
    ) {
        addPpi(
            name: $name
            code: $code
        ) {
            id
            name
            code
        }
    }
`;
export const UPDATE_PPI_MUTATION = gql`
    mutation UpdatePPI(
        $id: ID!,
        $name: String!
        $code: String!,
    ) {
        updatePpi(
            id: $id
            name: $name
            code: $code
        ) {
            id
            name
            code
        }
    }
`;
export const CONTRACT_PERSON_MUTATION = gql`
    mutation PersonOrderFileDownload(
        $id: ID!
    ) {
        personOrderFileDownload(
            personId: $id
        ) {
            url
        }
    }
`;
