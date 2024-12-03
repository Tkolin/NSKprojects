import { CloseOutlined } from "@ant-design/icons";
import { Row, Space, Tooltip } from "antd";
import React from "react";
import { AutoCompleteFormItem } from "../../components/CustomForm";
import { StyledButtonRed } from "../../components/style/ButtonStyles";
import { CustomAutoCompleteExtension } from "../../components/style/SearchAutoCompleteStyles";

const ParameterItem = ({
  onChange,
  index,
  parameterItems,
  removeItem,
  setParameterModalStatus,
}) => {
  return (
    <Row key={index} gutter={0} style={{ marginBottom: 0 }}>
      <Space.Compact style={{ width: "100%" }}>
        <Tooltip title="Наименование параметр">
          <AutoCompleteFormItem
            name={[index, "parameter"]}
            rulesValidationRequired={true}
            rulesValidationMessage={"Укажите параметр"}
          >
            <CustomAutoCompleteExtension
              style={{ marginBottom: 0, width: "100%" }}
              placeholder={"Выбор параметр..."}
              visibleMode={"CREATE_WHERE_NON_SELECTED"}
              firstBtnOnClick={() =>
                setParameterModalStatus &&
                setParameterModalStatus({ mode: "add", key: index })
              }
              data={parameterItems}
              onSelect={() => {
                onChange && onChange();
              }}
              onChange={() => {
                onChange && onChange();
              }}
            />
          </AutoCompleteFormItem>
        </Tooltip>

        <StyledButtonRed
          icon={<CloseOutlined />}
          onClick={() => removeItem && removeItem(index)}
        />
      </Space.Compact>
    </Row>
  );
};

export default ParameterItem;
