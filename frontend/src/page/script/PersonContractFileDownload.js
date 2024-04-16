import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { CONTRACT_PERSON_MUTATION } from '../../graphql/mutationsPerson';
import {Button, notification} from 'antd';
import {DownloadOutlined} from "@ant-design/icons";

const PersonContractFileDownload = ({personId, text}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadContract] = useMutation(CONTRACT_PERSON_MUTATION, {
        onCompleted: (data) => {
            handleDownloadClick(data.personOrderFileDownload.url);
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
        },
    });

    const handleDownload = () => {
        console.log(personId);
        downloadContract({ variables: { id: personId } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);
            link.href = `${LaravelURL}download-contract/${downloadedFileUrl}`;
            link.download = 'contract.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return (
        <a onClick={handleDownload}>{text ?? 'скачать'}</a>
    );
};

export default PersonContractFileDownload;

