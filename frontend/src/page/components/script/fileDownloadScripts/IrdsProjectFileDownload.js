import { useMutation } from '@apollo/client';
import {notification, Typography} from 'antd';
import {IRDS_PROJECT_DOWNLOAD} from "../../../../graphql/mutationsProject";
const {Text, Link} = Typography;

const IrdsProjectFileDownload = ({projectId,style, text, type}) => {
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
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
        },
    });

    const handleDownload = () => {
         downloadProjectIrds({ variables: { id: projectId } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');

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
        <Link style={style} type={type ?? null}  onClick={handleDownload}>{text ?? 'скачать'}</Link>
    );
};

export default IrdsProjectFileDownload;

