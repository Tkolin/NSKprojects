// Мутации
import {gql} from "@apollo/client";

export const ADD_BIK_MUTATION = gql`
    mutation AddBik(
        $name: String!,
        $bik:String!,
        $correspondent_account: String!
    ) {
        addBik(
            bik: $bik
            name: $name
            correspondent_account: $correspondent_account
        ) {
            id
            name
            bik
            correspondent_account
        }
    }
`;
export const UPDATE_BIK_MUTATION = gql`
    mutation UpdateBik(
        $id: ID!,
        $name: String!,
        $bik: String!,
        $correspondent_account: String!
    ) {
        updateBik(
            id: $id
            bik: $bik
            name: $name
            correspondent_account: $correspondent_account


        ) {
            id
            name
            bik
            correspondent_account
        }
    }
`;

