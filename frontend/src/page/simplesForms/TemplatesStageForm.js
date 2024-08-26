import React, {useEffect, useState} from 'react';
import {Alert, Card, Select, Space} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {PROJECTS_STAGES_TEMPLATES} from "../../graphql/queriesCompact";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";

const TemplatesStageForm = ({project, onCompleted}) => {
    const {loading, data} = useQuery(PROJECTS_STAGES_TEMPLATES);
    const [mutate, {loading: loadingResult}] = useMutation(SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            console.log(`Ответ: `, data);
            onCompleted && onCompleted()
        },
        onError: (error) => {
            console.log(`Ошибка: `, error.message);
        },
    });
    useEffect(() => {

    }, [project,]);
    const [selectedProject, setSelectedProject] = useState()
    return (
        <Card
            title={"Применение шаблона"}
        >
            <Space direction={"vertical"}>
                <Select
                    style={{
                        width: '200px'
                    }}
                    loading={loading}
                    popupMatchSelectWidth={false}
                    onSelect={(value, option) => setSelectedProject(data?.projects?.items?.filter(row => row.id === value)[0])}
                    onChange={(value, option) => console.log("OnSelected", value, option)}
                >
                    {data?.projects?.items?.filter(row => row.project_stages.length > 0).map(row => (
                        <Select.Option key={row.id} value={row.id}>
                            {row.name}
                        </Select.Option>
                    ))}
                </Select>
                <Alert message={<ul>{selectedProject?.project_stages.map(row => (<li>{row.stage.name}</li>))}</ul>}/>
                <StyledButtonGreen loading={loadingResult} onClick={() => mutate({
                    variables: {
                        projectId: project.id, templateProjectId: selectedProject.id
                    }
                })}>Применить шаблон</StyledButtonGreen>

            </Space>

        </Card>
    );
};

export default TemplatesStageForm;
