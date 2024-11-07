import { useMutation, useQuery } from "@apollo/client";
import { Button, Checkbox, DatePicker, Form, Select, Space, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { START_DELAY_MUTATION } from "../../graphql/mutationsDelay";
import { DELAY_TYPES_QUERY } from "../../graphql/queries";
import { PROJECT_QUERY, PROJECT_TASK_QUERY } from "../../graphql/queriesByID";

const StartDelayForm = ({ projectId, selectedTasksId, onCompleted }) => {
  const [form] = Form.useForm();
  const [thisTask, setThisTask] = useState();
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  const { data } = useQuery(PROJECT_QUERY, {
    variables: { id: projectId }
  });

  const { data: dataDelaysTypes, loading: loadingDelaysTypes } = useQuery(DELAY_TYPES_QUERY);

  const { data: dataTask } = useQuery(PROJECT_TASK_QUERY, {
    variables: { id: selectedTasksId },
    onCompleted: (data) => setThisTask(data),
    onError: (error) => console.log(error),
  });

  const [startDelay] = useMutation(START_DELAY_MUTATION, {
    onCompleted: () => onCompleted && onCompleted(),
    onError: (error) => console.log(`Ошибка: ${error.message}`),
  });

  const handleSubmit = (values) => {
    startDelay({
      variables: {
        projectId,
        date_start: values.date_start.format('YYYY-MM-DD'),
        description: values.description,
        type: values.reason,
        provider: values.initiator ? "we" : "executor",
        primaryTaskIds: selectedTaskIds,
      },
    });
  };

  const handleSelectAllTasks = () => {
    const taskIds = data?.project?.project_tasks
      ?.filter(row => row.stage_number === thisTask?.projectTask.stage_number && row.status === "WORKING" && row.executor)
      .map(row => row.id) || [];
    setSelectedTaskIds(taskIds);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Space direction="vertical">
        <span>
          Список задач на текущем этапе, которые будут <strong>приостановлены</strong>
        </span>

        <Button onClick={handleSelectAllTasks}>Отметить все</Button> {/* Кнопка для отметки всех задач */}
        
        {thisTask?.projectTask?.id &&
          data?.project?.project_tasks?.map(
            (row) =>
              row.stage_number === thisTask?.projectTask.stage_number && row.executor  &&
              row.status === "WORKING" && (
                <Form.Item key={row.id} style={{ marginBottom: "0px" }}>
                  <Checkbox
                    size="small"
                    checked={selectedTaskIds.includes(row.id)}
                    onChange={() => {
                      setSelectedTaskIds((prev) =>
                        prev.includes(row.id)
                          ? prev.filter((id) => id !== row.id)
                          : [...prev, row.id]
                      );
                    }}
                  >
                    {row.task?.name}
                  </Checkbox>
                </Form.Item>
              )
          )}
        <hr />
        <span>
          Список задач на текущем этапе, которые будут <strong>отложены</strong>
        </span>
        {thisTask?.projectTask?.id &&
          data?.project?.project_tasks?.map(
            (row) =>
              row.stage_number === thisTask?.projectTask.stage_number && row.executor &&
              row.status === "AWAITING" && (
                <Checkbox
                  checked={selectedTaskIds.includes(row.id)}
                  key={row.id}
                  onChange={() => {
                    setSelectedTaskIds((prev) =>
                      prev.includes(row.id)
                        ? prev.filter((id) => id !== row.id)
                        : [...prev, row.id]
                    );
                  }}
                >
                  {row.task?.name}
                </Checkbox>
              )
          )}
        <hr />
        <Form.Item name="description" label="Комментарий">
          <TextArea placeholder="Введите описание причины отложения задачи" />
        </Form.Item>
        <Form.Item name="initiator" label="Мы / Заказчик">
          <Switch />
        </Form.Item>
        <Form.Item name="reason" label="Причина">
          <Select loading={loadingDelaysTypes}>
          { dataDelaysTypes?.delayTypes?.map(row => (
            <Select.Option value={row.key}>{row.name}</Select.Option>
          ))}
 
          </Select>
        </Form.Item>
        <Form.Item name="date_start" label="Дата начала задержки">
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default StartDelayForm;
