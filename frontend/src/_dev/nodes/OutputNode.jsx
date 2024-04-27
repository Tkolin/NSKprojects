import React from "react";
import { Handle } from "reactflow";
import { tw } from "twind";

export default function OutputNode({ id, data, nodes, edges  }) {
    console.log('nodes OutputNode', nodes);
    console.log('edges OutputNode', edges);
    const inputEdges = edges?.filter((edge) => edge.target === id);
    const inputs = inputEdges?.map((edge) => {
        const sourceNode = nodes?.find((node) => node.id === edge.source);
        return sourceNode.data;
    });

    return (
        <div className={tw("rounded-md bg-white shadow-xl")}>
            <Handle className={tw("w-2 h-2")} type="target" position="top" />
            <p className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}>
                Output
            </p>
            <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
                {data}
            </label>
        </div>
    );
}
