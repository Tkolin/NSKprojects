import React, {useState} from 'react';
import './Styles.css'; // Импорт вашего CSS файла
import StatusLegend from "./components/StatusLegend";
import ProjectTableComponent from "./components/ProjectTableComponent";
import {Divider, Form, Space} from "antd";
import Search from "antd/es/input/Search";
import index from "../CreateNewCommercialOffer";


const ProjectTable = ({projectStatuses, options}) => {
        const [formSearch] = Form.useForm();
        const [search, setSearch] = useState('');
        return (
            <div>
                <StatusLegend data-permission={"read-project-statistic"}/>
                <Divider/>
                <Form form={formSearch} layout="horizontal">
                    <Form.Item label="Поиск:" name="search">
                        <Space>
                            <Search
                                placeholder="Найти..."
                                allowClear
                                enterButton="Найти"
                                onSearch={value => setSearch(value)}
                            />
                        </Space>
                    </Form.Item>
                </Form>
                <ProjectTableComponent projectStatuses={projectStatuses} options={options} search={search}/>
            </div>

        )
    }
;

export default ProjectTable;
