import React, {useEffect, useState} from 'react';
import { Input, Button, Space } from 'antd';
import {useMutation, useQuery} from "@apollo/client";
import {COMPUTE_FORMULA_MUTATION} from "./graphql/mutationsFormula";

const FormulaDetails = () => {
   const [result, setResult] = useState(0);
    // Мутации для подсчёта
    const [compute] = useMutation(COMPUTE_FORMULA_MUTATION, {
        onCompleted: (data) => {
            console.log("Успех подсчёта");
            console.log(data);
            setResult(data.computeFormula);
        }, onError: (error) => {
            console.log("Провал подсчёта");
            setResult("Провал подсчёта")
        }
    });
    const evaluateFormula = () => {
        compute({variables: {formula: 'x / 2 + 2 = 4'}})
        setResult(1);
    };
    return (
        <div>
            <Button onClick={evaluateFormula}>Calculate</Button>
            <p><strong>Result:</strong> {result}</p>
        </div>
    );
};

export default FormulaDetails;
