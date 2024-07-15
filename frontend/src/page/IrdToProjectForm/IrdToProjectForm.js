import {Button, Divider, Form, Space,} from "antd";
import {PlusOutlined,} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";

import {IRDS_QUERY_COMPACT} from "../../graphql/queriesCompact";
import IrdItem from "./components/IrdItem";
import dayjs from "dayjs";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import IrdModalForm from "../components/modal/IrdModalForm";
import {UPDATE_IRDS_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {
    rebuildIrdsResultQuery,
    rebuildIrdToQuery,
    rebuildStagesToQuery
} from "../components/script/rebuildData/ProjectRebuilderQuery";
import {NotificationContext} from "../../NotificationProvider";

const IrdToProjectForm = ({project, onCompleted}) => {
    const {openNotification} = useContext(NotificationContext);

    // Первичные данные
    const [form] = Form.useForm();
    const [irdModalStatus, setIrdModalStatus] = useState(null);

    const [mutateIrd] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
             onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении создания ирд : ${error.message}`);
            return false;
        },
    });

    const load = () => {
        console.log("project.project_irds", project.project_irds?.map((row) => ({
            ...row,
            receivedDate: row.receivedDate ? dayjs(row.receivedDate) : null,
            IRD: {selected: row?.IRD?.id, output: row?.IRD?.name},
        })));
        project && project.project_irds &&
        form.setFieldsValue({
            irdList: project.project_irds && Object.values(project.project_irds)?.map((row) => ({
                ...row,
                receivedDate: row.receivedDate ? dayjs(row.receivedDate) : null,
                IRD: {selected: row?.IRD?.id, output: row?.IRD?.name},
            }))
        });
    }
    const handleSave = () => {
        console.log("form DATA", form.getFieldValue("irdList").map(row => ({
                id: row?.id ?? null,
                project_id: project?.id ?? null,
                ird_id: row?.IRD?.selected ?? null,
                stageNumber: row?.stageNumber ? parseInt(row?.stageNumber) : null,
                applicationProject: row?.applicationProject ? parseInt(row?.applicationProject) : null,
                receivedDate: row?.receivedDate ? dayjs(row?.receivedDate).format("YYYY-MM-DD") : null,
            }))
        );
        mutateIrd({
            variables: {
                data: form.getFieldValue("irdList").map(row => ({
                    id: row?.id ?? null,
                    project_id: project?.id ?? null,
                    ird_id: row?.IRD?.selected ?? null,
                    stageNumber: row?.stageNumber ? parseInt(row?.stageNumber) : null,
                    applicationProject: row?.applicationProject ? parseInt(row?.applicationProject) : null,
                    receivedDate: row?.receivedDate ? dayjs(row?.receivedDate).format("YYYY-MM-DD") : null,
                }))
            }
        });
    }
    useEffect(() => {
        project.project_irds && load();
    }, [project]);

    const {loading: loadingIrds, error: errorIrds, data: dataIrds} =
        useQuery(IRDS_QUERY_COMPACT);


    return (
        <Form layout="vertical"
            //  onChange={() => {handleChange();}}
              form={form}>

            <Form.List name="irdList">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}, index) => (
                            <IrdItem
                                {...restField}
                                setIrdModalStatus={setIrdModalStatus}
                                key={key}
                                index={index}
                                irdData={dataIrds?.irds?.items}
                                removeItem={(value) => {
                                    remove(value);
                                }}
                                // handleChange();}}
                                //   onChange={handleChange}
                            />
                        ))}

                        <Space.Compact style={{width: '100%', marginBottom: 10, marginTop: 0}}>

                            <Button
                                type={"primary"}
                                size={"small"}
                                onClick={() => add()}
                                style={{width: '100%'}}
                                icon={<PlusOutlined/>}
                            >
                                Добавить ИРД к списку
                            </Button>
                            {/*<StyledButtonGreen*/}
                            {/*    type="dashed"*/}
                            {/*    style={{width: '100%'}}*/}

                            {/*    // size={"small"}*/}
                            {/*    onClick={() => setIrdModalStatus("add")}*/}
                            {/*    icon={<PlusOutlined/>}*/}
                            {/*>*/}
                            {/*    Создать ИРД*/}
                            {/*</StyledButtonGreen>*/}
                        </Space.Compact>

                    </>
                )}
            </Form.List>
            <Space style={{justifyContent: "center", width: "100%"}}>
                <StyledButtonGreen onClick={() => handleSave()}>Сохранить</StyledButtonGreen>
            </Space>
            <IrdModalForm
                onClose={() => setIrdModalStatus(null)}
                onCompleted={(value) => {
                    const newRow = [...form.getFieldValue("irdList")];
                    newRow[irdModalStatus?.key] = {IRD: {selected: value.id, output: value.name}};
                    form.setFieldValue("irdList",newRow);
                    setIrdModalStatus(null);
                }}
                mode={irdModalStatus?.mode}/>
        </Form>
    )
};

export default IrdToProjectForm;
