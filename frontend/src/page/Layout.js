import React, { useState } from 'react';
import {
    SolutionOutlined,
    HomeOutlined,
    UserOutlined,
    ShopOutlined,
    PhoneOutlined,
    FundProjectionScreenOutlined,
    FormOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import {Layout, Menu, Button, theme, Space, Typography} from 'antd';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "../graphql/queries";
import {Link, useNavigate} from "react-router-dom";
import SubMenu from "antd/es/menu/SubMenu";
import warning from "antd/es/_util/warning";

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

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Логика

    const navigate = useNavigate();

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
        navigate('/');
        window.location.reload();
    };
    if (loading) return 'Loading...';
    if (data) {
        if (error) return `Error! ${error.message}`;
    }

    // Меню

    const items = [];

    items.push(getItem('Главная', '0', <HomeOutlined />, null, "/"));
    if (data && data.currentUser) {
        if (data.currentUser.role.name === "admin") {
            items.push(
                getItem('Контакты', '1', <PhoneOutlined />, [
                    getItem('Список', '1-1', <ProfileOutlined />, null, "/contacts"),
                    getItem('Добавить', '1-2', <FormOutlined />, null, "/contacts/new"),
                ]),
                getItem('Проекты', '2', <FundProjectionScreenOutlined />, [
                    getItem('Список проектов', '2-1', <ProfileOutlined />, null, "/project"),
                    getItem('Добавить Проект', '2-2', <FormOutlined />, null, "/project/new"),
                    getItem('---Список этапов', '2-3', <ProfileOutlined />, null, "/project/stage"),
                    getItem('---Добавить этап', '2-4', <FormOutlined />, null, "/project/stage/new"),
                    getItem('---Список задач', '2-5', <ProfileOutlined />, null, "/project/stage/task"),
                    getItem('---Добавить задачу', '2-6', <FormOutlined />, null, "/project/stage/task/new"),
                ]),
                getItem('Организации', '3', <SolutionOutlined />, [
                    getItem('Список', '3-1', <ProfileOutlined />, null, "/organization"),
                    getItem('Добавить', '3-2', <FormOutlined />, null, "/organization/new"),
                ]),
                getItem('---Сотрудники', '4', <UserOutlined />, [
                    getItem('---Список', '4-1', <ProfileOutlined />, null, "/person"),
                    getItem('---Добавить', '4-2', <FormOutlined />, null, "/person/new"),
                ]),
                getItem('---Объекты', '6', <ShopOutlined />, [
                    getItem('---Список', '6-1', <ProfileOutlined />, null, "/project/facility"),
                    getItem('---Добавить', '6-2', <FormOutlined />, null, "/project/facility/new"),
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
                    NSKproject ©{new Date().getFullYear()} Created by Tkolin
                </Footer>
            </Layout>
        </Layout>
    );
};
export default CustomLayout;