import React, {useEffect, useState} from 'react';

import {useLocation, useNavigate} from 'react-router-dom';
import {Layout, Menu, Image, Dropdown, Avatar, Badge, Alert, Card, Breadcrumb, Space} from 'antd';
import {

    UserOutlined,
} from '@ant-design/icons';
import Logo from '../resursed/logo512.png';
import {UserMenuHeaderDropdown} from "./UserCard";
import Link from "antd/es/typography/Link";
import {MenuItemsByPermission, MenuItems} from "./MenuItems";

const {Header, Content, Footer} = Layout;


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
    card: {
        minHeight:  "calc(100vh - 170px)"
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
        minHeight: "1vh",

    },
    footer: {
        textAlign: 'center',
    },
};

export const getErrorLayout = (error) => {
    switch (error) {
        case 'Failed to fetch':
            return <div>Сервер не доступен</div>
        default:
            return <>Ошибка</>
    }
};


const AppLayout = ({children, currentUser, error}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);
    const [items, setItems] = useState();
    const [title, setTitle] = useState();
    useEffect(() => {
        setItems(MenuItemsByPermission(currentUser?.currentUser ?? null));
    }, [currentUser]);
    useEffect(() => {
        setCurrent(location.pathname); // Обновить current при изменении пути

    }, [location.pathname]);
    useEffect(() => {
        const item = findMenuItemByKey(current, MenuItems);
        const label = <>{item?.icon} {item?.label}</>;
        if (label)
            setTitle(label); // Обновить current при изменении пути

    }, [current, currentUser, location.pathname, children]);
    const findMenuItemByKey = (key, menuItems) => {
        if (!key || !menuItems)
            return null;

        const findItem = (items) => {
            for (const item of items) {
                if (item?.key === key) {
                    return item;
                }
                if (item?.children) {
                    const found = findItem(item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        return findItem(menuItems);
    };

    const onClick = (e) => {
        navigate(e?.key);
        setCurrent(e?.key);
    };


    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={styles.header}>
                {/*{!error ? (<>*/}
                <Image src={Logo} style={styles.logo}/>

                <Menu onClick={onClick} mode="horizontal" style={{width: '100%'}} items={items}
                      selectedKeys={[current]} className={"biba"}/>
                <UserMenuHeaderDropdown currentUser={currentUser?.currentUser}/>
            </Header>

            <Layout style={{marginTop: 64, paddingRight: 20, paddingLeft: 20}}>
                <Content style={styles.content}>

                    <Card title={title} style={styles.card} styles={{
                        title: {
                            textAlign: 'center',
                            fontSize: "23px",
                            color: "#1677ff"
                        }
                    }}>
                        <Space block style={{
                            margin: 0, padding: 0,
                            justifyContent: "center",
                            width: "100%",
                        }}>
                            {children}
                        </Space>

                    </Card>
                </Content>

                <Footer style={styles.footer}>
                    ©2024 - {new Date().getFullYear()} ООО ПО "СИБНИПИ" Создал Tkolin
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
