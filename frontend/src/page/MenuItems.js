// MenuItems.js
import React from 'react';
import {
    AuditOutlined,
    BugOutlined,
    ContactsOutlined,
    EyeOutlined,
    FileAddOutlined,
    FileProtectOutlined,
    FileZipOutlined,
    FormOutlined,
    HomeOutlined,
    IdcardOutlined,
    LoginOutlined,
    ProfileOutlined,
    SolutionOutlined,
    SyncOutlined,
    TeamOutlined,
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
            permission: ['read-contact', 'create-contact', 'read-person', 'create-person'],
            children: [
                {
                    label: 'Контакты',
                    key: '/references/contact',
                    icon: <ContactsOutlined/>,
                    permission: ['read-contact', 'create-contact'],
                    children: [
                        {
                            label: 'Просмотр контактов',
                            key: '/references/contact/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-contact']
                        },
                        {
                            label: 'Создать новый контакт',
                            key: '/references/contact/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['create-contact']
                        }
                    ]
                },
                {
                    label: 'Подрядчики',
                    key: '/references/person/',
                    icon: <IdcardOutlined/>,
                    permission: ['read-person', 'create-person'],
                    children: [
                        {
                            label: 'Просмотр подрядчиков',
                            key: '/references/person/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-person']
                        },
                        {
                            label: 'Создать нового подрядчика',
                            key: '/references/person/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['create-person']
                        }
                    ]
                },
                {
                    label: 'Организации',
                    key: '/references/organization/',
                    icon: <TeamOutlined/>,
                    permission: ['read-organization', 'create-organization'],
                    children: [
                        {
                            label: 'Просмотр организаций',
                            key: '/references/organization/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-organization']
                        },
                        {
                            label: 'Создать новую организацию',
                            key: '/references/organization/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['create-organization']
                        }
                    ]
                }
            ]
        },
        {
            label: 'Проекты',
            key: '/project',
            icon: <ProfileOutlined/>,
            permission: ['read-project-work', 'create-project-work', 'read-project-statistic',
                'read-contract', 'create-contract'
                , 'read-project-request', 'create-project-request', 'read-project-kp', 'create-project-kp'],

            children: [
                {
                    label: 'Статистика по проектам',
                    key: '/project/statistic',
                    icon: <FileZipOutlined/>,
                    children: null,
                    permission: ['read-project-statistic']
                },
                {
                    label: 'Стадия: Заявка',
                    key: '/project/request',
                    icon: <FileAddOutlined/>,
                    permission: ['read-project-request', 'create-project-request'],
                    children: [
                        {
                            label: 'Список заявок: Согласовании договора',
                            key: '/project/request/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-project-request']
                        },
                        {
                            label: 'Создать новую заявку: Согласовании договора',
                            key: '/project/request/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['create-project-request']
                        }
                    ]
                },
                {
                    label: 'Стадия: Согласовании КП',
                    key: '/project/kp',
                    icon: <AuditOutlined/>,
                    permission: ['read-project-kp', 'create-project-kp'],
                    children: [
                        {
                            label: 'Список проектов: Согласовании КП ',
                            key: '/project/kp/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-project-kp']
                        },
                        {
                            label: 'Создать проект: Согласовании КП',
                            key: '/project/kp/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['dev'],
                    }
                    ]
                },
                {
                    label: 'Стадия: Согласовании договора',
                    key: '/project/contract',
                    icon: <FileProtectOutlined/>,
                    permission: ['read-project-contract', 'create-project-contract'],
                    children: [
                        {
                            label: 'Список проектов: Согласовании договора',
                            key: '/project/contract/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-project-contract']
                        },
                        {
                            label: 'Создать нового подрядчика: Согласовании договора',
                            key: '/project/contract/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['create-project-contract']
                        }
                    ]
                },
                {
                    label: 'Стадия: В работе',
                    key: '/project/work',
                    icon: <SyncOutlined/>,
                    permission: ['read-project-work', 'create-project-work'],
                    children: [
                        {
                            label: 'Список проектов',
                            key: '/project/work/table',
                            icon: <EyeOutlined/>,
                            children: null,
                            permission: ['read-project-work']
                        },
                        {
                            label: 'Создать нового подрядчика',
                            key: '/project/work/form',
                            icon: <FormOutlined/>,
                            children: null,
                            permission: ['create-project-work']
                        }
                    ]
                }
            ]
        },
        {
            label: 'Бухгалтерия>',
            key: '/bookeep/',
            icon: <SolutionOutlined/>,
            permission: ["read-project-payments"],
            children: [
                {
                    label: 'Запросы на оплату Исполнителям',
                    key: '/bookeep/executor_order_table',
                    icon: null,
                    children: null,
                    permission: ["read-project-payments"]
                }
            ]
        },
        {
            label: 'Пользователи',
            key: '/user/',
            icon: <IdcardOutlined/>,
            permission: ['dev'],
            children: [
                {
                    label: 'Учётные записи',
                    key: '/user/person',
                    icon: null,
                    permission: ['dev'],
                    children: [
                        {
                            label: 'Регистрация учётной записи',
                            key: '/user/person/form',
                            icon: null,
                            children: null,
                            permission: ['dev'],
                        },
                        {
                            label: 'Список учётных записей',
                            key: '/user/person/table',
                            icon: null,
                            children: null,
                            permission: ['dev'],
                        }
                    ]
                },
                {
                    label: 'Роли и права доступа',
                    key: '/user/role',
                    icon: null,
                    permission: ['dev'],
                    children: [
                        {
                            label: 'Создать роль',
                            key: '/user/role/form',
                            icon: null,
                            children: null,
                            permission: ['dev'],
                        },
                        {
                            label: 'Список ролей и прав доступа',
                            key: '/user/role/table',
                            icon: null,
                            children: null,
                            permission: ['dev'],
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
        //     permission: ['dev1'
        // },
        // {
        //     label: 'Экономика',
        //     key: '5',
        //     icon: <BarChartOutlined/>,
        //     children: [],
        //     permission: ['dev1'
        // },
        {
            label: '',
            key: '/test',
            permission: ['dev'],
            icon: <BugOutlined/>,
            children: [
                {
                    label: 'Тест 1',
                    key: '/test/test1',
                    icon: null,
                    children: null,
                    permission: ['dev']
                },
                {
                    label: 'Тест 2',
                    key: '/test/test2',
                    icon: null,
                    children: null,
                    permission: ['dev']
                },
                {
                    label: 'Распределение задач',
                    key: '/form/tasks_project',
                    icon: null,
                    children: null,
                    permission: ['dev']
                }
            ]
        },
        // Без индексации
        {
            label: 'Авторизация',
            key: '/auth/login',
            permission: ['bug'],
            disable: true,
            icon: <LoginOutlined/>,
        }
    ];

const MenuItemsByPermission = (currentUser) => {
    console.log(currentUser);
    if(!currentUser)
        return [];

    // Получаем список прав пользователя
    const userPermissions =  currentUser?.permissions?.map(p => p.name_key) ?? [];
    const hasPermission = (userPermissions, requiredPermissions) => {
        return requiredPermissions.some(row=>userPermissions.includes(row));
    };
    // Функция для фильтрации элементов меню
    const filterMenuItems = (items, userPermissions) => {
        return items
            .filter(item => {
                if(item.disable)
                    return false
                if (item.permission && item.permission.length > 0) {
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
