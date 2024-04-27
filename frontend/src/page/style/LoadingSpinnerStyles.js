import {useState} from 'react';
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

const GrowingTree = () => {
    const [size, setSize] = useState(0);

    const startGrowing = () => {
        setSize(100); // Установите желаемую высоту дерева
    };

    return (
        <div>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Spin
                    indicator={
                        <LoadingOutlined
                            style={{
                                fontSize: 24,
                                color: 'green',
                            }}
                            spin
                        />
                    }
                />
            </div>
        </div>
    );
};

export default GrowingTree;
