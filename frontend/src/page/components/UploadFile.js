import React, {cloneElement, useEffect, useRef, useState} from 'react';
import {Upload, Button, message, DatePicker, Popconfirm, Space, Alert} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useMutation} from '@apollo/client';
import {gql} from '@apollo/client';
import dayjs from "dayjs";
import {useClickAway} from 'react-use';
import {CustomDatePicker} from "./FormattingDateElementComponent";

const UPLOAD_FILE_LINK_MUTATION = gql`
    mutation uploadFileLink($url: String!) {
        uploadFileLink(url: $url) {
            success
            file {
                id
                name
                path
                size
                mime_type
            }
        }
    }
`;
export const UploadFileExecutorOrder = ({onUpdated, orderId, ...props}) => {
    return <UploadFile
        action={'project/upload/executor_order/' + orderId}
        accept={'.pdf'}
        onUpdated={onUpdated}
        children={<Button style={{width: 200}} icon={<UploadOutlined/>}>Прикрепить договор</Button>}
    />
}


export const UploadFilePopconfirm = ({onUpdated, action, options, children, ...props}) => {
    const [selectedDateContract, setSelectedDateContract] = useState();
    const [open, setOpen] = useState(false);
    const [openDp, setOpenDp] = useState(false);
    useEffect(() => {
        console.log("openDp", openDp)
    }, [openDp]);
    const popconfirmRef = useRef(null); // Ссылка на Popconfirm

    // Закрытие Popconfirm при клике вне его
    useClickAway(popconfirmRef, () => !openDp && setOpen(false));

    if (!action)
        return <Alert showIcon type={"error"} message={"Эндпоинт не указан"}/>

    return (
        <Popconfirm
            style={{width: "200px"}}
            placement="topLeft"

            open={open}
            onCancel={() => setOpen(false)}
            description={
                <Space direction={"vertical"} ref={popconfirmRef} style={{width: "200px"}}>
                    {options?.datePicker && (
                        <CustomDatePicker
                            onClick={() => setOpenDp(true)}
                            size={"small"}
                            placement={"Выберите дату..."}
                            style={{width: "200px", marginTop: 15}}
                            onCancel={() => setOpenDp(false)}
                            onChange={(value) => {
                                setOpenDp(false);
                                setSelectedDateContract(value && dayjs(value).format("YYYY-MM-DD"))
                            }}
                        />
                    )}
                    <UploadFile

                        style={{width: "200px", marginTop: 7, backgroundColor: "red"}}
                        action={action + (options?.datePicker && ('&date=' + selectedDateContract))}
                        accept={'.pdf'}
                        disabled={options?.datePicker && (!selectedDateContract)}
                        onConfirm={() => {
                            setOpen(false);
                            onUpdated && onUpdated();
                            options?.datePicker && setSelectedDateContract(null);
                        }}
                    >
                        <Button
                            type={"dashed"}
                            onClick={() => setOpen(true)}
                            block
                            disabled={!selectedDateContract}
                            style={{width: "200px", marginTop: 15}}
                        >
                            Отправить файл
                        </Button>
                    </UploadFile>
                </Space>
            }
            okButtonProps={{style: {display: "none"}}}
            showCancel={false}
            children={children ? cloneElement(children, {onClick: () => setOpen(true)}) :
                <Button children={"Прикрепить файл"}/>}
            {...props}
        />
    );
}

const UploadFile = ({
                        onConfirm, action, accept, children, width,
                        ...props
                    }
    ) => {
        const [uploadFileLink] = useMutation(UPLOAD_FILE_LINK_MUTATION);

        useEffect(() => {
            console.log("Уставновлен эндпоинт для отправки файлов: ", action);
        }, [action]);
        const propsUpload = {
            name: 'file',
            maxCount: 1,
            accept: accept,
            action: process.env.REACT_APP_API_URL + action,
            headers: {
                authorization: 'authorization-text',
            },
            // customRequest: async ({file, onSuccess, onError}) => {
            //     const formData = new FormData();
            //     formData.append('file', file);
            //
            //     const csrfToken = localStorage.getItem('csrf_token');
            //     console.log("file csrfToken: ", csrfToken);
            //
            //     try {
            //         const response = await axios.post(process.env.REACT_APP_API_URL + action, formData, {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data',
            //                 'X-CSRF-TOKEN': csrfToken, // Добавляем CSRF-токен
            //             },
            //         });
            //
            //         if (response.data.success) {
            //             onSuccess(response.data.file, file);
            //
            //             // Отправляем ссылку на файл в GraphQL
            //             await uploadFileLink({
            //                 variables: {
            //                     url: response.data.file.path,
            //                 },
            //             });
            //
            //             message.success(`${file.name} file uploaded successfully`);
            //         } else {
            //             onError(new Error('Upload failed'));
            //             message.error(`${file.name} file upload failed.`);
            //         }
            //     } catch (err) {
            //         onError(err);
            //         message.error(`${file.name} file upload failed.`);
            //     }
            // },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);

                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                    onConfirm && onConfirm();
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <Upload block children={children} {...propsUpload} {...props} ellipsis={true}/>

        );
    }
;

