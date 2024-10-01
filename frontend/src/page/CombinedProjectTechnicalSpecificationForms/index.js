import { Button, Divider, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { EyeOutlined } from "@ant-design/icons";
import ProjectTSManagerForm from '../ProjectTSManagerForm';
import ProjectTSStructureForm from '../ProjectTSStructureForm';


const CombinedTSForms = ({project}) => {
    const [page, setPage] = useState("structure");
    const [loading, setLoading] = useState();
    useEffect(() => {
        console.log("4 CombinedProjectTasksForms project", project.project_tasks);
    }, [project]);

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
                            <ProjectTSStructureForm
                                actualProject={project}
                                setLoading={setLoading}/>
                        ) : page === "manage" ?
                          (
                        <ProjectTSManagerForm
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

export default CombinedTSForms;
