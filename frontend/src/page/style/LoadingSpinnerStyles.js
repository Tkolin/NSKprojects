import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const LoadingSpinnerStyles = ({size}) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: size ? size : '30vh' }}>
        <Spin
            indicator={
                <LoadingOutlined
                    style={{
                        fontSize: 24,
                    }}
                    spin
                />
            }
        />
    </div>
);

export default LoadingSpinnerStyles;
