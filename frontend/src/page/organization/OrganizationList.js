import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {Link} from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
    function getItem(label, key, icon, children, link = null) {
        return {
            key,
            icon,
            children,
            label,
            link,
        };
    }
    const name = "asdmin";
    const items = [
        getItem('Option 1', '1', <PieChartOutlined />,null,"/option1"),
        getItem('Option 2', '2', <DesktopOutlined />,null,"/option2"),
        (name === "admin") &&
        getItem('User', 'sub1', <UserOutlined />, [
            getItem('Tom', '3',null,null,"/option3"),
            getItem('Bill', '4',null,null,"/option4"),
            getItem('Alex', '5',null,null,"/option5"),
        ]),
        getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Files', '9', <FileOutlined />),
    ];
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {items.map(item => (
                <Menu.Item key={item.key} icon={item.icon}>
                    {item.link ? (
                        <Link to={item.link}>{item.label}</Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </Menu.Item>
            ))}
        </Menu>
    );
};
export default App;