import React, {useState} from "react";
import {Handle} from "reactflow";
import {tw} from "twind";
import {useStore} from "../store";

const comput = (id) => (store) => ({
    setValue: (total) => store.updateNode(id,  {values:{'output': total}} ),
});

export default function MathOperationNode({id, data}) {
    const {setValue} = useStore(comput(id));

    const [operation, setOperation] = useState(data?.operation || "+");
    const handleOperationChange = (e) => {
        setOperation(e.target.value);
        data.operation = e.target.value;
    };
    if (data.inputs.x && data.inputs.y) {
        let total = 0;
        if (data?.operation === "+") {
            total = data.inputs.x.value + data.inputs.y.value;
        } else if (data?.operation === "-") {
            total = data.inputs.x.value - data.inputs.y.value;
        } else if (data?.operation === "*") {
            total = data.inputs.x.value * data.inputs.y.value;
        } else if (data?.operation === "/") {
            total = data.inputs.x.value / data.inputs.y.value;
        }
        if (data.total !== total) {
            data.total = total;
            setValue(total);
        }
    }
    return (
        <div className={tw("rounded-md bg-white shadow-xl")}>
            <Handle id='x' className={tw("w-2 h-2")} type="target" position="left"/>
            <Handle id='y' className={tw("w-2 h-2")} type="target" position="right"/>

            <p
                className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
            >
                Operation
            </p>
            <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
                <select
                    className={tw("px-2 py-1")}
                     value={operation}
                    onChange={handleOperationChange}
                >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">*</option>
                    <option value="/">/</option>
                </select>
            </label>


            <Handle id='output' className={tw("w-2 h-2")} type="source" position="bottom"/>
        </div>
    );
}
