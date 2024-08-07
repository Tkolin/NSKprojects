import React, {useState} from 'react';
import {Button,  Divider, Space} from 'antd';

import ProjectTasksStructureForm from "../ProjectTasksStructureForm";
import ProjectTasksManagerForm from "../ProjectTasksManagerForm";
import {EyeOutlined} from "@ant-design/icons";


const CombinedProjectTasksForms = ({project}) => {



    const [page, setPage] = useState("structure");
    const [loading, setLoading] = useState();





    return (
        <Space>

            <Space direction={"vertical"}>

                <Space.Compact block>
                    {/*TODO: Надо спрашивать об сохранении изменений*/}

                    <Button style={{width: "50%"}}
                            disabled={page === "structure"}
                            children={"Структура задач"}
                            onClick={() => setPage("structure")} icon={page === "structure" ? "" : <EyeOutlined/>}/>
                    <Button style={{width: "50%"}}
                            disabled={page === "manage"}
                            children={"Настройка задач"}
                            onClick={() => setPage("manage")} icon={page === "manage" ? "" : <EyeOutlined/>}/>
                </Space.Compact>


                {
                    page === "structure" ? (
                            <ProjectTasksStructureForm
                                actualProject={project}
                                setLoading={setLoading}/>
                        ) : page === "manage" ?
                          (
                        <ProjectTasksManagerForm
                            actualProject={project}
                            setLoading={setLoading}/>
                            ) : setPage("structure")
                }
                <Divider style={{margin: 2}}/>
            </Space>

        </Space>

    )
        ;

};

export default CombinedProjectTasksForms;
