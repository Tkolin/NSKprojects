import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { notification, Typography} from 'antd';
import {STAGE_PROJECT_DOWNLOAD} from "../../graphql/mutationsProject";
const {Text, Link} = Typography;

const StagesProjectFileDownload = ({projectId, text}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadProjectStage] = useMutation(STAGE_PROJECT_DOWNLOAD, {
        onCompleted: (data) => {
            handleDownloadClick(data.projectStagesFileDownload.url);
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
        },
    });

    const handleDownload = () => {
        console.log(projectId);
        downloadProjectStage({ variables: { id: projectId } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);

            link.href = `${LaravelURL}download-projectStages/${downloadedFileUrl}`;
            link.download = 'График работ.docx';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return (
        <Link onClick={handleDownload}>{text ?? 'скачать'}</Link>
    );
};

export default StagesProjectFileDownload;

