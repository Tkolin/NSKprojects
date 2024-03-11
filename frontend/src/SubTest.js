import React, {useImperativeHandle, useRef} from "react";
import {Input} from "antd";

const MyInput = React.forwardRef((props , ref) => {
    const inputRef = useRef(null);

    useImperativeHandle(
        ref,
        () => {
            return inputRef.current.input;
        },
        []
    );
    return <Input {...props} ref={inputRef} />;
});
export default MyInput;
