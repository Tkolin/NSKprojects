import React from 'react';
import {Space} from 'antd';

import {StyledBlockRegular} from "../../../../components/style/BlockStyles";


const InformationOutputScript = ({blockName, data, onConnectOutput}) => {
    const handleDragStartOutput = (event, key) => {
        event.dataTransfer.setData('type', 'output');
        event.dataTransfer.setData('key', key);
    };

    return (
        <StyledBlockRegular label={blockName}>
            {data.map(({key, name, value}) => (
                <div
                    draggable
                    onDragStart={handleDragStartOutput}
                    style={{border: '1px solid black', padding: '5px', marginTop: '10px'}}
                >
                    <Space style={{width: '100%'}}>
                        {name}:

                        {value}

                    </Space>
                </div>
            ))}
        </StyledBlockRegular>
    );
};

export default InformationOutputScript;
