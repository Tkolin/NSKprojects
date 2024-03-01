import styled from 'styled-components';
import {Divider} from 'antd';
import Title from "antd/es/typography/Title";
import React from "react";

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

const StyledBlockSmall = ({ label, children  }) => {
    return (
        <StyledBlockWrapperSmall>
            <Divider style={{ marginBottom: '20px', marginTop: '0px' }}  >
                <Title level={3}  >{label}</Title>
            </Divider>


            {children}
        </StyledBlockWrapperSmall>
    );
};
const StyledBlockRegular = ({label, children  }) => {
    return (
        <StyledBlockWrapperRegular>
            <Divider style={{ marginBottom: '20px', marginTop: '0px' }}  >
                <Title level={3}  >{label}</Title>
            </Divider>

            {children}
        </StyledBlockWrapperRegular>
    );
};
const StyledBlockBig = ({label, children}) => {
    return (
        <StyledBlockWrapperBig>

            <Divider style={{ marginBottom: '20px', marginTop: '0px' }}  >                <Title level={3}  >{label}</Title>
             </Divider>

            {children}
        </StyledBlockWrapperBig>
    );
};
const StyledBlockLarge = ({label, children}) => {
    return (
        <StyledBlockWrapperLarge>
            <Divider style={{ marginBottom: '20px', marginTop: '0px' }}  >
                <Title level={3}  >{label}</Title>
            </Divider>


            {children}
        </StyledBlockWrapperLarge>
    );
};
export {StyledBlockSmall, StyledBlockRegular, StyledBlockBig, StyledBlockLarge};