import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { CONTRACT_PERSON_MUTATION } from '../../graphql/mutationsPerson';
import {Button, notification} from 'antd';
import {DownloadOutlined} from "@ant-design/icons";
import {ACT_RENDERING_PROJECT_DOWNLOAD, IRDS_PROJECT_DOWNLOAD} from "../../graphql/mutationsProject";

const ActRenderingProjectDownload = ({projectId, stageNumber}) => {
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
            link.download = 'contractIrds.docx';

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

export default ActRenderingProjectDownload;

