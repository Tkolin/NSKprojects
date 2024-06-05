import styled from 'styled-components';
import { Button } from 'antd';



export const StyledButtonGreen = styled(Button)`
    
    background: #52c41a; /* зеленый цвет */
    color: #fff; /* белый цвет текста */
    border-color: #52c41a; /* цвет рамки */
    &:hover {
        background: #389e0d; /* изменение цвета при наведении */
        border-color: #389e0d; /* изменение цвета рамки при наведении */
    }
    &:active {
        background: #237804; /* изменение цвета при клике */
        border-color: #237804; /* изменение цвета рамки при клике */
    }
`;
