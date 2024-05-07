import {gql} from "@apollo/client";
export const COMPUTE_FORMULAS_MUTATION = gql`
    mutation ComputeFormulaMutation($formulas: [String] ) {
        computeFormulas(
            formulas: $formulas
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
export const CREATE_FENRIR_MUTATION = gql`
    mutation CreateFenrirMutation($data: FenrirInput! ) {
        createFenrir(
            data: $data
        )
    }
`;
export const CREATE_FENRIR_TEMPLATE_MUTATION = gql`
    mutation CreateFenrirTemplateMutation($data: FenrirInput! ) {
        createFenrirTemplate(
            data: $data
        )
    }
`;
