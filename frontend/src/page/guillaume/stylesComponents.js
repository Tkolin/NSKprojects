import styled from 'styled-components';
import { Select } from 'antd';
import {colors, exstra_colors} from "../style/colors";

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
