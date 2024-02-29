import React, {useState} from 'react';
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

const {Text} = Typography;
const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const CustomLayout = ({children}) => {

    // Логика
    const navigate = useNavigate();
    const cookies = new Cookies();
    const {loading, error, data} = useQuery(CURRENT_USER_QUERY);
    const [current, setCurrent] = useState('1');
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

    items.push(getItem('Главная', '0', <HomeOutlined/>, null, "/"));
    if (data && data.currentUser) {
        switch (data.currentUser.role.name) {
            case "admin":
                items.push(
                    getItem('Справочники', '1', <ProfileOutlined/>, [
                        getItem('Контакты', '1-1', null, null),
                        getItem('Проекты', '1-2', null, null),
                        getItem('Исполнители', '1-3', null, null),
                        getItem('Организации', '1-4', null, null),
                        getItem('ИРД', '1-5', null, null),
                        getItem('Типы документации', '1-6', null, null),
                        getItem('Этапы проекта', '1-7', null, null),
                    ]),
                    getItem('Формы', '2', <FormOutlined/>, [
                        getItem('Контакт', '2-1', null, null),
                        getItem('Проект', '2-2', null, null),
                        getItem('Организация', '2-3', null, null),
                        getItem('Исполнитель', '2-4', null, null),
                        getItem('Шаблоны по типу проекта', '2-5', null, null),
                    ]),
                    getItem('Отчёты', '3', <SolutionOutlined/>, [])
                );
                break;
            case "bookkeeper":
                items.push(
                    getItem('Справочники', '1', <ProfileOutlined/>, [
                        getItem('Контакты', '1-1', null, null),
                        getItem('Организации', '1-4', null, null),
                        getItem('Исполнители', '1-3', null, null),
                    ])
                );
                break;
        }
    } else {
        items.push(
            getItem('Регистрация', '7', null, null),
            getItem('Авторизация', '8', null, null)
        );
    }
    const onClick = (e) => {
        switch (e.key) {
            case '0':
                navigate('/');
                break;
            case '1-1':
                navigate('/contacts');
                break;
            case '1-2':
                navigate('/project');
                break;
            case '1-3':
                navigate('/person');
                break;
            case '1-4':
                navigate('/organization');
                break;
            case '1-5':
                navigate('/ird');
                break;
            case '1-6':
                // Типы документации
                navigate('/typeProject');
                break;
            case '1-7':
                // Этапы проекта
                navigate('/stageProject');
                break;
            case '2-1':
                // Контакт
                navigate('/contacts/new');
                break;
            case '2-2':
                // Проект
                navigate('/project/new');
                break;
            case '2-3':
                // Организация
                navigate('/organization/new');
                break;
            case '2-4':
                // Исполнитель
                navigate('/person/new');
                break;
            case '2-5':
                // Шаблоны по типу проекта
                navigate('/template/new');
                break;
            case '3':
                // Отчёты
                // Действие для отчетов
                break;
            case '7':
                // Регистрация
                navigate('/auth/register');
                break;
            case '8':
                // Авторизация
                navigate('/auth/login');
                break;
            default:
                break;
        }
        setCurrent(e.key);
    }
    // Вывод слоя
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                width={200}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    paddingTop: '20px',
                }}
            >
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {data && data.currentUser && (
                        <>
                            <Text
                                style={{display: 'block', textAlign: 'center', color: 'silver', marginBottom: '10px'}}>
                                Добро пожаловать: {data.currentUser.name} !
                            </Text>
                            <Button type="primary" danger style={{width: '80%', marginTop: '10px'}}
                                    onClick={handleLogout}>
                                Выход
                            </Button>
                        </>
                    )}
                </div>
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    onClick={onClick}
                    style={{width: '100%'}}
                    mode="inline"
                    items={items}
                    selectedKeys={[current]}
                />
            </Sider>
            <Layout style={{marginLeft: 200}}>
                <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                    <div className="site-layout-content">{children}</div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    ©2024 - {new Date().getFullYear()} ООО ПО "СИБНИПИ" Created by Tkolin
                </Footer>
            </Layout>
        </Layout>
    );
};
export default CustomLayout;