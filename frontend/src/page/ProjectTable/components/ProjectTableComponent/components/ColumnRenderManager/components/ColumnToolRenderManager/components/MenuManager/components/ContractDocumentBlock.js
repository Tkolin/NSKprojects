import {Col, Divider, Row, Tooltip} from "antd";
import {DownloadOutlined, FilePdfOutlined, FileWordOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import React from "react";
import LinkToDownload from "../../../../../../../../../../components/script/LinkToDownload";
import {UploadFilePopconfirm} from "../../../../../../../../../../components/UploadFile";
import ProjectFileDownload
    from "../../../../../../../../../../components/script/fileDownloadScripts/ProjectFileDownload";
import CustomMenuButton from "./CustomMenuButton";

const customLinkProps = {type: "text", style: {width: "100%"}, size: "large"}

const ContractDocumentBlock = ({record, onUpdated}) => {

    const getFileId = (arrayFile, isStamp = false) => {
        const maxNumberRecord = arrayFile.filter(row => row.type === (isStamp ? "CONTRACT_STAMP" : "CONTRACT")).reduce((max, current) => {
            return (current.number > (max?.number || 0)) ? current : max;
        }, null);
        return maxNumberRecord?.file_id ?? null;
    }
    const contractFileId = getFileId(record?.project_contract_history, false);
    const stampContractFileId = getFileId(record?.project_contract_history, true);
    return (record?.contract_file_id ? (<>
        <Divider style={{margin: 0, fontSize: 16}} orientation="left" plain></Divider>
        <LinkToDownload fileId={record.contract_file_id}><CustomMenuButton icon={<DownloadOutlined/>}>
            Скачать (подписан) от {record.date_signing}
        </CustomMenuButton>
        </LinkToDownload>
    </>) : (<>
        <Divider style={{margin: 0, fontSize: 16}} orientation="left" plain></Divider>
        <ProjectFileDownload projectId={record.id} icon={<PlusOutlined/>}
                             children={<CustomMenuButton children={"Сгенерировать договор"}/>}/>

        {(contractFileId || stampContractFileId) && (<>
            <UploadFilePopconfirm
                options={{datePicker: true}}
                title={"Укажите дату подписания"}
                onUpdated={() => onUpdated()}
                action={"project/upload/project_contract/page?projectId=" + record.id}
                children={<CustomMenuButton className={'danger_text_btn'}
                                            icon={<UploadOutlined/>}
                                            children={"Прикрепить договор"}/>}
            />
            <Row direction={"horizontal"} style={{width: "100%"}}>
                <Col span={12}>
                    <Tooltip title={"DOCX пример"}>
                        <LinkToDownload
                            disabled={!contractFileId}
                            fileId={contractFileId}
                            children={
                                <CustomMenuButton

                                    disabled={!stampContractFileId}
                                    icon={<FileWordOutlined style={{color: "#1677ff"}}/>}
                                    children={<>.docx<DownloadOutlined/></>}
                                />
                            }/>
                    </Tooltip>

                </Col>
                <Col span={12}>
                    <Tooltip title={"PDF с печатями"}>
                        <LinkToDownload
                            disabled={!stampContractFileId}
                            fileId={stampContractFileId}
                            children={
                                <CustomMenuButton
                                    disabled={!stampContractFileId}
                                    icon={<FilePdfOutlined style={{color: "#d9363e"}}/>}
                                    children={<>.pdf<DownloadOutlined/></>}
                                />
                            }/>
                    </Tooltip>
                </Col>

            </Row>
        </>)}

    </>))
}
export default ContractDocumentBlock