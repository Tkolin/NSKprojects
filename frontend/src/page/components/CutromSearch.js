import { DatePicker, InputNumber, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
const { RangePicker } = DatePicker;

const DateRangePickerComponent = ({ inputProps,buttonProps, onSeach, }) => {

    const handleDateStartChange = (date) => {
        const newDuration = date && value.dateEnd ? dayjs(value.dateEnd).diff(date, 'day') : value.duration;
        onChange && onChange({ ...value, dateStart: date, duration: newDuration });
    };

    const handleDateEndChange = (date) => {
        const newDuration = date && value.dateStart ? dayjs(date).diff(value.dateStart, 'day') : value.duration;
        onChange && onChange({ ...value, dateEnd: date, duration: newDuration });
    };
    const handleDateChange = (date) => {
         console.log(date);
         if(!date)
         {
             onChange && onChange({ dateStart: null, dateEnd: null, duration: value?.duration ?? 0 });
            return;
         }
        const newDuration = (date[0] && date[1]) ? dayjs(date[1]).diff(dayjs(date[0]), 'day') : 0;
         onChange && onChange({ dateStart: date[0] ?? null, dateEnd: date[1] ?? null, duration: newDuration });
    };

    const handleDurationChange = (duration) => {
        const newDateEnd = value.dateStart ? dayjs(value.dateStart).add(duration, 'day') : value.dateEnd;
        onChange && onChange({ ...value, duration: duration, dateEnd: newDateEnd });
    };

    return (

            <Space.Compact style={{ alignItems: 'flex-end' }}>
                <RangePicker
                    placeholder={"Продолжительность"}
                    value={[value.dateStart, value.dateEnd]}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    {...props}
                 />
                {/*<CustomDatePicker*/}
                {/*    placeholder="Дата начала"*/}
                {/*    onChange={handleDateStartChange}*/}
                {/*    minDate={minDate  ?? null}*/}
                {/*    maxDate={value.dateEnd ?? maxDate}*/}
                {/*/>*/}
                {/*<CustomDatePicker*/}
                {/*    placeholder="Дата окончания"*/}
                {/*    onChange={handleDateEndChange}*/}
                {/*    value={value.dateEnd}*/}
                {/*    disabledDate={(current) => value.dateStart && current && current < value.dateStart}*/}
                {/*    minDate={value.dateStart ?? minDate}*/}
                {/*    maxDate={maxDate ?? null}*/}

                {/*/>*/}
                <InputNumber
                    placeholder="Продолжительность"
                    formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                    parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                    value={value.duration}
                    onChange={handleDurationChange}
                    {...props}
                />
            </Space.Compact>

    );
};

export default DateRangePickerComponent;
