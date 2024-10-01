import { useMutation } from '@apollo/client';
import { notification, Popconfirm, Typography } from 'antd';
import dayjs from "dayjs";
import { cloneElement, useState } from "react";
import { EXECUTOR_ORDER_GENERATED } from '../../../../graphql/mutationsFileGenerated';
import { CustomDatePicker } from "../../FormattingDateElementComponent";

const {Text, Link} = Typography;

const ExecutorOrderFileGenerated = ({projecTaskIds, children, onCompleted, ...props}) => {
    const LaravelURL = process.env.REACT_APP_API_URL;
    const [selectedDateContract, setSelectedDateContract] = useState();

    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [generatedOrder, {loading}] = useMutation(EXECUTOR_ORDER_GENERATED, {
        onCompleted: (data) => {
            onCompleted && onCompleted(data)
            openNotification('topRight', 'success', `Данные обновлены`);
            },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.message + "/" + error.graphQLErrors?.flatMap(row => row?.extensions?.debugMessage));
        }
    });

    // const handleDownload = () => {
    //     console.log(personId);
    //     downloadContract({ variables: { id: personId, tasksId: tasksId } });
    // };

 
    const handleDownload = () => {
        if (!selectedDateContract) {
            openNotification('topRight', 'error', 'Дата не указана');
            return;
        }
        console.log(projecTaskIds); 
        
        generatedOrder({variables: { projecTaskIds: projecTaskIds, dateGenerated: selectedDateContract } });
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
            <div>
                {children && cloneElement(children, {...props, loading})}
            </div>
        </Popconfirm>
    );
};

export default ExecutorOrderFileGenerated;

