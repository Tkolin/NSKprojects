import styled from 'styled-components';
import { Form } from 'antd';

export const StyledFormWrapperSmall = styled(Form)`
    max-width: 200px;
    margin: 0 auto;
 
`;
export const StyledFormWrapperRegular = styled(Form)`
    max-width: 400px;
    margin: 0 auto;
 
`;
export const StyledFormWrapperBig = styled(Form)`
    max-width: 800px;
    margin: 0 auto;
`;
export const StyledFormWrapperLarge = styled(Form)`
    max-width: 1200px;
    margin: 0 auto;
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 10px;
`;
const StyledForm = ({form, onFinish, children  }) => {
    return (
        <Form form={form} onFinish={onFinish}
              labelAlign="right"
              labelCol={{ flex: '120px' }}
              wrapperCol={{flex: '180px'}}
              labelWrap
              layout="horizontal">

            {children}
        </Form>
    );
};
const StyledFormSmall = ({ form, onFinish, children  }) => {
    return (

            <Form form={form} onFinish={onFinish} layout="vertical">
                 {children}
            </Form>

    );
};
const StyledFormRegular = ({form, onFinish, children, layout  }) => {
    return (
            <Form form={form} onFinish={onFinish}
                  labelAlign="left"
                  style={{maxWidth: 360}}
                  wrapperCol={{flex: 1}}
                  labelWrap
                  layout={layout ? layout : "horizontal"}>

                {children}
            </Form>
    );
};
const StyledFormBig = ({ form, onFinish, children  }) => {
    return (
            <Form form={form}
                  onFinish={onFinish}
                  labelAlign="left"
                  labelWrap
                  layout="horizontal"
            >
                {children}
            </Form>
    );
};
const StyledFormLarge = ({ form, onFinish, children  }) => {
    return (
            <Form
                form={form}
                  onFinish={onFinish} layout="vertical">
                {children}
            </Form>
    );
};
export {StyledFormSmall,StyledFormRegular,StyledFormBig,StyledFormLarge,StyledForm};