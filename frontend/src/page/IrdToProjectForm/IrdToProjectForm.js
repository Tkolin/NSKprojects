import {Button, Divider, Form, Space,} from "antd";
import {PlusOutlined,} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";

import {IRDS_QUERY_COMPACT} from "../../graphql/queriesCompact";
import IrdItem from "./components/IrdItem";
import dayjs from "dayjs";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import IrdModalForm from "../components/modal/IrdModalForm";
import {PROJECT_IRDS_SYNC_MUTATION} from "../../graphql/mutationsProject";

import {NotificationContext} from "../../NotificationProvider";

const IrdToProjectForm = ({project, onCompleted}) => {
    const {openNotification} = useContext(NotificationContext);

    // Первичные данные
    const [form] = Form.useForm();
    const [irdModalStatus, setIrdModalStatus] = useState(null);

    const [mutateIrd, {loading: loading}] = useMutation(PROJECT_IRDS_SYNC_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            onCompleted && onCompleted();
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении создания ирд : ${error.message}`);
            return false;
        },
    });

    const load = () => {
        console.log("project.project_irds", project.project_irds?.map((row) => ({
            ...row,
            received_date: row.received_date ? dayjs(row.received_date) : null,
            ird: {selected: row?.ird?.id, output: row?.ird?.name},
        })));
        project && project.project_irds &&
        form.setFieldsValue({
            irdList: project.project_irds && Object.values(project.project_irds)?.map((row) => ({
                ...row,
                received_date: row.received_date ? dayjs(row.received_date) : null,
                ird: {selected: row?.ird?.id, output: row?.ird?.name},
            }))
        });
    }
    const handleSave = () => {
        console.log("form DATA", form.getFieldValue("irdList").map(row => ({
                project_id: project?.id ?? null,
                ird_id: row?.ird?.selected ?? null,
            stage_number: row?.stageNumber ? parseInt(row?.stage_number) : null,
            application_project: row?.application_project ? parseInt(row?.application_project) : null,
            received_date: row?.received_date ? dayjs(row?.received_date).format("YYYY-MM-DD") : null,
            }))
        );
        mutateIrd({
            variables: {
                data: form.getFieldValue("irdList").map(row => ({
                    project_id: project?.id ?? null,
                    ird_id: row?.ird?.selected ?? null,
                    stage_number: row?.stage_number ? parseInt(row?.stage_number) : null,
                    application_project: row?.application_project ? parseInt(row?.application_project) : null,
                    received_date: row?.received_date ? dayjs(row?.received_date).format("YYYY-MM-DD") : null,
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
                <StyledButtonGreen  loading={loading} onClick={() => handleSave()}>Сохранить</StyledButtonGreen>
            </Space>
            <IrdModalForm
                onClose={() => setIrdModalStatus(null)}
                onCompleted={(value) => {
                    const newRow = [...form.getFieldValue("irdList")];
                    newRow[irdModalStatus?.key] = {ird: {selected: value.id, output: value.name}};
                    form.setFieldValue("irdList",newRow);
                    setIrdModalStatus(null);
                }}
                mode={irdModalStatus?.mode}/>
        </Form>
    )
};

export default IrdToProjectForm;
