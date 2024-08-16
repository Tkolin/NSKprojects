import {useMutation} from '@apollo/client';
import {Button, DatePicker, notification, Popconfirm, Typography} from 'antd';
import {CONTRACT_PROJECT_DOWNLOAD, PROJECT_CONTRACT_GENERATED} from "../../../../graphql/mutationsProject";
import dayjs from "dayjs";
import {useState} from "react";
import {CustomDatePicker} from "../../FormattingDateElementComponent";

const {Text, Link} = Typography;

const ProjectFileDownload = ({projectId, children, ...props}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;
    const [selectedDateContract, setSelectedDateContract] = useState();

    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [downloadProjectContract, {loading: loading}] = useMutation(PROJECT_CONTRACT_GENERATED, {
        onCompleted: (data) => {
            //handleDownloadClick(data.projectOrderFileDownload.url);
            console.log(data.projectContractGenerated)
            openNotification('topRight', 'success', <Text>Договор сгенерирован! <Link> Нажмите для
                загрузки...</Link></Text>);
        },
        onError: (error) => {

            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.graphQLErrors?.flatMap(row => row?.extensions?.debugMessage));
        },
    });

    const handleDownload = () => {
        if (!selectedDateContract) {
            openNotification('topRight', 'error', 'Дата не указана');
            return;
        }
        console.log(selectedDateContract);
        downloadProjectContract({variables: {id: projectId, dateCreateContract: selectedDateContract}});
    };


    return (
        <Popconfirm
            placement="topLeft"
            title={"Уточните дату договора"}
            description={<CustomDatePicker
                placement={"Выберите дату..."}
                onChange={(value) => setSelectedDateContract(value && dayjs(value).format("YYYY-MM-DD"))}
            />}
            okText="Сгенерировать"
            okButtonProps={{disabled: !selectedDateContract}}
            onConfirm={handleDownload}
            cancelText="Отмена"
        >
            <Button loading={loading} {...props}>{children ?? 'скачать'}</Button>
        </Popconfirm>
    );
};

export default ProjectFileDownload;

