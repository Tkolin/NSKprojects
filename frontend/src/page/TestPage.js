import React from 'react';
import { Badge, Calendar } from 'antd';
const getListData = (value) => {
    let listData = []; // Specify the type of listData
    switch (value.date()) {
        case 8:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
            ];
            break;
        case 10:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
                {
                    type: 'error',
                    content: 'This is error event.',
                },
            ];
            break;
        case 15:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event',
                },
                {
                    type: 'success',
                    content: 'This is very long usual event......',
                },
                {
                    type: 'error',
                    content: 'This is error event 1.',
                },
                {
                    type: 'error',
                    content: 'This is error event 2.',
                },
                {
                    type: 'error',
                    content: 'This is error event 3.',
                },
                {
                    type: 'error',
                    content: 'This is error event 4.',
                },
            ];
            break;
        default:
    }
    return listData || [];
};
const getMonthData = (value) => {
    if (value.month() === 8) {
        return 1394;
    }
};
const App = () => {

    return <Calendar/>;
};
export default App;