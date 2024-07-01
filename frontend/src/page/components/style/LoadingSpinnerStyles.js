import {useState} from 'react';
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

const GrowingTree = ({style}) => {
    const [size, setSize] = useState(0);

    const startGrowing = () => {
        setSize(100); // ���������� �������� ������ ������
    };

    return (

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "25"}}>
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
     );
};

export default GrowingTree;
