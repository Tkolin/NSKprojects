import { Divider, Space } from "antd";
import ArchivedButton from "./components/ArchivedButton";
import ExpandableButton from "./components/ExpandableButton";
import MenuManager from "./components/MenuManager";

import UpButton from "./components/UpButton";
// options: {
//     //  Компоненты скрытые в ...
//     menu: ["crud", "contract", "kp"],
//     //  Кнопки быстрых действий
//     hotKey: ["archive"],
// }
const ColumnToolRenderManager = ({
                                     options = {},
                                     onUpdated,
                                     expandableTableProps,
                                     record,
                                 }) => {

    return (
        <Space direction={"vertical"} key={record.id}>
            <MenuManager record={record} onUpdated={onUpdated} itemOptions={options?.menu}/>
            <Divider style={{margin: 0}}/>
            <Space.Compact direction={"vertical"}>
                {
                    options?.hotKey &&
                    (<>
                        {
                            options.hotKey.includes("up") &&
                            <UpButton project={record} onCompleted={onUpdated}/>
                        }
                        {
                            options.hotKey.includes("archive") &&
                            <ArchivedButton  projectId={record.id} onCompleted={onUpdated}/>
                        }
                    </>)
                }
            </Space.Compact>
            <Divider style={{margin: 0}}/>
            {
                options.expandable &&
                <ExpandableButton expandable={expandableTableProps} expandableKey={record.id}/>
            }
        </Space>
    )
}
export default ColumnToolRenderManager;