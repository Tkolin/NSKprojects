import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import {notification, Typography} from 'antd';
import {ACT_RENDERING_PROJECT_DOWNLOAD} from "../../../../graphql/mutationsProject";
const {Text, Link} = Typography;

const ActRenderingProjectDownload = ({projectId, stageNumber, text}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadProjectActRendering] = useMutation(ACT_RENDERING_PROJECT_DOWNLOAD, {
        onCompleted: (data) => {
            console.log("data" + data);
            handleDownloadClick(data.projectActRenderingFileDownload.url);
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
        },
    });

    const handleDownload = () => {
        console.log(projectId);
        downloadProjectActRendering({ variables: { id: projectId, stageNumber: stageNumber } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);

            link.href = `${LaravelURL}download-projectActRender/${downloadedFileUrl}`;
            link.download = '${downloadedFileUrl}';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return (
        <Link  strong style={{color: "green"}} onClick={handleDownload}>{text ?? 'скачать'}</Link>
    );
};

export default ActRenderingProjectDownload;

