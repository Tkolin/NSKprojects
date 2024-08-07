import {Form} from "antd";

export const AutoCompleteFormItem = ({rulesValidationRequired, rulesValidationMessage, ...props}) => {
     return (<Form.Item
            style={{width: "100%"}}
            rules={[
                {
                    required: rulesValidationRequired,
                    validator(rule, value) {
                        return new Promise((resolve, reject) => {
                            if (value?.selected || !rulesValidationRequired){
                                resolve();
                            }
                            else
                                reject(rulesValidationMessage ?? "");

                        })
                    }
                }
            ]}
            {...props}

        />
    );
}
export default {AutoCompleteFormItem}