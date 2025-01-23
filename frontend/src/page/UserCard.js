import {
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  Dropdown,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { StyledButtonGreenGhost } from "./components/style/ButtonStyles";

const { Text, Link } = Typography;

export const UserCard = ({}) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [user, setUser] = useState();
  useEffect(() => {
    console.log("localStorage.getItem(user)", localStorage.getItem("userData"));
    setUser({
      permissions: JSON.parse(localStorage.getItem("userPermissions")),
      user: JSON.parse(localStorage.getItem("userData")),
    });
  }, []);
  const [devMode, setDevMode] = useState(
    localStorage.getItem("developer_mode") === "true"
  );

  // При клике меняем в localStorage и перезагружаем
  const toggleDevMode = () => {
    const newValue = !devMode;
    localStorage.setItem("developer_mode", newValue ? "true" : "false");
    window.location.reload(); // перезагрузить страницу
  };
  const Out = () => {
    console.log("Данные кэша сброшены");
    setUser(null);
    localStorage.setItem("accessToken", null);
    localStorage.clear();
    navigate("auth/login");
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("auth/login");
  };
  const falseItems = [
    {
      key: "3",
      header: "Настройка аккаунта",
      buttons: [
        {
          key: "3-1",
          children: "Запросить аккаунт",
          icon: <MailOutlined />,
          onClick: () => {
            console.log("Кнопка 1-1 нажата");
          },
        },
        {
          green: true,
          key: "3-2",
          children: "Войти",
          icon: <LoginOutlined />,
          onClick: () => {
            handleLogin();
          },
        },
      ],
    },
  ];
  console.log("user", user);
  if (!user?.user) {
    return (
      <Card
        size={"small"}
        title={"СибНИПИ ID"}
        style={{
          minWidth: "300px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space.Compact
          size={"large"}
          direction="vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar shape="square" size={64} icon={<UserOutlined />} />
          <Text style={{ fontSize: "16px" }} type={"secondary"}>
            Необходимо выполнить вход
          </Text>
          <Text style={{ fontSize: "16px" }} type={"secondary"}>
            для доступа в систему
          </Text>
        </Space.Compact>
        {falseItems.map(
          (row) =>
            (row.visible ?? true) && (
              <>
                <Divider style={{ margin: 8 }} />
                <Space
                  direction="vertical"
                  style={{ display: "flex", width: "100%" }}
                >
                  {row.buttons.map((button) =>
                    (button.visible ?? true) && button.green ? (
                      <StyledButtonGreenGhost
                        block
                        type="text"
                        size={"large"}
                        iconPosition={"end"}
                        style={{ textAlign: "start" }}
                        {...button}
                      />
                    ) : (
                      <Button
                        block
                        type="text"
                        size={"large"}
                        iconPosition={"end"}
                        style={{ textAlign: "start" }}
                        {...button}
                      />
                    )
                  )}
                </Space>
              </>
            )
        )}
      </Card>
    );
  }
  const items = [
    {
      key: "3",
      header: "Настройка аккаунта",
      buttons: [
        {
          key: "3-1",
          children: "Кнопка 3-1",
          visible: false,
          icon: <UserOutlined />,
          onClick: () => {
            console.log("Кнопка 1-1 нажата");
          },
        },
        {
          key: "3-2",
          children: "Выход",
          danger: true,
          icon: <LogoutOutlined />,
          onClick: () => {
            Out();
          },
        },
      ],
    },
  ];
  return (
    <Card
      size={"small"}
      title={"СибНИПИ ID"}
      style={{
        minWidth: "300px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space.Compact
        size={"large"}
        direction="vertical"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar shape="square" size={64} icon={<UserOutlined />} />
        <Text style={{ fontSize: "16px" }} strong>
          {user?.user?.name ?? "Неизвестно"}
        </Text>
        <Button onClick={toggleDevMode} data-permission={"dev"}>
          {" "}
          {devMode ? "Отключить Developer Mode" : "Включить Developer Mode"}
        </Button>
        <Collapse
          items={[
            {
              key: "1",
              label: "Данные для разработчика",
              children: (
                <div>
                  {JSON.stringify(user)}
                  <br />
                  <br />
                  {JSON.stringify(
                    user?.permissions?.map((row) => row.name_key)
                  )}
                </div>
              ),
            },
          ]}
        />

        <Link type={"secondary"}>{user?.user?.email ?? "Неизвестно"}</Link>
      </Space.Compact>
      {items.map(
        (row) =>
          (row.visible ?? true) && (
            <>
              <Divider style={{ margin: 8 }} />
              <Space
                direction="vertical"
                style={{ display: "flex", width: "100%" }}
              >
                {row.buttons.map(
                  (button) =>
                    (button.visible ?? true) && (
                      <Button
                        block
                        type="text"
                        size={"large"}
                        style={{ textAlign: "start" }}
                        iconPosition={"end"}
                        {...button}
                      />
                    )
                )}
              </Space>
            </>
          )
      )}
    </Card>
  );
};
export const UserMenuHeaderDropdown = ({ currentUser }) => {
  return (
    <Dropdown
      placement={"bottomRight"}
      dropdownRender={() => <UserCard />}
      trigger={["click"]}
      children={
        <Badge count={currentUser ? 0 : "!"}>
          <Link>
            <Avatar
              src={currentUser ? null : null}
              icon={<UserOutlined />}
              children={
                currentUser ? (
                  currentUser.user?.name?.slice(0, 2)
                ) : (
                  <UserOutlined />
                )
              }
            />
          </Link>
        </Badge>
      }
    />
  );
};
export default { UserMenuHeaderDropdown, UserCard };
