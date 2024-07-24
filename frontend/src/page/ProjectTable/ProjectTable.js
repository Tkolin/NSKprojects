import React, {useState} from 'react';
import './Styles.css';
import StatusLegend from "./components/StatusLegend";
import ProjectTableComponent from "./components/ProjectTableComponent";
import ToolBar from "./components/ToolBar";
import {Divider, Space} from "antd";


const ProjectTable = ({projectStatuses, legendOptions, columnOptions, toolBarOptions}) => {
        const [search, setSearch] = useState('');
        const [refetch, setRefetch] = useState(false);
        const onRefetch = () =>{
            setRefetch(!refetch);
        }

        return (
            <div>
                {legendOptions && (
                    <>
                        <StatusLegend projectStatuses={legendOptions} data-permission={"read-project-statistic"}/>
                        <Divider/>
                    </>
                )}
                <Space.Compact direction={"horizontal"}>
                    <ToolBar onCompleted={()=>onRefetch()}  options={['search','add_request']} gutter={5} onSearch={setSearch}/>
                </Space.Compact>
                <Divider/>

                <ProjectTableComponent projectStatuses={projectStatuses} options={columnOptions} search={search} state={refetch}/>
            </div>

        )
    }
;

export default ProjectTable;
