import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Layout, Menu,Button } from 'antd';
import { CURRENT_USER_QUERY } from '../graphql/queries';
import { Cookies } from 'react-cookie';


const { Header, Content } = Layout;

const CustomLayout = ({ children }) => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken'); // Получаем токен из куки

    console.log(accessToken);

    const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
        context: {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            }
        }
    });

    const handleLogout = () => {
        cookies.remove('accessToken'); // Удаление токена из куки
        window.location.reload();
    };
    if (loading) return 'Loading...';
    if(data) {
        const {currentUser} = data;
        if (error) return `Error! ${error.message}`;
    }


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

                    {data && data.currentUser ? (
                        <Menu.Item key="6">
                            <span>Username: {data.currentUser.username}</span>
                            <span>Email: {data.currentUser.email}</span>
                            <Button type="primary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Menu.Item>
                    ) : (
                        <>
                            <Menu.Item key="4">
                                <Link to="/auth/register">Регистрация</Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to="/auth/login">Авторизация</Link>
                            </Menu.Item>
                        </>
                    )}
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <div className="site-layout-content">{children}</div>
            </Content>
        </Layout>
    );
};

export default CustomLayout;
