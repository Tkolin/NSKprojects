import React from 'react';
import { DatePicker, TimePicker, Calendar } from 'antd';
import moment from 'moment';

// Устанавливаем глобальную локализацию для moment.js
moment.locale('ru');

const CustomDatePicker = (props) => (
    <DatePicker format="DD.MM.YYYY" {...props} />
);

const CustomTimePicker = (props) => (
    <TimePicker format="HH:mm" {...props} />
);

const CustomCalendar = (props) => (
    <Calendar dateCellRender={(date) => date.format('DD.MM.YYYY')} {...props} />
);

export { CustomDatePicker, CustomTimePicker, CustomCalendar };
