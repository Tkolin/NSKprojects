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
const StyledFormRegular = ({form, onFinish, children, layout, disabled,labelAlign,wrapperCol,labelCol  }) => {
    return (
            <Form form={form} onFinish={onFinish}
                  labelAlign={labelAlign ? labelAlign : "left"}
                  style={{minWidth: 360}}
                  wrapperCol={wrapperCol ? wrapperCol : {flex: 1}}
                  labelWrap
                  labelCol={labelCol ? labelCol : null}
                  layout={layout ? layout : "horizontal"}
                  disabled={disabled}>

                {children}
            </Form>
    );
};
const StyledFormBig = ({ form, onFinish, children, disabled  }) => {
    return (
            <Form form={form}
                  onFinish={onFinish}
                  labelAlign="left"
                  labelWrap
                  layout="horizontal"
                  disabled={disabled}
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
