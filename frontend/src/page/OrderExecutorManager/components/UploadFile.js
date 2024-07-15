import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {Cookies} from "react-cookie";

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

const UploadFile = ({onUpdated ,orderId}) => {
    const [uploadFileLink] = useMutation(UPLOAD_FILE_LINK_MUTATION);

    const props = {
        name: 'file',
        maxCount: 1,
        accept: '.pdf',
        action: process.env.REACT_APP_API_URL+'project/upload/executor_order/'+orderId,
        headers: {
            authorization: 'authorization-text',
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            const formData = new FormData();
            formData.append('file', file);

            const csrfToken = localStorage.getItem('csrf_token');
            console.log("file csrfToken: ", csrfToken);
            try {
                const response = await axios.post(process.env.REACT_APP_API_URL+'project/upload/executor_order/'+orderId, formData, {
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
        <Upload {...props} style={{ width: 300 }}>
            <Button icon={<UploadOutlined />}>Прикрепить договор</Button>
        </Upload>
    );
};

export default UploadFile;
