import React, {useState} from 'react';
import {
    SolutionOutlined,
    HomeOutlined,
    FormOutlined,
    ProfileOutlined, LogoutOutlined, BarChartOutlined, CalculatorOutlined, BugOutlined,
} from '@ant-design/icons';
import {Layout, Menu, Button, Typography, Space} from 'antd';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "../graphql/queries";
import {useNavigate} from "react-router-dom";
import {Cookies} from "react-cookie";
import LoadingSpinnerStyles from "./style/LoadingSpinnerStyles";
import {Header} from "antd/es/layout/layout";
import {Content, Footer} from "antd/lib/layout/layout";
import Logo from "../resursed/logo512.png";

const {Text} = Typography;
const {Content: Contents, Footer: Footers, Sider: Siders} = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const styles = {
    header: {
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    logo: {
        width: '50px',
        height: '50px',
        background: 'rgba(255, 255, 255, 0.2)',
        margin: '16px 24px 16px 0',
        float: 'left',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
    },
    welcomeText: {
        color: 'silver',
        marginRight: '10px',
    },
    logoutButton: {
        marginLeft: '10px',
    },
    content: {
        margin: '24px 16px 0',
        overflow: 'initial',
    },
    footer: {
        textAlign: 'center',
    },
};


const CustomLayout = ({children, currentUser, la}) => {

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
    if (loading) return <LoadingSpinnerStyles/>;
    if (data && error) return `Ошибка! ${error.message}`;

    // Меню
    const items = [];

    items.push(getItem('Главная', '0', <HomeOutlined/>, null, "/"));
    if (data && data.currentUser) {
        const roleName = data.currentUser.role.name;
        switch (roleName) {
            case "admin":
                items.push(
                    getItem('Справочники', '1', <ProfileOutlined/>, [
                        getItem('Контакты', '1-1', null, null),
                        getItem('Подрядчики', '1-3', null, null),
                        getItem('Организации', '1-4', null, null),
                        getItem('ИРД', '1-5', null, null),
                        getItem('Типы документации', '1-6', null, null),
                        getItem('Этапы проекта', '1-7', null, null),
                        getItem('Разделы технического задания', '1-8', null, null),
                    ]),
                    getItem('Формы', '2', <FormOutlined/>, [
                        getItem('Контакт', '2-1', null, null),
                        getItem('Создание нового договора', '2-2', null, null),
                        getItem('Организация', '2-3', null, null),
                        getItem('Подрядчик', '2-4', null, null),
                        getItem('Шаблоны по типу проекта', '2-5', null, null),
                    ]),
                    getItem('Отчёты', '3', <SolutionOutlined/>, [
                        getItem('Проекты', '3-1', null, null)
                    ]),
                    getItem('Расчёты', '4', <CalculatorOutlined />, [
                    ]),
                    getItem('Экономика', '5', <BarChartOutlined />, [
                    ])     ,
                    getItem('', '6', <BugOutlined  />, [
                        getItem('Тест 1', '6-1', null, null),
                        getItem('Тест 2', '6-2', null, null),

                    ])
                );
                break;
            case "bookkeeper":
                items.push(
                    getItem('Справочники', '1', <ProfileOutlined/>, [
                        getItem('Контакты', '1-1', null, null),
                        getItem('Организации', '1-4', null, null),
                        getItem('Подрядчики', '1-3', null, null),
                    ]),
                    getItem('Отчёты', '3', <SolutionOutlined/>, [
                        getItem('Проекты', '3-1', null, null)
                    ]),
                    getItem('Формы', '2', <FormOutlined/>, [
                        getItem('Создание нового договора', '2-2', null, null),
                    ]),
                );
                break;
            default:
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
            case '3-1':
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
                case '1-8':
                // Этапы проекта
                navigate('/SectionReferences');
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
                case '6-1':
                // Шаблоны по типу проекта
                navigate('/t');
                break;
                case '6-2':
                // Шаблоны по типу проекта
                navigate('/project/tasks');
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
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={styles.header}>
                <img src={Logo}  style={styles.logo}/>

                <Menu onClick={onClick} mode="horizontal" style={{width: '100%'}} items={items}
                          selectedKeys={[current]}/>

                <div style={styles.user}>
                    {data && data.currentUser && (
                        <>
                            <Text style={styles.welcomeText}>Добро пожаловать: {data.currentUser.name} !</Text>
                            <Button type="primary" danger onClick={handleLogout} style={styles.logoutButton}>
                                <LogoutOutlined/>
                                Выход
                            </Button>
                        </>
                    )}
                </div>
            </Header>

            <Layout style={{marginTop: 64, paddingRight: 20, paddingLeft: 20}}>
                <Content style={styles.content}>
                    <div className="site-layout-content">{children}</div>
                </Content>

                <Footer style={styles.footer}>
                    ©2024 - {new Date().getFullYear()} ООО ПО "СИБНИПИ" Создал Tkolin
                </Footer>
            </Layout>
        </Layout>
    );
}
export default CustomLayout;
