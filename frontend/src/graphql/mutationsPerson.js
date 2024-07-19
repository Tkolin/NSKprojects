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
        $data: PersonInput
    ) {
        createPerson(
            data: $data
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
        $data: PersonInput
    ) {
        updatePerson(
            id: $id
            data: $data
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
        $data: PassportPlaceIssueInput
    ) {
        createPpi(
            data: $data
        ) {
            id
            name
            code
        }
    }
`;
export const UPDATE_PPI_MUTATION = gql`
    mutation UpdatePPI(
        $data: PassportPlaceIssueInput
    ) {
        updatePpi(
            id: $id
            data: $data
        ) {
            id
            name
            code
        }
    }
`;
export const CONTRACT_PERSON_MUTATION = gql`
    mutation PersonOrderFileDownload(
        $id: ID!, $tasksId: [ID]
    ) {
        personOrderFileDownload(
            personId: $id
            tasksId: $tasksId
        ) {
            url
        }
    }
`;
