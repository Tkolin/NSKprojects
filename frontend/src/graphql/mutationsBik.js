// Мутации
import {gql} from "@apollo/client";

export const ADD_BIK_MUTATION = gql`
    mutation AddBik(
        $name: String!,
        $BIK:String!,
        $correspondent_account: String!
    ) {
        addBik(
            BIK: $BIK
            name: $name
            correspondent_account: $correspondent_account
        ) {
            id
            name
            Bik
            correspondent_account
        }
    }
`;
export const UPDATE_BIK_MUTATION = gql`
    mutation UpdateBik(
        $id: ID!,
        $name: String!,
        $BIK_id: String!,
        $correspondent_account: String!
    ) {
        updateBik(
            id: $id
            BIK: $BIK
            name: $name
            correspondent_account: $correspondent_account


        ) {
            id
            name
            Bik
            correspondent_account
        }
    }
`;

