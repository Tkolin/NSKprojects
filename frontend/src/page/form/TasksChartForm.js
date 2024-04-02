import React, {useEffect, useState} from 'react';
import {Col, Form, Input, InputNumber, Popconfirm, Row, Table, Typography} from 'antd';
import {Chart} from 'react-google-charts';
import {useQuery} from "@apollo/client";
import {STAGES_QUERY, TASKS_QUERY, TASKS_TO_PROJECT_QUERY} from "../../graphql/queries";

const EditableCell = ({editing, dataIndex, title, inputType, record, index, children, ...restProps}) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TasksChartForm = ({projectId}) => {
    const [originData, setOriginData] = useState();
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const {loading: loadingTasks, error: errorTasks, refetch: refetchTasks} = useQuery(TASKS_TO_PROJECT_QUERY, {
        variables: {projectId: 24},
        onCompleted: (data) => {
            console.log(data);

        }
    });
    const buildData = () => {

    };
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...originData];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setOriginData(newData); // Update originData
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setOriginData(newData); // Update originData
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'TaskID',
            width: '25%',
            editable: true,
        },
        {
            title: 'Task Name',
            dataIndex: 'TaskName',
            width: '25%',
            editable: true,
        },
        {
            title: 'Resource',
            dataIndex: 'Resource',
            width: '25%',
            editable: true,
        },
        {
            title: 'Start Date',
            dataIndex: 'StartDate',
            width: '15%',
            editable: true,
        },
        {
            title: 'End Date',
            dataIndex: 'EndDate',
            width: '40%',
            editable: true,
        },
        {
            title: 'Duration',
            dataIndex: 'Duration',
            width: '40%',
            editable: true,
        },
        {
            title: 'Percent Complete',
            dataIndex: 'PercentComplete',
            width: '40%',
            editable: true,
        },
        {
            title: 'Dependencies',
            dataIndex: 'Dependencies',
            width: '40%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{marginRight: 8}}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns?.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'Duration' || col.dataIndex === 'PercentComplete' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const columnsChart = [
        {type: 'string', label: 'Task ID'},
        {type: 'string', label: 'Task Name'},
        {type: 'string', label: 'Resource'},
        {type: 'date', label: 'Start Date'},
        {type: 'date', label: 'End Date'},
        {type: 'number', label: 'Duration'},
        {type: 'number', label: 'Percent Complete'},
        {type: 'string', label: 'Dependencies'},
    ];
    if(errorTasks){
        return errorTasks.message;
    }
    return (
        <Row style={{width: "100%"}} gutter={10}>
            <Form form={form} component={false}>
                <Table
                    style={{width: "100%"}}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    size={"small"}
                    bordered
                    dataSource={originData}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                />
            </Form>

            {originData && (
                <Chart
                    tyle={{width: "100%"}}
                    width={"100%"}
                    chartType="Gantt"
                    data={[columnsChart, ...originData?.map(item => [
                        item.TaskID,
                        item.TaskName,
                        item.Resource,
                        new Date(item.StartDate),
                        new Date(item.EndDate),
                        item.Duration,
                        item.PercentComplete,
                        item.Dependencies,
                    ])]}
                    options={{
                        height: 400,
                        gantt: {
                            trackHeight: 30,
                        },
                    }}
                />
            )}

        </Row>
    );
};

export default TasksChartForm;
