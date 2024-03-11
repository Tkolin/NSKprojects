import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const LoadingSpinnerStyles = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
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
