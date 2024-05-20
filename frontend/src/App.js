import React, { useEffect, useState } from 'react';
import { InputNumber, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { StyledFormItem } from "./page/style/FormStyles";

dayjs.extend(localizedFormat);
dayjs.locale('ru');

const StyledDateRangePicker = ({  }) => {
    const [data, setData] = useState({ dateStart: null, dateEnd: null, duration: 0 });
    const [errors, setErrors] = useState({ dateStart: false, dateEnd: false, duration: false });

    const onChange = (value) => {
        console.log(value)
    }

    const handleDateChange = (field, value) => {
        setData((prevData) => ({ ...prevData, [field]: value ? dayjs(value).format() : null }));
    };

    const handleDurationChange = (value) => {
        setData((prevData) => ({ ...prevData, duration: value }));
    };

    return (
        <div>
            <Space style={{ alignItems: 'flex-end' }}>
                <StyledFormItem
                    name="date_start"
                    label="Дата подписания"
                    validateStatus={errors.dateStart ? 'error' : ''}
                    help={errors.dateStart ? 'Дата подписания обязательна' : ''}
                >
                    <DatePicker
                        placeholder="Выберите дату"
                        onChange={(date) => handleDateChange('dateStart', date)}
                    />
                </StyledFormItem>
                <StyledFormItem
                    name="duration"
                    label="Срок (в днях)"
                    value
                    validateStatus={errors.duration ? 'error' : ''}
                    help={errors.duration ? 'Срок обязателен' : ''}
                    style={{ width: '50%' }}
                >
                    <InputNumber
                        formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        style={{ width: '100%' }}
                        value={data.duration}
                        onChange={(value) => handleDurationChange(value)}
                    />
                </StyledFormItem>
                <StyledFormItem
                    name="date_end"
                    label="Дата окончания"
                    validateStatus={errors.dateEnd ? 'error' : ''}
                    help={errors.dateEnd ? 'Дата окончания обязательна' : ''}
                >
                    <DatePicker
                        placeholder="Выберите дату"
                        onChange={(date) => handleDateChange('dateEnd', date)}
                    />
                </StyledFormItem>
            </Space>
        </div>
    );
};

export default StyledDateRangePicker;
