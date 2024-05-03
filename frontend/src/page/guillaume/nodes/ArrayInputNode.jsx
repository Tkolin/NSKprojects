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

export default function ArrayInputNode({ id, data }) {
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

        updateValue(iterations, "iterations");
    }, [data.start, data.end, data.step]);

    return (
        <StyledBlockBig
            label={"Данные"}
            styleBlcok={{ border: "2px solid " + colors.input.primary }}
            styleHeader={{ backgroundColor: colors.input.secondary }}
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
                id={id + "_output"}
                type="source"
                position="right"
                style={{
                    marginRight: "-56px",
                    backgroundColor: colors.output.secondary,
                    borderColor: colors.output.primary,
                    width: 15,
                    height: 15,
                }}
            />
            <Button
                icon={<PlusSquareOutlined />}
                size={"small"}
                style={{ width: "100%", marginTop: "2px", borderColor: colors.input.primary }}
                type={"dashed"}
            />
        </StyledBlockBig>
    );
}
