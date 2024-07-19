import {gql} from "@apollo/client";




export const ADD_REQUEST_MUTATION = gql`
    mutation CreateRequests(
        $data: RequestInput

    ) {
        createRequests(
            data: $data
        ){
            id
            name
            organization_customer {
                id
                name
            }

        }
    }
`;

export const UPDATE_REQUEST_MUTATION = gql`
    mutation UpdateRequests(
        $data: RequestInput
    ) {
        updateRequests(
            data: $data
        ) {
            id
            name
            organization_customer {
                id
                name
            }

        }
    }
`;