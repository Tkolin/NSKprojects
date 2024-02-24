import styled from 'styled-components';
import { Form, Button } from 'antd';
import Title from "antd/es/typography/Title";

const StyledBlockWrapper = styled.div`
  margin: 0 auto;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
export const StyledBlockWrapperSmall = styled(StyledBlockWrapper)`
    max-width: 200px;
`;
export const StyledBlockWrapperRegular = styled(StyledBlockWrapper)`
    max-width: 400px;
`;
export const StyledBlockWrapperBig = styled(StyledBlockWrapper)`
    max-width: 800px;
`;
export const StyledBlockWrapperLarge = styled(StyledBlockWrapper)`
    max-width: 1200px;
`;

const marginBottom = 20;
const marginTop = 5;
const StyledBlockSmall = ({ lable, children  }) => {
    return (
        <StyledBlockWrapperSmall>
                <Title level={3} style={{marginBottom: marginBottom, marginTop: marginTop}}>{lable}</Title>
                {children}
        </StyledBlockWrapperSmall>
    );
};
const StyledBlockRegular = ({label, children  }) => {
    return (
        <StyledBlockWrapperRegular>
            <div style={{textAlign: 'center'}}>
                <Title level={3} style={{marginBottom: marginBottom, marginTop: marginTop}}>{label}</Title>
            </div>
            {children}
        </StyledBlockWrapperRegular>
    );
};
const StyledBlockBig = ({label, children}) => {
    return (
        <StyledBlockWrapperBig>
            <div style={{textAlign: 'center'}}>
                <Title level={3}  >{label}</Title>
            </div>
            {children}
        </StyledBlockWrapperBig>
    );
};
const StyledBlockLarge = ({label, children}) => {
    return (
        <StyledBlockWrapperLarge>
            <div style={{textAlign: 'center'}}>
                <Title level={3} style={{marginBottom: marginBottom, marginTop: marginTop}}>{label}</Title>
            </div>
            {children}
        </StyledBlockWrapperLarge>
    );
};
export {StyledBlockSmall, StyledBlockRegular, StyledBlockBig, StyledBlockLarge};