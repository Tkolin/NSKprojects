import React from 'react';
import { DatePicker, TimePicker, Calendar } from 'antd';
import moment from 'moment';

// Устанавливаем глобальную локализацию для moment.js
moment.locale('ru');

const CustomDatePicker = ({...props}) => (
    <DatePicker style={{width: "100%"}}  format="DD.MM.YYYY" {...props} />
);

const CustomTimePicker = ({...props}) => (
    <TimePicker style={{width: "100%"}} format="HH:mm" {...props} />
);

const CustomCalendar = ({...props}) => (
    <Calendar style={{width: "100%"}} dateCellRender={(date) => date.format('DD.MM.YYYY')} {...props} />
);

export { CustomDatePicker, CustomTimePicker, CustomCalendar };
