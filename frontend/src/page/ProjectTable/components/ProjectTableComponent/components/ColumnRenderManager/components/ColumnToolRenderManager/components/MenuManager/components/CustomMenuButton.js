import {Button} from 'antd';

const customProps = {type: "text", style: {width: "100%"}, size: "large"}

const CustomMenuButton = ({warring = false, ...props}) => {
    return <Button {...props} {...customProps} className={warring && "danger_text_btn"}/>
}

export default CustomMenuButton;