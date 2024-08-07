import Search from "antd/es/input/Search";
import {Modal} from "antd";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
 
 import React, {useState} from "react";
import RequestForm from "../../simplesForms/RequestForm";
 

const SearchToolBarItem = ({onSearch, ...props}) => {
    return <Search
        placeholder="Найти..."
        allowClear
        enterButton="Найти"
        onSearch={value => onSearch(value)}
        {...props}
    />
}
const AddRequestBarItem = ({onCompleted, ...props}) => {
    const [addRequestModalStatus, setAddRequestModalStatus] = useState();
    const onCompletedLocal = () => {
        setAddRequestModalStatus(false);
        onCompleted && onCompleted();

    }
    return (
        <>
            <StyledButtonGreen
                placeholder="Найти..."
                allowClear
                enterButton="Найти"
                onClick={() => setAddRequestModalStatus(true)}
                children={"Создать заявку"}
                {...props}
            />
            <Modal
                open={addRequestModalStatus}
                onCancel={() => setAddRequestModalStatus(false)}
 
                width={"max-content"}
                footer={null}
            >
                <RequestForm cardProps={{title: "Создание заявки на проектирование"}} onCompleted={() => onCompletedLocal()}/>
 
            </Modal>
        </>
    )
}
const ToolBarComponent = ({options, onSearch, onCompleted,gutter}) => {
    const margin = gutter ? gutter/2 : 4;
    return (
        <>
            {options?.includes('search') && <SearchToolBarItem style={{marginLeft: margin}} onSearch={onSearch}/>}
            {options?.includes('add_request') && <AddRequestBarItem onCompleted={onCompleted} style={{marginLeft: margin, marginRight: margin}} onSearch={onSearch}/>}
        </>
    );
}
export default ToolBarComponent;