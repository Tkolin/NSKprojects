import {useCallback, useState} from 'react';
import { Handle, Position } from 'reactflow';
import {StyledBlockSmall} from "../page/style/BlockStyles";

const handleStyle = { left: 10 };

function OutputNode({ data, isConnectable }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);
    const [value, setValue] =useState();
    return (
        <StyledBlockSmall>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                {value}
            </div>
            <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
        </StyledBlockSmall>
    );
}

export default OutputNode;
