import { useQuery } from "@apollo/client";
import { Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { PROJECTS_QUERY } from "../../../../graphql/queries/all";
import getColumn from "./components/ColumnRenderManager";
import ExpandedRowRenderManager from "./components/ExpandedRowRenderManager";

const { Text } = Typography;

const Index = ({
  settings,
  projectStatuses,
  mode,
  search,
  columnSettings,
  options,
  expandableOptions,
  state,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [expandedRowKeys, setExpandedRowKeys] = useState();
  const [currentSort, setCurrentSort] = useState({});
  const [column, setColumn] = useState();
  const onExpand = (value) => {
    setExpandedRowKeys(expandedRowKeys === value ? null : value);
  };
  const {
    loading: loading,
    error: error,
    data: data,
    refetch: refetchProject,
  } = useQuery(PROJECTS_QUERY, {
    variables: {
      projectStatuses: settings?.projectStatuses ?? projectStatuses ?? null,
      queryOptions: {
        page,
        limit,
        search,
        sortField,
        sortOrder,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    setColumn(
      getColumn({
        options: settings.column
          ? {
              ...settings.column,
              tool: {
                ...settings.column.tool,
                expandable: settings.expandable && true,
              },
            }
          : columnSettings,
        permissions: "all",
        expandableTableProps: {
          onExpand: (value) => onExpand(value),
          expandedRowKeys: expandedRowKeys,
        },
        onUpdated: () => refetch(),
      })
    );
  }, [options, expandedRowKeys, settings, data]);
  useEffect(() => {
    console.log("0 cashe changed", data?.projects?.items[0]?.project_tasks);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [state]);
  const refetch = () => {
    console.log("PROJECTS_QUERY refetchg");
    refetchProject();
  };
  const onChange = (pagination, filters, sorter) => {
    if (sorter.field !== undefined && currentSort !== sorter) {
      setCurrentSort(sorter);
      if (sortField !== sorter.field) {
        setSortField(sorter.field);
        setSortOrder("asc");
      } else {
        setSortField(sortField);
        switch (sortOrder) {
          case "asc":
            setSortOrder("desc");
            break;
          case "desc":
            setSortOrder("");
            break;
          case "":
            setSortOrder("asc");
            break;
        }
      }
    }
  };

  return (
    <div>
      <Table
        style={{ border: "black" }}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.projects?.items?.map((row) => ({
          ...row,
          key: row.id,
        }))}
        columns={column}
        bordered
        onChange={onChange}
        pagination={{
          total: data?.projects?.count,
          current: page,
          pageSize: limit,
          onChange: (page, limit) => {
            setPage(page);
            setLimit(limit);
          },
          onShowSizeChange: (current, size) => {
            setPage(1);
            setLimit(size);
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        expandable={{
          expandedRowKeys: expandedRowKeys ? [expandedRowKeys] : [],
          showExpandColumn: false,
          expandedRowRender: (record) => (
            <ExpandedRowRenderManager
              project={record}
              options={settings.expandable ?? expandableOptions}
            />
          ),
        }}
      />
    </div>
  );
};

export default Index;
