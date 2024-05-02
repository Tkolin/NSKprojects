import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
    setValue: (e) => store.updateNode(id,  {values:{'output': +e.target.value}} ),
});

export default function InputNode({ id, data }) {
    const { setValue } = useStore(selector(id));

    return (
        <div className={tw("rounded-md bg-white shadow-xl")}>
            <p
                className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
            >
                Value
            </p>

            <label className={tw("flex flex-col px-2 py-1")}>
                <Handle id='output' className={tw("w-2 h-2")} type="source" position="bottom" />
                <input
                    value={data?.values?.output}
                    onChange={setValue}
                />
            </label>
        </div>
    );
}
