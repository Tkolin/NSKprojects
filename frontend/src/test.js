import 'react-phone-number-input/style.css';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CONTRACT_PERSON_MUTATION } from './graphql/mutationsPerson';
import { notification } from 'antd';
import axios from 'axios';

const Example = () => {
    const [downloadedFileUrl, setDownloadedFileUrl] = useState('');

    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadContract] = useMutation(CONTRACT_PERSON_MUTATION, {
        onCompleted: (data) => {
            setDownloadedFileUrl(data.personOrderFileDownload.url);
            openNotification('topRight', 'success', 'Договор сгенерирован!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при генерации договора: ' + error.message);
        },
    });

    const handleDownload = () => {
        downloadContract({ variables: { id: 1 } });
    };

    const handleDownloadClick = async () => {
        try {
            //TODO: Работает только при первой загрузке и с адреса 8000
            const response = await axios.get(`/download-contract/${downloadedFileUrl}`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            window.open(url); // Open the URL in a new tab
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return (
        <div>
            <h1>Example</h1>
            <button onClick={handleDownload}>Скачать договор</button>
            <button onClick={handleDownloadClick} disabled={!downloadedFileUrl}>
                Скачать сгенерированный договор
            </button>
        </div>
    );
};

export default Example;
