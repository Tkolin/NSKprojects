import {Space, Typography} from "antd";
import Link from "antd/es/typography/Link";
const {Text} = Typography;

const ColumnProgressRender = ({record, text}) => {
    switch (record.status) {
        case 'APPROVAL_KP':
            return (
                <Space direction="vertical">
                    <Text>Проверка писем</Text>
                    <Text>Либо ждём ответа, либо составляем письмо</Text>
                    <Text>Дата последнего письма</Text>
                    <Text type="warning">если мы не ответили</Text>
                    <Text type="danger">если с последнего письма больше Х дней</Text>
                </Space>
            );
        case 'APPROVAL_AGREEMENT':
            return (
                <Space direction="vertical">
                    <Text>(если все данные верны)</Text>
                    <Text>Этапы - галочка</Text>
                    <Text>Ирд - галочка</Text>
                    <Text type="warning">если данные не заполнены</Text>
                    <Text type="danger">если данные не верны</Text>
                </Space>
            );
        case 'WAITING_SOURCE':
            return (
                <Space direction="vertical">
                    <Text>(Кол-во полученного ирд)</Text>
                    <Text>Ирд - кол-во / дата последнего</Text>
                    <Link>Кнопка приступить к работе</Link>
                    <Text type="warning">если ирд получено</Text>
                    <Text type="danger">если срок получения ирд превысил х дней</Text>
                </Space>
            );
        case 'WORKING':
            return (
                <Space direction="vertical">
                    <Text>Этап - в работе</Text>
                    <Text>Задачи - в работе</Text>
                    <Text type="warning"> - </Text>
                    <Text type="danger"> - </Text>
                </Space>
            );
        default:
            return null;
    }
}
export default ColumnProgressRender;