import {gql} from "@apollo/client";
export const COMPUTE_FORMULA_MUTATION = gql`
    mutation ComputeFormulaMutation($formula: String! ) {
        computeFormula(
            formula: $formula
        ) 
    }
`;
export const CREATE_FORMULA_MUTATION = gql`
    mutation CreateFormulaMutation($data: FormulaInput! ) {
        createFormula(
            data: $data
        ) 
    }
`;
export const CREATE_REFERENCE_MUTATION = gql`
    mutation CreateReferenceMutation($data: ReferenceInput! ) {
        createReference(
            data: $data
        )
    }
`;
