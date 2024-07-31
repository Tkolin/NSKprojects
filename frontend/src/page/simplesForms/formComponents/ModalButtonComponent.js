import styled from "styled-components";
import {Button} from "antd";

const ModalButtonStyled = styled(Button)`
    
    background: #52c41a; /* зеленый цвет */
    color: #fff; /* белый цвет текста */
    border-color: #52c41a; /* цвет рамки */
    height: 32px;
    margin: 0;
    
    &:hover {
        background: #389e0d; /* изменение цвета при наведении */
        border-color: #389e0d; /* изменение цвета рамки при наведении */
    }
    &:active {
        background: #237804; /* изменение цвета при клике */
        border-color: #237804; /* изменение цвета рамки при клике */
    }
`;
export const ModalButton = ({modalType, isMany,...props}) =>{
    switch (modalType){
        case "green":
            return <ModalButtonStyled style={{
                width: isMany ? "100%" : "150px",
                ...(isMany ? {
                    borderBottomRightRadius: 0, borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                } : {})
            }} {...props}/>
        default:
            return <ModalButtonStyled style={{
                width: isMany ? "100%" : "150px",
                ...(isMany ? {
                    borderBottomRightRadius: 0, borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                } : {})
            }} {...props}/>
    }
}