// FormStyles.js
import styled from 'styled-components';
import { Form, Input, Select, Button } from 'antd';

export const StyledForm = styled(Form)`
  max-width: 400px;
  margin: 0 auto;
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 20px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledFormBlockWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const StyledFormBlock = ({ form, onFinish, children }) => {
    return (
        <StyledFormBlockWrapper>
            <Form form={form} onFinish={onFinish} layout="vertical">
                {children}
            </Form>
        </StyledFormBlockWrapper>
    );
};

export default StyledFormBlock;