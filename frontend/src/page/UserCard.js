import {Avatar, Badge, Button, Card, Divider, Dropdown, Space, Typography} from "antd";
import {LoginOutlined, LogoutOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {StyledButtonGreen, StyledButtonGreenGhost} from "./components/style/ButtonStyles";
import {useNavigate} from "react-router-dom";
import {Cookies} from "react-cookie";
import catImage from '../resursed/cat.jpg';
import {useApolloClient, useQuery} from "@apollo/client";
import {GET_CURRENT_USER} from "../graphql/queries"; // Убедитесь, что путь правильный


const {Text, Link} = Typography;

export const UserCard = ({
                             user
                         }) => {

    const navigate = useNavigate();
    const cookies = new Cookies();
    const { refetch: refetchCurrentUser} = useQuery(GET_CURRENT_USER);

    const handleLogout = () => {

        cookies.set('accessToken', null);
        refetchCurrentUser && refetchCurrentUser();
        navigate('/auth/login');
        window.location.reload();
     };
    const handleLogin = () => {
        navigate('auth/login');
    }
    const falseItems = [
        {
            key: '3',
            header: "Настройка аккаунта",
            buttons: [
                {
                    key: '3-1',
                    children: "Запросить аккаунт",
                    icon: <MailOutlined/>,
                    onClick: () => {
                        console.log('Кнопка 1-1 нажата');
                    }
                },
                {
                    green: true,
                    key: '3-2',
                    children: "Войти",
                    icon: <LoginOutlined/>,
                    onClick: () => {
                        handleLogin();
                    }
                }
            ]
        },
    ]
    if (!user) {
        return (
            <Card size={"small"} title={"СибНИПИ ID"}
                  style={{minWidth: "300px", justifyContent: 'center', alignItems: 'center'}}>
                <Space.Compact size={"large"} direction="vertical"
                               style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Avatar shape="square" size={64} icon={<UserOutlined/>}/>
                    <Text style={{fontSize: "16px"}} type={"secondary"}>Необходимо выполнить вход</Text>
                    <Text style={{fontSize: "16px"}} type={"secondary"}>для доступа в систему</Text>
                </Space.Compact>
                {falseItems.map((row) => (
                    (row.visible ?? true) &&
                    (
                        <>
                            <Divider style={{margin: 8}}/>
                            <Space direction="vertical" style={{display: 'flex', width: "100%"}}>
                                {row.buttons.map((button) => (
                                    (button.visible ?? true) &&
                                    button.green ?
                                        (<StyledButtonGreenGhost block type="text"
                                                                 size={"large"}
                                                                 iconPosition={'end'}
                                                                 style={{textAlign: "start"}}
                                                                 {...button}

                                        />)
                                        :
                                        (<Button block type="text"
                                                 size={"large"}
                                                 iconPosition={'end'}
                                                 style={{textAlign: "start"}}
                                                 {...button}

                                        />)

                                ))}

                            </Space>
                        </>
                    )
                ))}
            </Card>
        )
    }
    const items = [
        {
            key: '3',
            header: "Настройка аккаунта",
            buttons: [
                {
                    key: '3-1',
                    children: "Кнопка 3-1",
                    visible: false,
                    icon: <UserOutlined/>,
                    onClick: () => {
                        console.log('Кнопка 1-1 нажата');
                    }
                },
                {
                    key: '3-2',
                    children: "Выход",
                    danger: true,
                    icon: <LogoutOutlined/>,
                    onClick: () => {
                        handleLogout();
                    }
                }
            ]
        },
    ]
    return (
        <Card size={"small"} title={"СибНИПИ ID"}
              style={{minWidth: "300px", justifyContent: 'center', alignItems: 'center'}}>
            <Space.Compact size={"large"} direction="vertical"
                           style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Avatar shape="square" size={64} icon={<UserOutlined/>} src={user ? catImage : null}/>
                <Text style={{fontSize: "16px"}} strong>{user?.user?.name ?? "Неизвестно"}</Text>
                <Link type={"secondary"}>{user?.user?.email ?? "Неизвестно"}</Link>
            </Space.Compact>
            {items.map((row) => (
                (row.visible ?? true) &&
                (
                    <>
                        <Divider style={{margin: 8}}/>
                        <Space direction="vertical" style={{display: 'flex', width: "100%"}}>
                            {row.buttons.map((button) => (
                                (button.visible ?? true) && (<Button block type="text"
                                                                     size={"large"}
                                                                     style={{textAlign: "start"}}
                                                                     iconPosition={'end'}
                                                                     {...button}
                                />)

                            ))}

                        </Space>
                    </>
                )
            ))}
        </Card>
    )
}
export  const UserMenuHeaderDropdown = ({currentUser}) => {
    return (  <Dropdown
        placement={"bottomRight"}
        dropdownRender={() =>
            (
                <UserCard user={currentUser ?? null}/>
            )}
        children={
            <Badge count={currentUser ? 0 : '!'}>
                <Link>

                    <Avatar
                        src={currentUser ? catImage : null}
                        icon={<UserOutlined/>}
                        children={ currentUser ? currentUser.user?.name?.slice(0, 2) :
                          <UserOutlined/>}
                    />
                </Link>
            </Badge>
        }/>)
}
export default {UserMenuHeaderDropdown, UserCard};