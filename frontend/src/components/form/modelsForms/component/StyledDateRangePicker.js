import React, { useEffect, useState } from 'react';
import { InputNumber, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { StyledFormItem } from '../../../style/FormStyles';

const StyledDateRangePicker = ({ onChange }) => {
    const [data, setData] = useState({ dateStart: null, dateEnd: null, duration: null });

    useEffect(() => {
        const { dateStart, dateEnd, duration } = data;
        let newData = { ...data };

        if (!dateStart && dateEnd && duration) {
            newData.dateStart = dayjs(dateEnd).subtract(duration, 'day');
        } else if (!dateEnd && dateStart && duration) {
            newData.dateEnd = dayjs(dateStart).add(duration, 'day');
        } else if (!duration && dateStart && dateEnd) {
            newData.duration = dayjs(dateEnd).diff(dateStart, 'day');
        }

        setData(newData);

        const incomplete = !newData.dateStart || !newData.dateEnd || !newData.duration;
        if (!incomplete) {
            onChange(newData);
        }
    }, [data, onChange]);

    const handleDateStartChange = (date) => {
        setData((prevData) => ({ ...prevData, dateStart: date }));
    };

    const handleDateEndChange = (date) => {
        setData((prevData) => ({ ...prevData, dateEnd: date }));
    };

    const handleDurationChange = (value) => {
        setData((prevData) => ({ ...prevData, duration: value }));
    };

    const { dateStart, dateEnd, duration } = data;

    const dateStartStyle = dateStart ? {} : { borderColor: 'red' };
    const dateEndStyle = dateEnd ? {} : { borderColor: 'red' };
    const durationStyle = duration ? {} : { borderColor: 'red' };

    return (
        <div>
            <Space block style={{ alignItems: 'flex-end' }}>
                <StyledFormItem name="date_start" label="Дата подписания">
                    <DatePicker
                        placeholder="Выберите дату"
                        onChange={handleDateStartChange}
                        value={dateStart}
                        style={dateStartStyle}
                    />
                </StyledFormItem>
                <StyledFormItem name="duration" label="Срок (в днях)" style={{ width: '50%' }}>
                    <InputNumber
                        formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        style={{ width: '100%', ...durationStyle }}
                        value={duration}
                        onChange={handleDurationChange}
                    />
                </StyledFormItem>
                <StyledFormItem name="date_end" label="Дата окончания">
                    <DatePicker
                        placeholder="Выберите дату"
                        onChange={handleDateEndChange}
                        value={dateEnd}
                        style={dateEndStyle}
                    />
                </StyledFormItem>
            </Space>
        </div>
    );
};

export default StyledDateRangePicker;
