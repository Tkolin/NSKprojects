// Ваш проект/frontend/src/components/Layout.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

const CustomLayout = ({ children }) => {
    return (
        <Layout>
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/">Главная</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/contacts">Contact List</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/contacts/new">Add Contact</Link>
                    </Menu.Item>
                    {/* Add more navigation links as needed */}
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content">{children}</div>
            </Content>
        </Layout>
    );
};

export default CustomLayout;
