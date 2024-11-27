
// Мутации
import { gql } from "@apollo/client";

export const DELETE_REFERENCE_MUTATION = gql`
    mutation DeletReference($id: ID! ) {
        deleteReference(
            id: $id
        )
    }
`;

export const CREATE_REFERENCE_MUTATION = gql`
    mutation CreateReference(
        $data: ReferenceInput,
    ) {
        createReference(
            data: $data
        ) {
            id
            name
        }
    }
`;
export const UPDATE_REFERENCE_MUTATION = gql`
    mutation UpdateReference(
        $id: ID!,
        $data: ReferenceInput,
    ) {
        updateReference(
            id: $id
            data: $data
        ) {
            id
            name
        }
    }
`;

export const DELETE_TECH_CHAPTER_MUTATION = gql`
    mutation DeleteTSChapter($id: ID! ) {
        deleteTSChapter(
            id: $id
        )
    }
`;

export const CREATE_TECH_CHAPTER_MUTATION = gql`
    mutation CreateTSChapter(
        $data: TSChapterInput,
    ) {
        createTSChapter(
            data: $data
        ) {
            id
            name

        }
    }
`;

export const UPDATE_TECH_CHAPTER_MUTATION = gql`
    mutation UpdateTSChapter(
        $id: ID!, 
        $data: TSChapterInput,
    ) {
        updateTSChapter(
            id: $id
            data: $data
        ) {
            id
            name
        }
    }
`;
