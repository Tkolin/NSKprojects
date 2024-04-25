import { useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const GrowingTree = () => {
    const [size, setSize] = useState(0);

    const startGrowing = () => {
        setSize(100); // Установите желаемую высоту дерева
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: `${size}vh` }}>
                <strong>{size === 0 ? 'Click to grow the tree' : 'Tree is growing!'}</strong>
            </div>
            {size === 0 && <button onClick={startGrowing}>Grow Tree</button>}
            {size > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{
                                    fontSize: 24,
                                    color: 'green',
                                    animation: 'grow 5s forwards',
                                }}
                                spin
                            />
                        }
                    />
                </div>
            )}
            <style>
                {`
                @keyframes grow {
                    0% { transform: scaleY(0); }
                    100% { transform: scaleY(1); }
                }
            `}
            </style>
        </div>
    );
};

export default GrowingTree;
