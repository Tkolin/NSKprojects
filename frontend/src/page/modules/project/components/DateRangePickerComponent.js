import React, { useEffect } from 'react';
import { InputNumber, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';

const DateRangePickerComponent = ({ value = { dateStart: null, dateEnd: null, duration: null }, onChange , maxDate , minDate}) => {

    const handleDateStartChange = (date) => {
        const newDuration = date && value.dateEnd ? dayjs(value.dateEnd).diff(date, 'day') : value.duration;
        onChange && onChange({ ...value, dateStart: date, duration: newDuration });
    };

    const handleDateEndChange = (date) => {
        const newDuration = date && value.dateStart ? dayjs(date).diff(value.dateStart, 'day') : value.duration;
        onChange && onChange({ ...value, dateEnd: date, duration: newDuration });
    };

    const handleDurationChange = (duration) => {
        const newDateEnd = value.dateStart ? dayjs(value.dateStart).add(duration, 'day') : value.dateEnd;
        onChange && onChange({ ...value, duration: duration, dateEnd: newDateEnd });
    };

    return (
        <div>
            <Space.Compact style={{ alignItems: 'flex-end' }}>
                <DatePicker
                    placeholder="Дата начала"
                    onChange={handleDateStartChange}
                    value={value.dateStart}
                    minDate={minDate  ?? null}
                    maxDate={value.dateEnd ?? maxDate}
                />
                <InputNumber
                    placeholder="Продолжительность"
                    formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                    parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                    value={value.duration}
                    onChange={handleDurationChange}
                />

                <DatePicker
                    placeholder="Дата окончания"
                    onChange={handleDateEndChange}
                    value={value.dateEnd}
                    disabledDate={(current) => value.dateStart && current && current < value.dateStart}
                    minDate={value.dateStart ?? minDate}
                    maxDate={maxDate ?? null}

                />
            </Space.Compact>
        </div>
    );
};

export default DateRangePickerComponent;
