import { Input, Modal } from "antd";
import React, { useState } from "react";
import { StyledButtonGreen } from "../../components/style/ButtonStyles";
import RequestForm from "../../simplesForms/RequestForm";
const {Search} = Input;

const SearchToolBarItem = ({onSearch, ...props}) => {
    return <Search
        placeholder="Найти..."
       
        
        onSearch={value =>onSearch && onSearch(value)}
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
                <RequestForm cardProps={{title: "Создание заявки на проектирование"}} onCompleted={() => onCompletedLocal()} />
            </Modal>
        </>
    )
}

const ToolBarComponent = ({options, onSearch, onCompleted, gutter}) => {
    const margin = gutter ? gutter / 2 : 4;
    return (
        <>
            {options?.includes('search') && <SearchToolBarItem style={{ marginLeft: margin }} onSearch={(value) => onSearch && onSearch(value)} />}
            {options?.includes('add_request') && <AddRequestBarItem onCompleted={onCompleted} style={{ marginLeft: margin, marginRight: margin }} />}
        </>
    );
}

export default ToolBarComponent;