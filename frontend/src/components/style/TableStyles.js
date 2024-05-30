import styled from 'styled-components';
import { Popconfirm, Row, Table, Typography} from 'antd';
import React from "react";
import { QuestionCircleOutlined} from "@ant-design/icons";

export const StyledTable = styled(Table)`

`;
const StyledLinkManagingDataTable = ({
                                         title,
                                         description,
                                         handleEdit,
                                         handleDelete}) => (
    <div>
        <Row style={{margin: 'auto'}}>
            <Typography.Link onClick={handleEdit}>
                Изменить
            </Typography.Link>
        </Row>
        <Row style={{margin: 'auto'}}>
            <Popconfirm
                title={title}
                description={description}
                onConfirm={handleDelete}
                icon={
                    <QuestionCircleOutlined
                        style={{
                            color: 'red',
                        }}
                    />
                }
            >
                <Typography.Link type={'danger'}>
                    Удалить
                </Typography.Link>
            </Popconfirm>
        </Row>
    </div>
);
export default StyledLinkManagingDataTable;