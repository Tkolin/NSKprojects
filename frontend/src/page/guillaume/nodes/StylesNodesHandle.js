import {Handle} from "reactflow";
import {colors} from "../../style/colors";
import React from "react";

export const StyledHandleSingleInput = ({id, style}) => {
    return (
        <Handle id={id} type="target" position="left"
                onConnect={(params) => console.log('handle onConnect', params)}

                style={{
                    background: 'radial-gradient(circle, ' + colors.input.secondary + ' 18%, ' + colors.input.primary + ' 20%, ' + colors.input.primary + ' 38%, ' + colors.input.secondary + ' 40%)',
                    borderWidth: "1px",
                    width: 20,
                    height: 20,
                    ...style
                }}/>
    );
}
export const StyledHandleSingleOutput = () => {

}
export const StyledHandleArrayInput = ({id, style, onConnect}) => {
    return (
        <Handle id={id} type="target" position="left" radioGroup={"1"}
                onConnect={() => onConnect}
                style={{
                    background: 'radial-gradient(circle, ' + colors.inputArray.secondary + ' 18%, ' + colors.inputArray.primary + ' 20%, ' + colors.inputArray.primary + ' 38%, ' + colors.inputArray.secondary + ' 40%)',
                    borderWidth: "1px",
                    width: 20,
                    height: 20,
                    ...style
                }}/>
    );
}
export const StyledHandleArrayOutput = () => {

}

