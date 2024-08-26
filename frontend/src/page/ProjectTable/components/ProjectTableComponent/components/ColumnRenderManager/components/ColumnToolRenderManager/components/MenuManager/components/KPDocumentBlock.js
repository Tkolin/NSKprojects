import {Button, Divider, Modal, Popconfirm, Select, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {GENERATED_COMMERCIAL_OFFER_MESSAGE} from "../../../../../../../../../../../graphql/mutationsProject";

import {DownloadOutlined, PlusOutlined, UploadOutlined,} from "@ant-design/icons";

import {StyledButtonGreen} from "../../../../../../../../../../components/style/ButtonStyles";

import dayjs from "dayjs";

import ContactForm from "../../../../../../../../../../simplesForms/ContactForm";
import {CONTACTS_BY_ORGANIZATION} from "../../../../../../../../../../../graphql/queriesSpecial";
import LinkToDownload from "../../../../../../../../../../components/script/LinkToDownload";
import CustomMenuButton from "./CustomMenuButton";
import {CustomDatePicker} from "../../../../../../../../../../components/FormattingDateElementComponent";
import {nanoid} from "nanoid";
import {UploadFilePopconfirm} from "../../../../../../../../../../components/UploadFile";


const KPDocumentBlock = ({project, onUpdated}) => {
    const {
        loading: loadingContacts, data: dataContacts
    } = useQuery(CONTACTS_BY_ORGANIZATION, {variables: {organizationId: project?.organization_customer?.id}});
    useEffect(() => {
        console.log("KPDocumentBlock", project);
    }, [project,]);
    const [generateKpMutate, {loading: generateKpLoading}] = useMutation(GENERATED_COMMERCIAL_OFFER_MESSAGE, {
        onCompleted: () => {
            //openNotification('topRight', 'success', `Коммерческое предложение сгенерировано`);
            onUpdated();
        }, onError: (error) => console.log(error.message)

    });

    const [selectedDelegations, setSelectedDelegations] = useState();
    const [selectedDateContract, setSelectedDateContract] = useState();
    const [contactModalStatus, setContactModalStatus] = useState();
    const handleGeneratedKp = () => {
        generateKpMutate({
            variables: {
                projectId: project.id,
                delegationId: selectedDelegations,
                dateOffer: selectedDateContract
            }
        })
    }

    return (
        <>
            {project?.kp_file_id ?
                (<>
                    <Divider style={{margin: "5px"}} orientation={"left"}>КП проекта</Divider>
                    <LinkToDownload fileId={project.kp_file_id}><CustomMenuButton icon={<DownloadOutlined/>}>
                        Скачать (согласован)
                    </CustomMenuButton>
                    </LinkToDownload>
                </>)
                :

                <>
                    <Divider style={{margin: "5px"}} orientation={"left"}>Формирование КП</Divider>

                    <Popconfirm
                        style={
                            {
                                width: "200px"
                            }
                        }
                        placement="topLeft"
                        description={
                            <Space direction={"vertical"} style={{width: "200px"}}>
                                <CustomDatePicker
                                    size={"small"}
                                    placement={"Выберите дату..."}
                                    style={{width: "200px", marginTop: 15}}
                                    onChange={(value) => {
                                        setSelectedDateContract(value && dayjs(value).format("YYYY-MM-DD"))
                                    }}
                                />
                                <Space.Compact style={{width: "100%"}}>

                                    <Select placeholder={"Кому обращение"} style={{width: "100%"}}
                                            onChange={(value, option) => setSelectedDelegations(value)}
                                            value={selectedDelegations}
                                            loading={loadingContacts}>
                                        {dataContacts?.contacts?.items?.map(row => (<Select.Option key={row.id}
                                                                                                   value={row.id}>{row.last_name} {row.first_name} {row.patronymic}</Select.Option>))}
                                    </Select>
                                    <StyledButtonGreen icon={<PlusOutlined/>}
                                                       onClick={() => setContactModalStatus("add")}/>
                                </Space.Compact>

                                <Button
                                    block
                                    disabled={!selectedDateContract}
                                    onClick={() => handleGeneratedKp()}
                                    style={{width: "200px", marginTop: 15}}
                                >
                                    Сгенерировать файл
                                </Button>
                            </Space>
                        }
                        okButtonProps={
                            {
                                style: {
                                    display: "none"
                                }
                            }
                        }
                        showCancel={false}
                        children={
                            <CustomMenuButton>Сгенерировать КП</CustomMenuButton>
                        }
                    />
                    <LinkToDownload disabled={project?.project_kp_history?.length <= 0}
                                    fileId={project?.project_kp_history?.length > 0 && project?.project_kp_history[project?.project_kp_history?.length - 1].file_id}>
                        <CustomMenuButton icon={<DownloadOutlined/>}
                                          disabled={project?.project_kp_history?.length <= 0}>
                            Скачать последнее КП
                        </CustomMenuButton>
                    </LinkToDownload>
                    <UploadFilePopconfirm
                        options={{datePicker: true}}
                        title={"Укажите дату принятия"}
                        onUpdated={() => onUpdated()}
                        action={"project/upload/project_kp/page?projectId=" + project.id}
                        children={<CustomMenuButton className={'danger_text_btn'}
                                                    icon={<UploadOutlined/>}
                                                    children={"Прикрепить КП"}/>}
                    />

                    <Modal
                        key={nanoid()}
                        open={contactModalStatus}
                        onCancel={() => setContactModalStatus(null)}
                        footer={null}
                        width={"max-content"}
                        title={"Контакт"}
                        styles={{header: {textAlign: "center"}}}
                    >

                        <ContactForm onCompleted={() => {
                            setContactModalStatus(null);
                        }}/>

                    </Modal>
                </>}
        </>
    )
        ;
}

export default KPDocumentBlock;