import React, {useState} from 'react';
import {
    BarChartOutlined,
    BugOutlined,
    CalculatorOutlined,
    FormOutlined,
    HomeOutlined,
    LogoutOutlined,
    ProfileOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, Space, Typography} from 'antd';
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
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    logo: {
        width: '50px',
        height: '50px',
        margin: '16px 24px 16px 0',
        backgroundColor: '#fff',

        float: 'left',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
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
    const [isFenrirPage, setIsFenrirPage] = useState(false);
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
    const hasAccess = (currentRole, allowedRoles) => {
        return allowedRoles.includes(currentRole);
    };
    items.push(getItem('Главная', '0', <HomeOutlined/>, null, "/"));
    if (data && data.currentUser) {
        const roleName = data.currentUser.role.name;
        items.push(
            hasAccess(roleName,  ["admin",'bugalter',"poet"])
            && getItem('Справочники', '/table', <ProfileOutlined/>, [
                getItem('Контакты', '/table/contact', null, null),
                getItem('Подрядчики', '/table/persons', null, null),
                getItem('Организации', '/table/organizations', null, null),
                getItem('ИРД', '/table/ird', null, null),
                getItem('Типы документации', '/table/type_projects', null, null),
                getItem('Этапы проекта', '/table/stage_projects', null, null),
                getItem('Разделы технического задания', '/table/technical', null, null),
            ]),
            getItem('Формы', '/form/', <FormOutlined/>, [
                getItem('Контакт', '/form/contact', null, null),
                getItem('Создание нового договора', '/form/new_project', null, null),
                getItem('Организация', '/form/organizations', null, null),
                getItem('Подрядчик', '/form/persons', null, null),
                getItem('Шаблоны по типу проекта', '/form/template_project', null, null),
            ]),
            getItem('Отчёты', '/reports/', <SolutionOutlined/>, [
                getItem('Проекты', '/reports/project', null, null)
            ]),
            getItem('Расчёты', '/computs/', <CalculatorOutlined/>, [
                // getItem('1', '4-5', null, null),
                // getItem('Рабочий стол', '4-1', null, null),
                // getItem('Создание справочника данных', '4-2', null, null),
                // getItem('Создание формулы', '4-3', null, null),
                // getItem('Форма расчёта', '4-4', null, null),

            ]),
            getItem('Экономика', '5', <BarChartOutlined/>, []),
            getItem('', '6', <BugOutlined/>, [
                getItem('Тест 1', '/test/test1', null, null),
                getItem('Тест 2', '/test/test2', null, null),

            ])
        );
    } else {
        items.push(
            getItem('Регистрация', '/auth/register', null, null),
            getItem('Авторизация', '/auth/login', null, null)
        );
    }
    const onClick = (e) => {
        navigate(e.key);
        setCurrent(e.key);
    }
    // Вывод слоя
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={styles.header}>
                <img src={Logo} style={styles.logo}/>

                <Menu onClick={onClick} mode="horizontal" style={{width: '100%'}} items={items}
                      selectedKeys={[current]}/>

                <div style={styles.user}>
                    {data && data.currentUser && (
                        <Space>
                            {data.currentUser.name}
                            <Button type="primary" danger onClick={handleLogout} style={styles.logoutButton}>
                                <LogoutOutlined/>
                                Выход
                            </Button>
                        </Space>
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
