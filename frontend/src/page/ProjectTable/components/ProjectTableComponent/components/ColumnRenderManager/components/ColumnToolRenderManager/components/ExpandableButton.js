import {Button, Tooltip} from "antd";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";


const ExpandableButton = ({expandable, expandableKey}) => {

    return (
        <Tooltip title={"Раскрыть подробности данной записи"}>
            <Button type={"text"}
                    icon={(expandable?.expandedRowKeys === expandableKey) ? <UpOutlined/> : <DownOutlined/>}
                    onClick={() => expandable.onExpand(expandableKey)}/>
        </Tooltip>

    )
}
export default ExpandableButton;