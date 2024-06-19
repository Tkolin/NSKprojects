import styled from 'styled-components';
import {Divider} from 'antd';
import Title from "antd/es/typography/Title";
import React from "react";
import {QuestionCircleOutlined} from "@ant-design/icons";

const StyledBlockWrapper = styled.div`
    margin: 10px auto;
    background-color: #f8fafc;
    padding: 15px;
    padding-top: 0px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
`;
const InformerBlockWrapper = styled.div`
    background-color: #f8fafc;
    padding: 15px;
    border-radius: 5px;
`;
export const StyledBlockWrapperSmall = styled(StyledBlockWrapper)`
    min-width: 200px;
    max-width: 200px;
`;
export const StyledBlockWrapperRegular = styled(StyledBlockWrapper)`
    min-width: 400px;
    max-width: 400px;
`;
export const StyledBlockWrapperBig = styled(StyledBlockWrapper)`
    min-width: 800px;
    max-width: 800px;
`;
export const StyledBlockWrapperLarge = styled(StyledBlockWrapper)`
    min-width: 1200px;
    max-width: 1200px;
`;
const StyledBlock = ({children, color, label, shadow}) => {
    const backgroundColor = () => {
        switch (color) {
            case 'info':
                return 'lightblue';
            case 'warning':
                return 'lightcoral';
            default:
                if(color[0] === '#')
                    return color;
                return 'white';
        }
    };
    return (
        <InformerBlockWrapper style={{ backgroundColor: backgroundColor(), boxShadow: shadow ? "0 0 15px rgba(0, 0, 0, 0.1)" : "none" }}>
            {label && (
                <Divider style={{ marginBottom: '20px', marginTop: '0px' }}>
                    {label}
                </Divider>
            )}
            {children}
        </InformerBlockWrapper>
    )
}
const StyledBlockSmall = ({label, children}) => {
    return (
        <StyledBlockWrapperSmall>
            <Divider style={{marginBottom: '20px', marginTop: '0px'}}>
                <Title level={3}>{label}</Title>
            </Divider>
            {children}
            <Divider style={{marginBottom: '0px', marginTop: '20px'}}/>
        </StyledBlockWrapperSmall>
    );
};
const StyledContextBlock = ({label, children}) => {
    return (
        <StyledBlockWrapper>
            <Divider style={{marginBottom: '0px', marginTop: '0px'}}>
                <Title style={{margin: 2}} level={5}>{label}</Title>
            </Divider>
            {children}
            <Divider style={{marginBottom: '0px', marginTop: '20px'}}/>
        </StyledBlockWrapper>
    );
};
const StyledBlockRegular = ({label, children}) => {
    return (
        <StyledBlockWrapperRegular>
            <Divider style={{marginBottom: '0px', marginTop: '0px'}}>
                <Title level={3} style={{marginBottom: 0}}>{label}</Title>
            </Divider>
            {children}
            <Divider style={{marginBottom: '0px', marginTop: '20px'}}/>
        </StyledBlockWrapperRegular>
    );
};
const StyledBlockBig = ({label, children}) => {
    return (
        <StyledBlockWrapperBig>
            <Divider style={{marginBottom: '0px', marginTop: '0px'}}>
                <Title level={3} style={{marginBottom: 0}}>{label}</Title>
            </Divider>
            {children}
            <Divider style={{marginBottom: '0px', marginTop: '20px'}}/>
        </StyledBlockWrapperBig>
    );
};
const StyledBlockLarge = ({label, children}) => {
    return (
        <StyledBlockWrapperLarge>
            <Divider style={{marginBottom: '20px', marginTop: '0px'}}>
                <Title level={3} style={{marginBottom: 0}}>{label}</Title>
            </Divider>
            {children}
            <Divider style={{marginBottom: '0px', marginTop: '20px'}}/>
        </StyledBlockWrapperLarge>
    );
};
export {StyledBlockSmall, StyledBlockRegular, StyledBlockBig, StyledBlockLarge, StyledBlock, StyledContextBlock};