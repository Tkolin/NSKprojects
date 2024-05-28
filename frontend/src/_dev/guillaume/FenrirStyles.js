import styled from 'styled-components';
import {Button, Menu, Select} from 'antd';
import {colors, exstra_colors} from "../style/colors";

export const CompactMenu = styled(Menu)`
    .ant-menu {
        background-color: #9ca3af;
    }
    .ant-menu,.ant-menu-item, .ant-menu-submenu-title {
        font-size: 15px; /* Уменьшаем размер шрифта */
        font-weight: 600;
        padding: 5px 0px; /* Уменьшаем отступы */
        margin-top: 8px;
        margin-bottom: 8px;
        line-height: 0px;
        background-color: transparent ;
        color: ${colors.textColor};
    }

    .ant-menu-submenu-popup {
        top: 0 !important; /* Перемещаем выпадающее меню вверх */
    }
`;

export const CustomButton = styled(Button)`
    &.my-custom-btn-create-formula  {
        border: 1.5px solid ${colors.formulas.primary};
        background: ${colors.input.secondary};
        color: ${colors.formulas.primary};
        border-radius: 3px;

        &:hover {
            background: ${colors.formulas.primary};
            color: ${colors.input.secondary};
        }

        &:active {
            background: ${colors.formulas.primary};
            color: ${colors.input.secondary};
            border-color: ${colors.formulas.primary};
        }
    }

    &.my-custom-btn-create-references  {
        border: 1.5px solid ${colors.references.primary};
        background: ${colors.input.secondary};
        color: ${colors.references.primary};
        border-radius: 3px;

        &:hover {
            background: ${colors.references.primary};
            color: ${colors.input.secondary};
        }

        &:active {
            background: ${colors.references.primary};
            color: ${colors.input.secondary};
            border-color: ${colors.references.primary};
        }
    }  
    &.my-custom-btn-add-input  {
        border: 1.5px solid ${colors.input.primary};
        background: ${colors.input.secondary};
        color: ${colors.textColor};
        border-radius: 2px;
        width: 100%;
        margin-bottom: 5px;
        text-align: start;

        &:hover {
            background: ${colors.references.primary};
            color: ${colors.input.secondary};
        }

        &:active {
            background: ${colors.references.primary};
            color: ${colors.input.secondary};
            border-color: ${colors.references.primary};
        }
    }  
    &.my-custom-btn-add-input-array  {
        border: 1.5px solid ${colors.inputArray.primary};
        background: ${colors.inputArray.secondary};
        color: ${colors.textColor};
        border-radius: 2px;
        width: 100%;
        margin-bottom: 5px;
        text-align: start;

        &:hover {
            background: ${colors.inputArray.primary};
            color: ${colors.inputArray.secondary};
        }

        &:active {
            background: ${colors.inputArray.primary};
            color: ${colors.inputArray.secondary};
            border-color: ${colors.references.primary};
        }
    }  
       &.my-custom-btn-add-output  {
        border: 1.5px solid ${colors.result.primary};
        background: ${colors.result.secondary};
           text-align: start;
        color: ${colors.textColor};
           border-radius: 2px;
           width: 100%;
           margin-bottom: 5px;

        &:hover {
            background: ${colors.references.primary};
            color: ${colors.input.secondary};
        }

        &:active {
            background: ${colors.references.primary};
            color: ${colors.input.secondary};
            border-color: ${colors.references.primary};
        }
    }  
`;

export const CustomSelect = styled(Select)`
    &.my-custom-select-formula .ant-select-selector {
        border: 1.5px solid ${colors.formulas.primary};
        background: ${colors.formulas.secondary};
        color: ${colors.textColor};
        border-radius: 3px;
    }

    &.my-custom-select-formula .ant-select-arrow {
        color: ${colors.textColorSelector};
    }

    &.my-custom-select-math .ant-select-selector {
        border: 1.5px solid ${colors.operations.primary};
        background: ${colors.operations.secondary};
        color: ${colors.textColor};
        border-radius: 3px;
    }

    &.my-custom-select-math .ant-select-arrow {
        color: ${colors.textColorSelector};
    }

    &.my-custom-select-references .ant-select-selector {
        border: 1.5px solid ${colors.references.primary};
        background: ${colors.references.secondary};
        color: ${colors.textColor};
        border-radius: 3px;
    }

    &.my-custom-select-references .ant-select-arrow {
        color: ${colors.textColorSelector};
    }

    &.my-custom-select-functions .ant-select-selector {
        border: 1.5px solid ${colors.function.primary};
        background: ${colors.function.secondary};
        color: ${colors.textColor};
        border-radius: 3px;
    }

    &.my-custom-select-functions .ant-select-arrow {
        color: ${colors.textColorSelector};
    }
`;
