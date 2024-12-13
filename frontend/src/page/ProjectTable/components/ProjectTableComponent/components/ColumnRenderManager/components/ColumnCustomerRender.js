import { Space, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import React from "react";
import { facilitiesToFullCode } from "../../../../../../components/script/rebuildData/ProjectRebuilderQuery";
const { Text } = Typography;

const ColumnCustomerRender = ({ text, record }) => {
  return (
    <Space.Compact direction={"vertical"} style={{ alignContent: "start" }}>
      {record.organization_customer ? (
        <Title level={5} style={{ marginTop: 0 }}>
          {record.organization_customer?.name ?? "?"}
        </Title>
      ) : (
        <Title level={5} style={{ marginTop: 0, color: "#ff4d4f" }}>
          Организация не указана
        </Title>
      )}
      <Text strong>Объекты:</Text>
      {record.facilities && record.facilities?.length > 0 ? (
        record.facilities?.map((row) => (
          <Tooltip
            placement={"leftBottom"}
            title={
              `${row?.facility_group?.facility_subselection?.facility_selection.name}, ` +
              `${row?.facility_group?.facility_subselection?.name}, ` +
              `${row?.facility_group?.name}, ` +
              `${row?.name}.`
            }
          >
            <Text style={{ marginLeft: 8, color: "#1677ff" }} key={row.id}>
              {facilitiesToFullCode(row)}
            </Text>
          </Tooltip>
        ))
      ) : (
        <Text type="danger">Объекты отсутствуют</Text>
      )}
      <Text strong>Представители:</Text>
      {record.delegations && record.delegations?.length > 0 ? (
        record?.delegations?.map((delegate) => (
          <Link style={{ marginLeft: 8 }} key={delegate.id}>
            {delegate?.last_name ?? ""} {delegate?.first_name ?? ""}{" "}
            {delegate?.patronymic ?? ""}
          </Link>
        ))
      ) : (
        <Text>Представители отсутствуют</Text>
      )}
    </Space.Compact>
  );
};
export default ColumnCustomerRender;
