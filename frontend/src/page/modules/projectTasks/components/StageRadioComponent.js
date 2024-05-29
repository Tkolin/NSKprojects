import React, {useEffect} from 'react';
import {Form, Radio} from 'antd';


const StageRadioComponent = ({value, onChange, actualStages}) => {


    useEffect(() => {
        if (actualStages?.id || actualStages?.name)
            return "Этапы отсутсвуют"
    }, [actualStages]);
    return (
        <>
            {actualStages?.map(row => {
                return (
                    <Radio
                        key={row.id}
                        checked={value?.id === row.id ? true : false}
                        style={{marginBottom: 2}}
                        onChange={() => onChange(row)}
                    >
                        {row.name}
                    </Radio>)
            })}
        </>
    );
};
export default StageRadioComponent;