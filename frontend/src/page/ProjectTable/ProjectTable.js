import React, {useState} from 'react';
import './Styles.css';
import StatusLegendComponent from "./components/StatusLegendComponent";
import ProjectTableComponent from "./components/ProjectTableComponent";
import {Divider, Space} from "antd";
import ProjectTasksManagerForm from "../ProjectTasksManagerForm";
import ToolBarComponent from "./components/ToolBarComponent";

const settings = {
    contract: {
        projectStatuses: [""],
        column: {
            toolMenu: [""],
            columns: [""],
            upButon: ""
        },
        expandable: [""]
    },
    kp: {
        projectStatuses: [""],
        column: {
            toolMenu: [""],
            columns: [""],
            upButon: ""
        },
        expandable: [""]
    },
    archive: {
        projectStatuses: [""],
        column: {
            toolMenu: [""],
            columns: [""],
            upButon: ""
        },
        expandable: [""]
    },
    request: {
        projectStatuses: [""],
        column: {
            toolMenu: [""],
            columns: [""],
            upButon: ""
        },
        expandable: [""]
    },
    work: {
        projectStatuses: [""],
        column: {
            toolMenu: [""],
            columns: [""],
            upButon: ""
        },
        expandable: [""]
    },
    extra: {
        projectStatuses: [""],
        column: {
            tool: {
                menu: [""],
                hotKey: [""],
            },
            columns: [""],
        },
        expandable: [""]
    }
}
const ProjectTable = ({mode}) => {
        const [search, setSearch] = useState('');
        const [refetch, setRefetch] = useState(false);

    const onRefetch = () => {
            setRefetch(!refetch);
        }

        return (
            <div>
                {/*{legendOptions && (*/}
                {/*    <>*/}
                {/*        <StatusLegendComponent projectStatuses={legendOptions} data-permission={"read-project-statistic"}/>*/}
                {/*        <Divider/>*/}
                {/*    </>*/}
                {/*)}*/}
                <Space.Compact direction={"horizontal"}>
                    <ToolBarComponent onCompleted={() => onRefetch()} options={['search', 'add_request']} gutter={5}
                                      onSearch={setSearch}/>
                </Space.Compact>
                <Divider/>

                <ProjectTableComponent settings={settings} search={search} state={refetch}/>
            </div>

        )
    }
;

export default ProjectTable;
