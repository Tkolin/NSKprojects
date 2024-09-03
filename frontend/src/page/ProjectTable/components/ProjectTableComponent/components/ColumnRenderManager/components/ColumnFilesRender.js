import {Space, Typography} from "antd";
import React from "react";
import LinkToDownload from "../../../../../../components/script/LinkToDownload";

const {Text} = Typography;

const ColumnFilesRender = ({text, record, status}) => {
    return (
        <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
            <LinkToDownload fileId={record.kp_file_id}>
                Скачать КП
            </LinkToDownload>
            <LinkToDownload fileId={record.contract_file_id}>
                Скачать Договор
            </LinkToDownload>

        </Space.Compact>
    )
}
export default ColumnFilesRender;