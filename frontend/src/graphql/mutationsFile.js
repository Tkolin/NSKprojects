import {gql} from "@apollo/client";

export const DELETE_CONTACT_MUTATION = gql`
    mutation DeletContact($file: String ) {
        deleteContact(
            id: $id
        )
    }
`;
