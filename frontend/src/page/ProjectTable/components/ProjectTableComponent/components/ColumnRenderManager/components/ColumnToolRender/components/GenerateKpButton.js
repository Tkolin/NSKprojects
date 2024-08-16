import React, {useContext, useState} from "react";
import {NotificationContext} from "../../../../../../../../../NotificationProvider";
import {useMutation, useQuery} from "@apollo/client";
import {GENERATED_COMMERCIAL_OFFER_MESSAGE} from "../../../../../../../../../graphql/mutationsProject";
import {CONTACTS_BY_ORGANIZATION} from "../../../../../../../../../graphql/queriesSpecial";
import {Button, Modal, Popconfirm, Select, Space} from "antd";
import {CustomDatePicker} from "../../../../../../../../components/FormattingDateElementComponent";
import dayjs from "dayjs";
import {StyledButtonGreen} from "../../../../../../../../components/style/ButtonStyles";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import ContactForm from "../../../../../../../../simplesForms/ContactForm";

const GenerateKpButton = ({project, delegationId, onUpdated, dateOffer, ...props}) => {
    const {openNotification} = useContext(NotificationContext);

    const [generateKpMutate, {loading: generateKpLoading}] = useMutation(GENERATED_COMMERCIAL_OFFER_MESSAGE, {
        onCompleted: () => {
            openNotification('topRight', 'success', `Коммерческое предложение сгенерировано`);
            onUpdated();
        },
        onError: (error) => openNotification('topRight', 'error', `Ошибка при генерации коммерческое предложения: ${error.message}`)
    });
    const {
        loading: loadingContacts,
        data: dataContacts
    } = useQuery(CONTACTS_BY_ORGANIZATION, {variables: {organizationId: project?.organization_customer?.id}});

    const [selectedDelegations, setSelectedDelegations] = useState();
    const [selectedDateContract, setSelectedDateContract] = useState();
    const [contactModalStatus, setContactModalStatus] = useState();
    const handleGeneratedKp = (projectId, delegationId, dateOffer) => {
        generateKpMutate({variables: {projectId: projectId, delegationId: delegationId, dateOffer: dateOffer}})
    }
    return (
        <Popconfirm
            placement="topLeft"
            title={"Уточните дату подписания" + selectedDateContract}
            description={
                <Space direction={"vertical"}>
                    <CustomDatePicker
                        placement={"Выберите дату..."}
                        onChange={(value) => setSelectedDateContract(value && dayjs(value).format("YYYY-MM-DD"))}
                    />
                    <Space.Compact style={{width: "100%"}}>

                        <Select placeholder={"Форма"} style={{width: "100%"}}
                                onChange={(value, option) => setSelectedDelegations(value)}
                                value={selectedDelegations}
                                loading={loadingContacts}>
                            {dataContacts?.contacts?.items?.map(row => (
                                <Select.Option key={row.id}
                                               value={row.id}>{row.last_name} {row.first_name} {row.patronymic}</Select.Option>))}
                        </Select>
                        <StyledButtonGreen icon={<PlusOutlined/>} onClick={() => setContactModalStatus("add")}/>
                    </Space.Compact>
                </Space>
            }
            okText="Продолжить"

            okButtonProps={{
                loading: generateKpLoading,
                disabled: (props.disabled && selectedDateContract),
                onClick: () => handleGeneratedKp(project.id, selectedDelegations, selectedDateContract)
            }}
            cancelText="Отмена"
        >
            <Button icon={<UploadOutlined/>} {...props}/>
            <Modal
                key={contactModalStatus}
                open={contactModalStatus}
                onCancel={() => setContactModalStatus(null)}
                footer={null}
                width={"max-content"}
                children={
                    <ContactForm
                        cardProps={{title: "Контакт"}}
                        onCompleted={(value) => {
                            setContactModalStatus(null);
                        }}
                        initialObject={contactModalStatus === "edit" ? selectedDelegations : null}
                    />
                }

            />
        </Popconfirm>
    )
}