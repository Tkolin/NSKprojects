import {Button} from "antd";
import {DownSquareOutlined, UpSquareOutlined} from "@ant-design/icons";
import React, {useContext} from "react";
import {NotificationContext} from "../../../../../../../../../NotificationProvider";

const {openNotification} = useContext(NotificationContext);

const ExpandableButton = ({expandable, onExpand, key}) => {

    return (
        <Button type={"text"}
                icon={(expandable?.expandedRowKeys === key) ? <UpSquareOutlined/> : <DownSquareOutlined/>}
                onClick={() => onExpand(key)}/>
    )
}
export default ExpandableButton;