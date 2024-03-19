import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { CONTRACT_PERSON_MUTATION } from '../../graphql/mutationsPerson';
import {Button, notification} from 'antd';
import {DownloadOutlined} from "@ant-design/icons";
import {IRDS_PROJECT_DOWNLOAD} from "../../graphql/mutationsProject";

const IrdsProjectFileDownload = ({projectId}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadProjectIrds] = useMutation(IRDS_PROJECT_DOWNLOAD, {
        onCompleted: (data) => {
            handleDownloadClick(data.projectIrdsFileDownload.url);
            openNotification('topRight', 'success', 'Договор сгенерирован!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при генерации договора: ' + error.message);
        },
    });

    const handleDownload = () => {
        console.log(projectId);
        downloadProjectIrds({ variables: { id: projectId } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);

            link.href = `${LaravelURL}download-projectIrds/${downloadedFileUrl}`;
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

export default IrdsProjectFileDownload;

