import {Button, Form, Input} from "antd";
import {useMutation} from "@apollo/client";
import {SEND_SMS} from "../graphql/mutationsTypeProject";

const TestMail = () => {

    const [form] = Form.useForm();
    const [mutate, {loading: loadingSave}] = useMutation(SEND_SMS, {
        onCompleted: (data) => {
            console.log(data);
            form.resetFields();
        },
        onError: (error) => {
            console.log('topRight', 'error', `Ошибка при выполнении сооздания контакта: ${error.message}`);
        },
    });
    const onSms = () => {
        mutate({variables: {id : {...form.getFieldValue("id")}}})
    }


    return (

        <Form form={form}>
            <Form.Item name={"id"}>
                <Input/>
            </Form.Item>
            <Button onClick={() => onSms()}> отправить</Button>
        </Form>

    )

}
export default TestMail;