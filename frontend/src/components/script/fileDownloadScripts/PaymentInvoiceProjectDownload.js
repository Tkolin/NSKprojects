import 'react-phone-number-input/style.css';
import { useMutation } from '@apollo/client';
import { notification, Typography} from 'antd';
import { PAYMENT_INVOICE_PROJECT_DOWNLOAD} from "../../../graphql/mutationsProject";
const {Text, Link} = Typography;

const PaymentInvoiceProjectDownload = ({projectId, stageNumber, isPrepayment, text}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadProjectPaymentInvoice] = useMutation(PAYMENT_INVOICE_PROJECT_DOWNLOAD, {
        onCompleted: (data) => {
            handleDownloadClick(data.projectPaymentInvoiceFileDownload.url);
            openNotification('topRight', 'success', 'Загрузка начата!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message);
        },
    });

    const handleDownload = () => {
        console.log(projectId);
        if(isPrepayment)
            downloadProjectPaymentInvoice({ variables: { id: projectId, isPrepayment: true } });
        else
            downloadProjectPaymentInvoice({ variables: { id: projectId, stageNumber: stageNumber } });
    };

    const handleDownloadClick = async (downloadedFileUrl) => {
        try {
            const link = document.createElement('a');
            console.log(link);

            link.href = `${LaravelURL}download-projectPaymentInvoice/${downloadedFileUrl}`;
            link.download = '${downloadedFileUrl}';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
    };

    return (
            <Link strong style={{color: "green"}} onClick={handleDownload}>{text ?? 'скачать' }</Link>
    );
};

export default PaymentInvoiceProjectDownload;

