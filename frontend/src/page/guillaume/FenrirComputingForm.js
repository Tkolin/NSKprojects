import {useQuery} from "@apollo/client";
import {FENRIR_QUERY} from "../../graphql/queries";
import {StyledBlockBig} from "../style/BlockStyles";
import {Col, Divider, Input, Row} from "antd";
import {colors} from "../style/colors";
import {useState} from "react";

const FenrirComputingForm = () => {
    const [fenrirModels, setFenrirModels] = useState({});

    const {
        loading: loadFenrir,
        error: errorFenrir,
        data: dataFenrir,
        refetch: refetchFenrir
    } = useQuery(FENRIR_QUERY, {
        fetchPolicy: 'network-only',
        onCompleted: (result) => {
            console.log(result.fenrirs.items.length);
            setFenrirModels(JSON.parse(result.fenrirs.items[result.fenrirs.items.length - 1].models));
        }
    });

    return (
        <StyledBlockBig style={{
            overflow: 'auto',
            width: '120px',
            color: colors.textColor,
            backgroundColor: colors.siderBG,
            padding: '5px',
        }}>
            <Row gutter={4}>
                <Col span={8}>
                    <Divider style={{
                        margin: 0, marginBottom: '10px',
                        color: colors.textColor
                    }}>Ввод данных</Divider>
                    {fenrirModels.nodes?.map((row) => {
                        if (row.type === 'inputNode') {
                            return Object.keys(row.data.outputs).map((key) => {
                                return (
                                    <div style={{width: "100%"}}>
                                        <Row style={{width: "100%"}}>
                                            {row.data.outputs[key].name} :
                                        </Row>
                                        <Row style={{width: "100%"}}>
                                            <Input
                                                size={"small"}
                                                value={row.data.outputs[key].value}
                                                onChange={(e) => {
                                                    if (e.target.value !== row.data.outputs[key].value) {
                                                        const data = {...row.data};
                                                        data.outputs[key].value = e.target.value;
                                                        setFenrirModels(prevState => ({
                                                            ...prevState,
                                                            nodes: prevState.nodes.map(node => node.id === row.id ? {
                                                                ...node,
                                                                data
                                                            } : node)
                                                        }));
                                                    }
                                                }}
                                                style={{width: "100%"}}
                                            />

                                        </Row>
                                    </div>

                                );
                            });
                        }
                        return null;
                    })}

                    <hr/>
                    {fenrirModels.nodes?.map((row) => {
                        if (row.type === 'referenceNode') {
                            return (
                                <div key={row.id}>{row.id} - {row.type}</div>
                            );
                        }
                        return null;
                    })}
                    <hr/>
                    {fenrirModels.nodes?.map((row) => {
                        if (row.type === 'arrayInputNode') {
                            return (
                                <div key={row.id}>{row.id} - {row.type}</div>
                            );
                        }
                        return null;
                    })}
                </Col>
                <Col span={8}>

                </Col>
                <Col span={8}>
                    <Divider style={{
                        margin: 0, marginBottom: '10px',
                        color: colors.textColor
                    }}>Вывод</Divider>
                    {fenrirModels.nodes?.map((row) => {
                        if (row.type === 'outputNode') {
                            return Object.keys(row.data.outputs).map((key) => {
                                return (
                                    <div style={{width: "100%"}}>
                                        <Row style={{width: "100%"}}>
                                            {row.data.outputs[key].name} :
                                        </Row>
                                        <Row style={{width: "100%"}}>
                                            <Input
                                                size={"small"}
                                                value={row.data.outputs[key].value}
                                                onChange={(e) => {
                                                    if (e.target.value !== row.data.outputs[key].value) {
                                                        const data = {...row.data};
                                                        data.outputs[key].value = e.target.value;
                                                        setFenrirModels(prevState => ({
                                                            ...prevState,
                                                            nodes: prevState.nodes.map(node => node.id === row.id ? {
                                                                ...node,
                                                                data
                                                            } : node)
                                                        }));
                                                    }
                                                }}
                                                style={{width: "100%"}}
                                            />

                                        </Row>
                                    </div>

                                );
                            });
                        }
                        return null;
                    })}

                </Col>
            </Row>
        </StyledBlockBig>
    );
}

export default FenrirComputingForm;
