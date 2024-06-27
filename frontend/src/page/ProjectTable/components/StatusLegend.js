import React from 'react';
import {Space} from "antd";

const LegendItem = ({ color, text , backgroundImage}) => (
    <div style={{
        backgroundImage: backgroundImage,
        backgroundColor: color,
        padding: '8px',
        marginBottom: '4px',
        borderRadius: '4px',
        color: '#000',
        display: 'flex',
        alignItems: 'center'
    }}>
        {text}
    </div>
);

const StatusLegend = () => {
    const legendItems = [
        { status: 'ARCHIVE', color: '#d9d9d9', text: 'В Архиве' },
        { status: 'DEVELOPMENT', color: '#cce6ff', text: 'В разработке' },
        { status: 'EXAMINATION', color: '#ffd591', text: 'В экспертизе' },
        { status: 'COMPLETED', color: '#d9f7be', text: 'Выполнен' },
        { status: 'CUSTOMER_APPROVAL', color: '#fff566', text: 'На согласовании Заказчиком' },
        { status: 'DANGER', backgroundImage: 'linear-gradient(90deg, #ff4d4d 1%, rgba(182, 238, 174, 0) 5%)', text: 'Просрочка по срокам' },
        { status: 'WARNING', backgroundImage: 'linear-gradient(90deg, rgb(255, 162, 81) 1%, rgba(182, 238, 174, 0) 5%)', text: 'Ожидание действий' }

    ];

    return (
        <Space.Compact direction={"vertical"} >
            {legendItems.map(item => (
                <LegendItem key={item.status} color={item?.color ?? null} text={item.text}
                            backgroundImage={item?.backgroundImage ?? null}/>
            ))}
        </Space.Compact>
    );
};

export default StatusLegend;
