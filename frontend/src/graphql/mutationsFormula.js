import {gql} from "@apollo/client";
export const COMPUTE_FORMULA_MUTATION = gql`
    mutation ComputeFormulaMutation($formula: String! ) {
        computeFormula(
            formula: $formula
        ) 
    }
`;
