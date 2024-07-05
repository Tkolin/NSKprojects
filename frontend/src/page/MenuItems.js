// MenuItems.js
import React from 'react';
import {
    HomeOutlined,
    ProfileOutlined,
    FormOutlined,
    SolutionOutlined,
    CalculatorOutlined,
    BarChartOutlined,
    BugOutlined,
    IdcardOutlined,
    ContactsOutlined,
    EyeOutlined,
    TeamOutlined,
    FileAddOutlined,
    AuditOutlined,
    FileProtectOutlined,
    SyncOutlined, FileZipOutlined,
} from '@ant-design/icons';


const MenuItems =
    [
        {
            label: 'Главная',
            key: '/',
            icon: <HomeOutlined/>,
            children: null,
        },
        {
            label: 'Справочники',
            key: '/references',
            icon: <ProfileOutlined/>,
            children: [
                {
                    label: 'Контакты',
                    key: '/references/contact',
                    icon: <ContactsOutlined/>,
                    children: [
                        {
                            label: 'Просмотр контактов',
                            key: '/references/contact/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-contact'
                        },
                        {
                            label: 'Создать новый контакт',
                            key: '/references/contact/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-contact'
                        }
                    ]
                },
                {
                    label: 'Подрядчики',
                    key: '/references/person/',
                    icon: <IdcardOutlined/>,
                    children: [
                        {
                            label: 'Просмотр подрядчиков',
                            key: '/references/person/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-person'
                        },
                        {
                            label: 'Создать нового подрядчика',
                            key: '/references/person/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-person'
                        }
                    ]
                },
                {
                    label: 'Организации',
                    key: '/references/organization/',
                    icon: <TeamOutlined/>,
                    children: [
                        {
                            label: 'Просмотр организаций',
                            key: '/references/organization/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-organization'
                        },
                        {
                            label: 'Создать новую организацию',
                            key: '/references/organization/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-organization'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Проекты',
            key: '/project',
            icon: <ProfileOutlined/>,
            children: [
                {
                    label: 'Все проекты',
                    key: '/project/extra',
                    icon: <FileZipOutlined/>,
                    children: null,
                    permission: 'dev'
                },
                {
                    label: 'Стадия: Заявка',
                    key: '/project/request',
                    icon: <FileAddOutlined/>,
                    children: [
                        {
                            label: 'Список заявок',
                            key: '/project/request/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-request'
                        },
                        {
                            label: 'Создать нового подрядчика',
                            key: '/project/request/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-request'
                        }
                    ]
                },
                {
                    label: 'Стадия: Согласовании КП',
                    key: '/project/kp',
                    icon: <AuditOutlined/>,
                    children: [
                        {
                            label: 'Список проектов',
                            key: '/project/kp/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-kp'
                        },
                        {
                            label: 'Создать проект на согласовании',
                            key: '/project/kp/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-kp',
                            status: 'dev'
                        }
                    ]
                },
                {
                    label: 'Стадия: Согласовании договора',
                    key: '/project/contract',
                    icon: <FileProtectOutlined/>,
                    children: [
                        {
                            label: 'Список проектов',
                            key: '/project/contract/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-person'
                        },
                        {
                            label: 'Создать нового подрядчика',
                            key: '/project/contract/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-person'
                        }
                    ]
                },
                {
                    label: 'Стадия: В работе',
                    key: '/project/work',
                    icon: <SyncOutlined/>,
                    children: [
                        {
                            label: 'Список проектов',
                            key: '/project/work/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: 'read-person'
                        },
                        {
                            label: 'Создать нового подрядчика',
                            key: '/project/work/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: 'create-person'
                        }
                    ]
                }
            ]
        },
        // {
        //     label: 'Отчёты',
        //     key: '/report/',
        //     icon: <SolutionOutlined/>,
        //     children: [
        //         {
        //             label: 'Проекты',
        //             key: '/report/project',
        //             icon: null,
        //             children: null,
        //             permission: 'read-project'
        //         }
        //     ]
        // },
        {
            label: 'Пользователи',
            key: '/user/',
            icon: <IdcardOutlined/>,
            children: [
                {
                    label: 'Учётные записи',
                    key: '/user/person',
                    icon: null,
                    children: [
                        {
                            label: 'Регистрация учётной записи',
                            key: '/user/person/form',
                            icon: null,
                            children: null,
                            permission: 'create-user'
                        },
                        {
                            label: 'Список учётных записей',
                            key: '/user/person/table',
                            icon: null,
                            children: null,
                            permission: 'read-user'
                        }
                    ]
                },
                {
                    label: 'Роли и права доступа',
                    key: '/user/role',
                    icon: null,
                    children: [
                        {
                            label: 'Создать роль',
                            key: '/user/role/form',
                            icon: null,
                            children: null,
                            permission: 'create-user-role'
                        },
                        {
                            label: 'Список ролей и прав доступа',
                            key: '/user/role/table',
                            icon: null,
                            children: null,
                            permission: 'read-user-role'
                        }
                    ]
                }
            ]
        },
        // {
        //     label: 'Расчёты',
        //     key: '/computs/',
        //     icon: <CalculatorOutlined/>,
        //     children: [],
        //     permission: 'dev1'
        // },
        // {
        //     label: 'Экономика',
        //     key: '5',
        //     icon: <BarChartOutlined/>,
        //     children: [],
        //     permission: 'dev1'
        // },
        {
            label: '',
            key: '/test',
            permission: 'bug',
            icon: <BugOutlined/>,
            children: [
                {
                    label: 'Тест 1',
                    key: '/test/test1',
                    icon: null,
                    children: null,
                    permission: 'read-test1'
                },
                {
                    label: 'Тест 2',
                    key: '/test/test2',
                    icon: null,
                    children: null,
                    permission: 'read-test2'
                },
                {
                    label: 'Распределение задач',
                    key: '/form/tasks_project',
                    icon: null,
                    children: null,
                    permission: 'read-tasks-distribution'
                }
            ]
        }
    ];

const MenuItemsByPermission = (currentUser) => {
    if(!currentUser)
        return [];
    console.log("MenuItemsByPermission",currentUser);
    // Получаем список прав пользователя
    const userPermissions =  currentUser?.permissions?.map(p => p.name) ?? [];
    const hasPermission = (userPermissions, requiredPermission) => {
        return userPermissions.includes(requiredPermission);
    };
    // Функция для фильтрации элементов меню
    const filterMenuItems = (items, userPermissions) => {
        return items
            .filter(item => {
                if (item.permission) {
                    return hasPermission(userPermissions, item.permission);
                }
                return true;
            })
            .map(item => ({
                ...item,
                children: item.children ? filterMenuItems(item.children, userPermissions) : null
            }));
    };


    // Фильтруем элементы меню по правам пользователя
    return filterMenuItems(MenuItems, userPermissions);
};

export {MenuItems, MenuItemsByPermission};
