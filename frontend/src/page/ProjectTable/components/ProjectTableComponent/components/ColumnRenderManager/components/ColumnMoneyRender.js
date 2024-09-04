import {Space, Typography} from "antd";
import React from "react";
import dayjs from "dayjs";

const {Text} = Typography;

const ColumnMoneyRender = ({text, record}) => {
    return (
        <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
            <Text>Стоимость проекта: <strong>{record.price} руб.</strong></Text>
            <Text>Аванс: ({record.prepayment} %): <strong>{record.price / 100 * record.prepayment} руб.</strong></Text>
            <Text>Дата подписания договора: <strong>{dayjs(record.date_signing).format("DD.MM.YYYY")}</strong></Text>
            <Text>На продолжительность: <strong>{record.duration} дней</strong></Text>
        </Space.Compact>
    );
}
export default ColumnMoneyRender;