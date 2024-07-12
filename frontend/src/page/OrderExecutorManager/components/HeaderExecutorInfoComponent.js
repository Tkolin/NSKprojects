import {Space, Typography} from "antd";
import Link from "antd/es/typography/Link";

const {Text} = Typography;

export const HeaderExecutorInfoComponent = ({executor, onClick, isLink = true}) => {
    return (
        <Space.Compact direction={"vertical"}>
            {executor.passport.lastname ?? ""} {executor?.passport.patronymic ?? ""} {executor.passport.firstname ?? ""}
            {isLink ? <Link onClick={()=>onClick()}>Сгенерировать договор</Link> : ""}
        </Space.Compact>
    );
}