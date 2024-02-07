import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, Layout, Menu, theme  } from 'antd';
import { CURRENT_USER_QUERY } from '../graphql/queries';
import { navBarHeader } from '../antd.theme';

const { Header, Content,Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));


const CustomLayout = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken'); // Получаем токен из куки

    const {loading, error, data} = useQuery(CURRENT_USER_QUERY, {
        context: {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            }
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Удаление токена из куки
        window.location.reload();
    };

    if (loading) return 'Loading...';
    if (data) {
        if (error) return `Error! ${error.message}`;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu theme="dark"
                      mode="horizontal"
                      defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/">Главная</Link>
                    </Menu.Item>
                    {data && data.currentUser ? (
                        data.currentUser.role.name === "admin" ? (
                            <>
                                <Menu.SubMenu key="contacts" title="Контакты">
                                    <Menu.Item key="2">
                                        <Link to="/contacts">Список контактов</Link>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                        <Link to="/contacts/new">Добавить контакт</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu key="project" title="Проекты">
                                    <Menu.Item key="2">
                                        <Link to="/project">Список проектов</Link>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                        <Link to="/project/new">Добавить проект</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                            </>
                        ) : null
                    ) : (
                        <Menu.SubMenu key="auth" title="Аккаунт">
                            <Menu.Item key="4">
                                <Link to="/auth/register">Регистрация</Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to="/auth/login">Авторизация</Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                    )}
                </Menu>
            </Header>
            <Content style={{ padding: '0 48px', flex: '1 0 auto' }}>
                <div className="site-layout-content">{children}</div>
            </Content>
            <Footer style={{ textAlign: 'center', flexShrink: '0' }}>
            NSKproject ©{new Date().getFullYear()} Created by Tkolin
            </Footer>
        </Layout>
    );
};

export default CustomLayout;
