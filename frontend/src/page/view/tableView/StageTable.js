import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Divider, Form, Modal, notification, Space, Table} from 'antd';
import {STAGES_QUERY} from '../../../graphql/queries';
import {DELETE_STAGE_MUTATION} from '../../../graphql/mutationsStage';
import StageForm from "../../form/simpleForm/StageForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../../style/FormStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import Title from "antd/es/typography/Title";

const StageTable = () => {

    // Состояния
    const [selectedStage, setSelectedStage] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formSearch] = Form.useForm();
    const [addModalVisible, setAddModalVisible] = useState(false);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const { loading, error, data } = useQuery(STAGES_QUERY, {
        variables: {
            queryOptions: {
            page,
            limit,
            search,
            sortField,
            sortOrder}
        },
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Мутация для удаления
    const [deleteStage] = useMutation(DELETE_STAGE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            window.location.reload();

        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();

        },
        update: (cache, { data: { deleteStage } }) => {
            const { stages } = cache.readQuery({ query: STAGES_QUERY });
            const updatedStages = stages.filter(stage => stage.id !== deleteStage.id);
            cache.writeQuery({
                query: STAGES_QUERY,
                data: { stages: updatedStages },
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {setEditModalVisible(false);};
    const handleEdit = (stageId) => {
        const stage = data.stagesTable.stages.find(stage => stage.id === stageId);
        setSelectedStage(stage);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (stageId) => {
        deleteStage({ variables: { id: stageId}});
    };
    const onSearch = (value) =>{
        setSearch(value);
    };
    // Обработка загрузки и ошибок
    if(!data)
        if (loading) return <LoadingSpinnerStyles/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Управление',
            key: 'edit',
            render: (text, record) => (
                <div>
                    <Button  onClick={() => handleEdit(record.id)}>Изменить</Button>
                    <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
                </div>

            ),
        },
    ];
    const onChange = (pagination, filters, sorter) => {

        if((sorter.field !== undefined) && currentSort !== sorter){
            setCurrentSort(sorter);
            if (sortField !== sorter.field) {
                setSortField(sorter.field);
                setSortOrder("asc");
            }
            else {
                setSortField(sortField);
                switch (sortOrder){
                    case ("asc"):
                        setSortOrder("desc");
                        break;
                    case ("desc"):
                        setSortOrder("");
                        break;
                    case (""):
                        setSortOrder("asc");
                        break;
                }
            }
        }else
            console.log("Фильтры сохранены");
    };
    return (
        <div>
            <StyledFormLarge form={formSearch} layout="horizontal">
                <Divider style={{marginTop: 0}} >
                    <Title style={{marginTop: 0}} level={2}>Справочник наименования этапов</Title>
                </Divider>
                <Form.Item label="Поиск:" name="search">
                    <Space>
                        <Search
                            placeholder="Найти..."
                            allowClear
                            enterButton="Найти"
                            onSearch={onSearch}
                        />
                        <StyledButtonGreen    style={{    marginBottom: 0}} onClick={() => handleAdd()}>Создать новую запись</StyledButtonGreen>
                    </Space>
                </Form.Item>
            </StyledFormLarge>
            <Table
                size={'small'}
                sticky={{
                    offsetHeader: 0,
                }}
                loading={loading}
                dataSource={data.stages.items}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data.stages.count,
                    current: page,
                    limit,
                    onChange: (page, limit) => setPage(page),
                    onShowSizeChange: (current, size) => {
                        setPage(1);
                        setLimit(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            />
            <Modal
                open={editModalVisible}
                width={900}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <StageForm stage={selectedStage} onClose={handleClose}/>
            </Modal>
            <Modal
                open={addModalVisible}
                width={900}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <StageForm onClose={handleClose}/>
            </Modal>
        </div>
    );
};
export default StageTable;
