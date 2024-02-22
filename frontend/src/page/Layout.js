import React, { useState } from 'react';
import {
    SolutionOutlined,
    HomeOutlined,
    FormOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import {Layout, Menu, Button, theme, Typography} from 'antd';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "../graphql/queries";
import {Link, useNavigate} from "react-router-dom";
import SubMenu from "antd/es/menu/SubMenu";
import {Cookies} from "react-cookie";
import LoadingSpinner from "./component/LoadingSpinner";

const { Text } = Typography;
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children, link = null) {
    return {
        key,
        icon,
        children,
        label,
        link,
    };
}

const CustomLayout = ({ children }) => {

    // Дизайн
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Логика
    const navigate = useNavigate();
    const cookies = new Cookies();
    const {loading, error, data} = useQuery(CURRENT_USER_QUERY);
    const handleLogout = () => {
        cookies.remove('accessToken'); // Удаление токена из куки
        navigate('/');
        window.location.reload();
    };
    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinner/>;
    if (data && error) return `Ошибка! ${error.message}`;

    // Меню

    const items = [];

    items.push(getItem('Главная', '0', <HomeOutlined />, null, "/"));
    if (data && data.currentUser) {
        if (data.currentUser.role.name === "admin") {
            items.push(
                getItem('Справочники', '1', <ProfileOutlined />, [
                    getItem('Контакты', '1-1', null, null, "/contacts"),
                    getItem('Проекты', '1-2', null, null, "/project"),
                    getItem('Исполнители', '1-3',null, null, "/person"),
                    getItem('Организации', '1-4',null, null, "/organization"),
                    getItem('ИРД', '1-5',null, null, "/ird"),
                    getItem('Типы документации', '1-6',null, null, "/typeProject"),
                    getItem('Этапы проекта', '1-7',null, null, "/stageProject"),
                ]),
                getItem('Формы', '2', <FormOutlined />, [
                    getItem('Контакт', '2-1', null, null, "/contacts/new"),
                    getItem('Проект', '2-2', null, null, "/project/new"),
                    getItem('Организация', '2-3', null, null, "/organization/new"),
                    getItem('Исполнитель', '2-4', null, null, "/person/new"),
                    getItem('Шаблоны по типу проекта', '2-5', null, null, "/template/new"),
                ]),
                getItem('Отчёты', '3', <SolutionOutlined />, [
                ])

            );
        }
    } else {
        items.push(
            getItem('Регистрация', '7', null, null, "/auth/register"),
            getItem('Авторизация', '8', null, null, "/auth/login")
        );}

    // Вывод слоя
    return (
        <Layout>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div>
                    {data && data.currentUser && (
                        <div
                            style={{display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '20px',
                                marginBottom: '20px'

                        }}>
                            <Text style={{display: 'block', textAlign: 'center', color: 'silver'}}>
                                Добро пожаловать: {data.currentUser.name} !
                            </Text>
                            <Button type="primary" danger={true} style={{marginTop: '10px'}} onClick={handleLogout}>
                                Выход
                            </Button>
                        </div>

                    )}
                </div>
                <div className="demo-logo-vertical"/>
                <Menu theme="dark" mode="inline">
                    {items.map(item => {
                        if (!item) return null; // Пропускаем нулевые элементы
                        if (item.children) {
                            return (
                                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                                    {item.children.map(child => (
                                        <Menu.Item icon={child.icon} key={child.key}>
                                            {child.link ? (
                                                <Link to={child.link}>{child.label}</Link>
                                            ) : (
                                                <span>{child.label}</span>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            );
                        } else {
                            return (
                                <Menu.Item key={item.key} icon={item.icon}>
                                    {item.link ? (
                                        <Link to={item.link}>{item.label}</Link>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </Menu.Item>
                            );
                        }
                    })}
                </Menu>
            </Sider>
            <Layout
                style={{
                    marginLeft: 200,
                }}
            >
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                    <Content
                        style={{
                            margin: '24px 16px 0',
                            overflow: 'initial',
                        }}
                    >
                        <div className="site-layout-content">{children}</div>
                    </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    ©2024 - {new Date().getFullYear()} ООО ПО "СИБНИПИ"
                    Created by Tkolin
                </Footer>
            </Layout>
        </Layout>
    );
};
export default CustomLayout;