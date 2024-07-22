import {Button, notification, Typography} from "antd";
import {useMutation} from "@apollo/client";
 import {DOWNLOAD_FILE} from "../../../../graphql/mutationsFile";

const {Link} = Typography;

const LinkToDownload = ({children, fileId, ...props}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };
    const [downloadFile, {loading: loading}] = useMutation(DOWNLOAD_FILE, {
        onCompleted: (data) => {
            console.log(data.downloadFile.url);
            handleDownloadClick(data.downloadFile.url);
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
        },
    });
    const handleDownload = () => {
        console.log(fileId);
         downloadFile({ variables: { id: fileId } });
    };


    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);
            link.href = `${LaravelURL}${downloadedFileUrl}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return <Button loading={loading}    onClick={()=>handleDownload()} {...props}>{children}</Button>
}
export default LinkToDownload;