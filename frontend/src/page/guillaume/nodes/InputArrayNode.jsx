import React, { useEffect } from "react";
import { Handle } from "reactflow";
import { Button, Input, Space } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import { useStore } from "../store";
import { StyledBlockBig } from "../../style/BlockStyles";
import { colors } from "../../style/colors";

const selector = (id, data) => (store) => ({
    setValue: (data) => {
        store.updateNode(id, data);
    },
});

export default function InputArrayNode({ id, data }) {
    const { setValue } = useStore(selector(id, data));

    const updateValue = (value, field) => {
        const newData = { ...data, [field]: value };
        setValue(newData);
    };

    useEffect(() => {
        const { start, end, step } = data;
        const iterations = [];
        let currentValue = parseFloat(start);

        while (currentValue <= parseFloat(end)) {
            iterations.push(currentValue);
            currentValue += parseFloat(step);
        }

        updateValue({"only": {value: iterations}}, "outputs");
    }, [data.start, data.end, data.step]);

    return (
        <StyledBlockBig
            label={"Список значений"}
            styleBlcok={{ border: "2px solid " + colors.inputArray.primary }}
            styleHeader={{ backgroundColor: colors.inputArray.secondary }}
            styleHeaderText={{ color: colors.textColor, margin: 0, marginBottom: "5px" }}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Input
                    placeholder={"Начальный элемент"}
                    value={data.start}
                    onChange={(e) => updateValue(e.target.value, "start")}
                />
                <Input
                    placeholder={"Конечный элемент"}
                    value={data.end}
                    onChange={(e) => updateValue(e.target.value, "end")}
                />
                <Input
                    placeholder={"Шаг итерации"}
                    value={data.step}
                    onChange={(e) => updateValue(e.target.value, "step")}
                />
            </Space>
            <Handle
                id={'only'}
                type="source"
                position="right"
                style={{
                    marginRight: "-5px",
                    background: 'radial-gradient(circle,'+colors.outputArray.primary+' 20%, '+colors.outputArray.secondary+' 20%)',
                    borderColor: colors.inputArray.primary,
                    borderWidth: "1px",
                    width: 20,
                    height: 20,
                }}
            />
        </StyledBlockBig>
    );
}
