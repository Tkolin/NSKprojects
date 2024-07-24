import React, {useEffect, useState} from 'react';
import {Upload, Button, message, DatePicker, Popconfirm} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import axios from 'axios';
import {useMutation} from '@apollo/client';
import {gql} from '@apollo/client';
import dayjs from "dayjs";

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
export const UploadFileProjectContractSigned = ({onUpdated, projectId, ...props}) => {
    const [selectedDateContract, setSelectedDateContract] = useState();
    return (<Popconfirm
        placement="topLeft"
        title={"Уточните дату подписания"}
        description={<DatePicker
            placement={"Выберите дату..."}
            onChange={(value) => setSelectedDateContract(value && dayjs(value).format("YYYY-MM-DD"))}
        />}
        okText="Продолжить"
        okButtonProps={{disabled: !selectedDateContract}}
        cancelText="Отмена"
    >
        {selectedDateContract ? (<UploadFile
                action={'project/upload/project_contract/page?projectId=' + projectId + '&date=' + selectedDateContract}
                accept={'.pdf'}
                onUpdated={() => {onUpdated && onUpdated();
                setSelectedDateContract(null)}}
                children={<Button  style={{width: 200}} icon={<UploadOutlined/>} {...props}>{props.children ?? "Прикрепить договор"}</Button>}
            />) :
            (<Button type={"dashed"} style={{width: 200}} icon={<UploadOutlined/>} {...props}>{props.children ?? "Прикрепить договор"}</Button>)}
    </Popconfirm>)
}
const UploadFile = ({onUpdated, action, accept, children,width, ...props}) => {
    const [uploadFileLink] = useMutation(UPLOAD_FILE_LINK_MUTATION);
    useEffect(() => {
        console.log(action);
    }, [action]);
    const propsUpload = {
        name: 'file',
        maxCount: 1,
        accept: accept,
        action: process.env.REACT_APP_API_URL + action,
        headers: {
            authorization: 'authorization-text',
        },
        customRequest: async ({file, onSuccess, onError}) => {
            const formData = new FormData();
            formData.append('file', file);

            const csrfToken = localStorage.getItem('csrf_token');
            console.log("file csrfToken: ", csrfToken);
            try {
                const response = await axios.post(process.env.REACT_APP_API_URL + action, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRF-TOKEN': csrfToken, // Добавляем CSRF-токен
                    },
                });

                if (response.data.success) {
                    onSuccess(response.data.file, file);

                    // Отправляем ссылку на файл в GraphQL
                    await uploadFileLink({
                        variables: {
                            url: response.data.file.path,
                        },
                    });

                    message.success(`${file.name} file uploaded successfully`);
                } else {
                    onError(new Error('Upload failed'));
                    message.error(`${file.name} file upload failed.`);
                }
            } catch (err) {
                onError(err);
                message.error(`${file.name} file upload failed.`);
            }
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                onUpdated && onUpdated();
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div style={{width: width-1}}>
            <Upload {...propsUpload} {...props} ellipsis={true} style={{width: width}}>
                {children}
            </Upload>
        </div>

    );
};

