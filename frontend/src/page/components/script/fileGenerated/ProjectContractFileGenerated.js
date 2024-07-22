import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { notification, Typography} from 'antd';
import {CONTRACT_PROJECT_DOWNLOAD} from "../../../../graphql/mutationsProject";
const {Text, Link} = Typography;

const ProjectContractFileGenerated  = ({projectId, style, text}) => {
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
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
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
        <Link type={"success"} onClick={handleDownload}>{text ?? 'скачать'}</Link>
    );
};

export default ProjectContractFileGenerated;

