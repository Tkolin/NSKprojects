import React, {useCallback} from 'react';
import {Handle, Position} from 'reactflow';
import {StyledBlockSmall} from "../page/style/BlockStyles";
import {Input} from "antd";


const InputNode = ({data, isConnectable, onInputChange}) => {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
        data.value = evt.target.value;
    }, [data?.id, onInputChange]);

    return (
        <StyledBlockSmall>
            <div>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag"/>
            </div>
            <Handle type="source" position={Position.Bottom} id="out" isConnectable={isConnectable}/>
        </StyledBlockSmall>
    );
}


export default InputNode;
