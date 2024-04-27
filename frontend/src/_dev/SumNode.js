import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import {StyledBlockSmall} from "../page/style/BlockStyles";

const handleStyle = { left: 10 };

function SumNode({ data, isConnectable }) {


    return (
        <StyledBlockSmall>
            <Handle type="target" position={Position.Right} isConnectable={isConnectable} />
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
            <strong style={{textAlign: 'center'}}>+</strong>
            <Handle type="source" position={Position.Bottom} id="out" isConnectable={isConnectable} />
        </StyledBlockSmall>
    );
}

export default SumNode;
