// Мутации
import {gql} from "@apollo/client";

export const ADD_BIK_MUTATION = gql`
    mutation AddBik(
        $data: BikInput
    ) {
        createBik(
            data: $data
        ) {
            id
            name
            BIK
            correspondent_account
        }
    }
`;
export const UPDATE_BIK_MUTATION = gql`
    mutation UpdateBik(
        $id: ID!,
        $data: BikInput

    ) {
        updateBik(
            id: $id
            data: $data
        ) {
            id
            name
            BIK
            correspondent_account
        }
    }
`;

