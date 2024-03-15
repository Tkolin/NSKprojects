import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { CONTRACT_PERSON_MUTATION } from '../../graphql/mutationsPerson';
import {Button, notification} from 'antd';
import {DownloadOutlined} from "@ant-design/icons";
import {CONTRACT_PROJECT_DOWNLOAD} from "../../graphql/mutationsProject";

const ProjectFileDownload  = ({projectId}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadProjectContract] = useMutation(CONTRACT_PROJECT_DOWNLOAD, {
        onCompleted: (data) => {
            handleDownloadClick(data.projectOrderFileDownload.url);
            openNotification('topRight', 'success', 'Договор сгенерирован!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при генерации договора: ' + error.message);
        },
    });

    const handleDownload = () => {
        console.log(projectId);
        downloadProjectContract({ variables: { id: projectId } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);
            link.href = `${LaravelURL}download-project/${downloadedFileUrl}`;
            link.download = 'contract.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return (
            <Button onClick={handleDownload}  icon={<DownloadOutlined />}/>
    );
};

export default ProjectFileDownload;

