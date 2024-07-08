import styled from 'styled-components';
import {Card, Divider} from 'antd';
 import React from "react";

const StyledBlockWrapper = styled(Card)`
    margin: 10px auto;
    padding: 15px;
    padding-top: 0px;
    
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

            {children}
         </StyledBlockWrapperSmall>
    );
};
const StyledContextBlock = ({label, children}) => {
    return (
        <StyledBlockWrapper>

            {children}
         </StyledBlockWrapper>
    );
};
const StyledBlockRegular = ({label, children}) => {
    return (
        <StyledBlockWrapperRegular>

            {children}
         </StyledBlockWrapperRegular>
    );
};
const StyledBlockBig = ({label, children}) => {
    return (
        <StyledBlockWrapperBig>

            {children}
         </StyledBlockWrapperBig>
    );
};
const StyledBlockLarge = ({label, children}) => {
    return (
        <StyledBlockWrapperLarge>

            {children}
         </StyledBlockWrapperLarge>
    );
};
export {StyledBlockWrapper,StyledBlockSmall, StyledBlockRegular, StyledBlockBig, StyledBlockLarge, StyledBlock, StyledContextBlock};