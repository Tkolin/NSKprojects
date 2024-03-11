import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {useState} from "react";
import {Input} from "antd";

const Example = () => {
    const [value, setValue] = useState("+7") // Set initial value to "+7"

    // Update the value state only if the new value starts with "+7"
    const handleChange = (newValue) => {

            setValue(newValue);

    };

    return (
        <Input
            placeholder="Enter phone number"
            value={value}
            onChange={handleChange}/>
    )
}

export default Example;
