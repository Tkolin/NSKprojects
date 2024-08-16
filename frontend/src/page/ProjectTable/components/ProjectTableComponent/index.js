import {notification, Table, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {PROJECTS_QUERY} from "../../../../graphql/queries";
import GetColumns from "./components/ColumnRenderManager";
import ExpandedRowRenderManager from "./components/ExpandedRowRenderManager";

const {Text} = Typography;

const Index = ({settings, projectStatuses, mode, search, columnSettings, options, expandableOptions, state}) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [expandedRowKeys, setExpandedRowKeys] = useState();
    const [currentSort, setCurrentSort] = useState({});
    const [column, setColumn] = useState();
    const onExpand = (value) => {
        setExpandedRowKeys((expandedRowKeys === value) ? null : value);
    }
    useEffect(() => {
        setColumn(
            GetColumns({
                options: settings.column ?? columnSettings,
                permissions: "all",
                expandable: {
                    onExpand: (value) => onExpand(value),
                    expandedRowKeys: expandedRowKeys,
                },
                onUpdated: () => refetch()
            }))

    }, [options, expandedRowKeys]);
    useEffect(() => {
        refetch();
    }, [state]);


// Мутация для удаления
    const refetch = () => {
        console.log("PROJECTS_QUERY refetchg");
        refetchProject();
    }
    const {loading: loading, error: error, data: data, refetch: refetchProject} = useQuery(PROJECTS_QUERY, {
        variables: {
            projectStatuses: settings.projectStatuses ?? projectStatuses,
            queryOptions: {
                page,
                limit,
                search,
                sortField,
                sortOrder
            }
        },
        fetchPolicy: "cache-and-network",
    });


// Таблица


    const onChange = (pagination, filters, sorter) => {
        if ((sorter.field !== undefined) && currentSort !== sorter) {
            setCurrentSort(sorter);
            if (sortField !== sorter.field) {
                setSortField(sorter.field);
                setSortOrder("asc");
            } else {
                setSortField(sortField);
                switch (sortOrder) {
                    case ("asc"):
                        setSortOrder("desc");
                        break;
                    case ("desc"):
                        setSortOrder("");
                        break;
                    case (""):
                        setSortOrder("asc");
                        break;
                }
            }
        }
    };


    return (
        <div>
            <Table
                style={{border: "black"}}
                rowClassName={(record) => 'my-ant-table-row-' + record?.status?.name_key?.toLowerCase()
                    //+ ((record.id % 2 === 0) ? ' my-ant-table-row-danger' : ' my-ant-table-row-warning')
                }
                size={'small'}
                sticky={{
                    offsetHeader: '64px',
                }}
                loading={loading}
                dataSource={data?.projects?.items?.map((row) => ({...row, key: row.id}))}
                columns={column}
                bordered

                onChange={onChange}
                pagination={{
                    total: data?.projects?.count,
                    current: page,
                    pageSize: limit,
                    onChange: (page, limit) => {
                        setPage(page);
                        setLimit(limit)
                    },
                    onShowSizeChange: (current, size) => {
                        setPage(1);
                        setLimit(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}

                expandable={{
                    expandedRowKeys: expandedRowKeys ? [expandedRowKeys] : [],
                    showExpandColumn: false,
                    expandedRowRender: (record) => (
                        <ExpandedRowRenderManager project={record} options={settings.expandable ?? expandableOptions}/>
                    ),
                }}
            />
        </div>
    );
}


export default Index;