import React, {useState} from 'react';
import './Styles.css'; // Импорт вашего CSS файла
import StatusLegend from "./components/StatusLegend";
import ProjectTableComponent from "./components/ProjectTableComponent";
import {Divider, Form, Space} from "antd";
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";


const Index = ({projectStatuses}) => {
    const [formSearch] = Form.useForm();
    const [search, setSearch] = useState('');
        return (
            <div>

                <Divider style={{marginTop: 0}}>
                    <Title style={{marginTop: 0}}
                           level={2}>
                        Отчёты по Проектам
                    </Title>
                </Divider>
                <Divider/>
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
