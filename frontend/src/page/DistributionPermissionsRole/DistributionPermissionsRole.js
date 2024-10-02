import { Divider, Form, Input, Space } from "antd";
import React, { useState } from 'react';
import './Styles.css'; // Импорт вашего CSS файла
import ProjectTableComponent from "./components/ProjectTableComponent";
import StatusLegend from "./components/StatusLegendComponent";
const {Search} = Input;

const DistributionPermissionsRole = ({projectStatuses}) => {
        const [formSearch] = Form.useForm();
        const [search, setSearch] = useState('');
        return (
            <div>

                <StatusLegend  />
                <Divider/>
                <Form form={formSearch} layout="horizontal">
                    <Form.Item label="Поиск:" name="search">
                        <Space>
                            <Search
                                placeholder="Найти..."
                          
                                
                                onSearch={value => setSearch(value)}
                            />
                        </Space>
                    </Form.Item>
                </Form>

                <ProjectTableComponent projectStatuses={projectStatuses} search={search}/>
            </div>

        )
    }
;

export default DistributionPermissionsRole;
