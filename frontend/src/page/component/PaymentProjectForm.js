import {StyledFormBig, StyledFormRegular} from "../style/FormStyles";
import {Button, Col, Form, Input, notification, Row, Select, Space} from "antd";
import {DatePicker} from "antd/lib";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    SEARCH_IRDS_QUERY,
    SEARCH_TEMPLATE_IRDS_OR_TYPE_PROJECT_QUERY,
} from "../../graphql/queriesSearch";
import {UPDATE_IRDS_TO_PROJECT_MUTATION, UPDATE_PAYMENTS_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {TYPES_PAYMENT_QUERY} from "../../graphql/queries";

const PaymentProjectForm = ({ typeProjectId, projectId, triggerMethod, setTriggerMethod, totalToPay }) => {
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }

    // Состояния
    const [formPayment] = Form.useForm();


    // Получение данных для выпадающих списков
    const {loading: loadingPayment, error: errorPayment, data: dataPayment} = useQuery(TYPES_PAYMENT_QUERY);

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутации для добавления и обновления
    const [updatePaymentToProject] = useMutation(UPDATE_PAYMENTS_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены payment!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных payment: ' + error.message);
        }
    });

    const handleSubmit = () => {
        const paymentData = formPayment.getFieldsValue().paymentList.map(payment => ({
            payment_id: payment.payment_item, date_complete: payment.date_complete_item
        }));

        // Вызов мутаций для обновления данных
        updatePaymentToProject({
            variables: {
                typeProjectId: typeProjectId,
                listPayment_id: dataPayment.map(payment => parseInt(payment.payment_id)),
                listDateComplete: dataPayment.map(payment => payment.date_complete),
            }
        });
    }

    return (
        <StyledFormRegular form={formPayment} name="dynamic_form_nest_item" autoComplete="off">

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item label="Сумма" initialValue={totalToPay}>
                        <Input  disabled  value={totalToPay}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Оплачено" name="totalPaidInput">
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Долг" name="totalDebtInput">
                        <Input className={formPayment.getFieldValue('totalDebt') > 0 ? 'red' : ''} disabled />
                    </Form.Item>
                </Col>
            </Row>


            <Form.List name="payments">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    key={key}
                                    rules={[{ required: true, message: 'Missing type' }]}
                                >
                                    <Select
                                        popupMatchSelectWidth={false}
                                        filterOption={false}
                                        placeholder="Задача..."
                                        allowClear
                                        showSearch
                                    >
                                        {dataPayment && dataPayment.TypePayments  && dataPayment.TypePayments.map(tp => (
                                            <Select.Option key={tp.id}
                                                           value={tp.id}>{tp.name}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'date']}
                                    Key={[key, 'date']}
                                    rules={[{ required: true, message: 'Missing date' }]}
                                >
                                    <DatePicker showTime />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    Key={[key,  'price']}
                                    rules={[{ required: true, message: 'Missing date' }]}
                                >
                                    <Input placeholder="Сумма" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                            >
                                Add payment
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </StyledFormRegular>
    );
};

export default PaymentProjectForm;