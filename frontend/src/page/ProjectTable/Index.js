import React, {useState} from 'react';
import './Styles.css'; // Импорт вашего CSS файла
import StatusLegend from "./components/StatusLegend";
import ProjectTableComponent from "./components/ProjectTableComponent";
import {Divider, Form, Space} from "antd";
 import Search from "antd/es/input/Search";


const Index = ({projectStatuses}) => {
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
                                allowClear
                                enterButton="Найти"
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

export default Index;
