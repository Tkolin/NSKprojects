import {StyledFormBig, StyledFormRegular} from "../../../style/FormStyles";
import {Button, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import {DatePicker} from "antd/lib";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    SEARCH_IRDS_QUERY,
    SEARCH_TEMPLATE_IRDS_OR_TYPE_PROJECT_QUERY,
} from "../../graphql/queriesSearch";
import {UPDATE_IRDS_TO_PROJECT_MUTATION, UPDATE_PAYMENTS_TO_PROJECT_MUTATION} from "../../../../graphql/mutationsProject";
import {TYPES_PAYMENT_QUERY} from "../../../../graphql/queries";

const PaymentProjectForm = ({typeProjectId, projectId, triggerMethod, setTriggerMethod, totalToPay}) => {
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }

    // Состояния
    const [formPayment] = Form.useForm();

    const [totalPaid, setTotalPaid] = useState(0);
    const [totalDebt, setTotalDebt] = useState(totalToPay);



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
    const handleChangeItemPrice = () => {
        const payList = formPayment.getFieldValue('payments');
        if (Array.isArray(payList)) {
            const allPaid = payList.map(item => item.price);
            const paid = allPaid.reduce((acc, val) => acc + val, 0);
            const newDebt = totalToPay - paid;

            setTotalPaid(paid);
            setTotalDebt(newDebt);
        }
    };

    useEffect(() => {
        handleChangeItemPrice();
    }, [formPayment.getFieldValue('payments'), totalToPay]);
    return (
 <StyledFormRegular form={formPayment} name="dynamic_form_nest_item" autoComplete="off">
            <Space.Compact block>
                <Form.Item label="Сумма">
                    <Input value={totalToPay} suffix={"₽"}/>
                </Form.Item>
                <Form.Item label="Оплачено">
                    <Input value={totalPaid} suffix={"₽"}/>
                </Form.Item>
                <Form.Item
                    label="Долг">
                    <Input style={{background: totalDebt > 0 ? '#EE4848' : '#7DFF7D'}} value={totalDebt}
                                         suffix={"₽"}/>
                </Form.Item>
            </Space.Compact>


            <Form.List name="payments">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    key={key}
                                    rules={[{required: true, message: 'Missing type'}]}
                                >
                                    <Select
                                        popupMatchSelectWidth={false}
                                        filterOption={false}
                                        placeholder="Задача..."
                                        allowClear
                                        showSearch
                                    >
                                        {dataPayment && dataPayment.TypePayments && dataPayment.TypePayments.map(tp => (
                                            <Select.Option key={tp.id}
                                                           value={tp.id}>{tp.name}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'date']}
                                    Key={[key, 'date']}
                                    rules={[{required: true, message: 'Missing date'}]}
                                >
                                    <DatePicker showTime/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'price']}
                                    Key={[key, 'price']}
                                    rules={[{required: true, message: 'Missing date'}]}
                                >
                                    <InputNumber min={1} onChange={handleChangeItemPrice} placeholder="Сумма"/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined/>}
                            >
                                Add payment
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </StyledFormRegular>
            )
        };

export default PaymentProjectForm;
