import styled from 'styled-components';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  width: 100%;
`;
export const StyledButtonForm = styled(Button)`
    margin-bottom: 6px;
`;
export const StyledButtonGreen = styled(Button)`
    
    background: #52c41a; /* зеленый цвет */
    color: #fff; /* белый цвет текста */
    border-color: #52c41a; /* цвет рамки */
    margin-bottom: 10px;
    &:hover {
        background: #389e0d; /* изменение цвета при наведении */
        border-color: #389e0d; /* изменение цвета рамки при наведении */
    }

    &:active {
        background: #237804; /* изменение цвета при клике */
        border-color: #237804; /* изменение цвета рамки при клике */
    }
`;
