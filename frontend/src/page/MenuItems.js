// MenuItems.js
import {
  AuditOutlined,
  CalculatorOutlined,
  ContactsOutlined,
  EyeOutlined,
  FileAddOutlined,
  FileProtectOutlined,
  FormOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  LoginOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
  TeamOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import React from "react";

const MenuItems = [
  {
    label: "Главная",
    key: "/",
    icon: <HomeOutlined />,
    children: null,
  },
  {
    label: "Справочники",
    key: "/references",
    icon: <ProfileOutlined />,
    permission: [
      "read-contact",
      "create-contact",
      "read-person",
      "create-person",
    ],
    children: [
      {
        label: "Контакты",
        key: "/references/contact",
        icon: <ContactsOutlined />,
        permission: ["read-contact", "create-contact"],
        children: [
          {
            label: "Просмотр контактов",
            key: "/references/contact/table",
            icon: <EyeOutlined />,
            children: null,
            permission: ["read-contact"],
          },
          {
            label: "Создать новый контакт",
            key: "/references/contact/form",
            icon: <FormOutlined />,
            children: null,
            permission: ["create-contact"],
          },
        ],
      },
      {
        label: "Исполнители",
        key: "/references/person/",
        icon: <IdcardOutlined />,
        permission: ["read-person", "create-person"],
        children: [
          {
            label: "Просмотр исполнителей",
            key: "/references/person/table",
            icon: <EyeOutlined />,
            children: null,
            permission: ["read-person"],
          },
          {
            label: "Создать нового исполнителя",
            key: "/references/person/form",
            icon: <FormOutlined />,
            children: null,
            permission: ["create-person"],
          },
        ],
      },
      {
        label: "Организации",
        key: "/references/organization/",
        icon: <TeamOutlined />,
        permission: ["read-organization", "create-organization"],
        children: [
          {
            label: "Просмотр организаций",
            key: "/references/organization/table",
            icon: <EyeOutlined />,
            children: null,
            permission: ["read-organization"],
          },
          {
            label: "Создать новую организацию",
            key: "/references/organization/form",
            icon: <FormOutlined />,
            children: null,
            permission: ["create-organization"],
          },
        ],
      },
      {
        label: "Поставщики и оборудование",
        key: "/references/suppliers_and_equipment/",
        icon: <TruckOutlined />,
        permission: ["read-suppliers", "create-suppliers"],
        children: [
          {
            label: "Поставщики",
            key: "/references/suppliers/",
            icon: <EyeOutlined />,
            children: [
              {
                label: "Просмотр поставщиков",
                key: "/references/suppliers/table",
                icon: <EyeOutlined />,
                children: null,
                permission: ["read-suppliers"],
              },
              {
                label: "Создать нового поставщика",
                key: "/references/suppliers/form",
                icon: <FormOutlined />,
                children: null,
                permission: ["create-suppliers"],
              },
            ],
            permission: ["read-suppliers", "create-suppliers"],
          },
          {
            label: "Классификация оборудования",
            key: "/references/equipment_type/",
            icon: <EyeOutlined />,
            permission: ["read-equipment-type", "create-equipment-type"],
            children: [
              {
                label: "Просмотр классификации оборудования",
                key: "/references/equipment_type/table",
                icon: <EyeOutlined />,
                children: null,
                permission: ["read-equipment-type"],
              },
              {
                label: "Справочник параметров",
                key: "/references/equipment_type/table1",
                icon: <EyeOutlined />,
                children: null,
                permission: ["read-equipment-type"],
              },
              {
                label: "Регистрация классификации оборудования",
                key: "/references/equipment_type/form",
                icon: <FormOutlined />,
                children: null,
                permission: ["create-equipment-type"],
              },
            ],
          },

          {
            label: "Зарегистрированное оборудования",
            key: "/references/equipment_model/",
            icon: <EyeOutlined />,
            permission: ["create-equipment-models", "read-equipment-models"],
            children: [
              {
                label: "Просмотр зарегистрированного оборудования",
                key: "/references/equipment_model/table",
                icon: <EyeOutlined />,
                children: null,
                permission: ["read-equipment-models"],
              },
              {
                label: "Регистрация оборудования",
                key: "/references/equipment_model/form",
                icon: <FormOutlined />,
                children: null,
                permission: ["create-equipment-models"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Проекты",
    key: "/project",
    icon: <ProfileOutlined />,
    permission: [
      "read-project-work",
      "create-project-work",
      "read-project-statistic",
      "read-contract",
      "create-contract",
      "read-project-request",
      "create-project-request",
      "read-project-kp",
      "create-project-kp",
    ],

    children: [
      {
        label: "Стадия: Заявка",
        key: "/project/request",
        icon: <FileAddOutlined />,
        permission: ["read-project-request", "create-project-request"],
        children: [
          {
            label: "Список заявок: Согласовании договора",
            key: "/project/request/table",
            icon: <EyeOutlined />,
            children: null,
            permission: ["read-project-request"],
          },
          {
            label: "Создать новую заявку: Согласовании договора",
            key: "/project/request/form",
            icon: <FormOutlined />,
            children: null,
            permission: ["create-project-request"],
          },
        ],
      },
      {
        label: "Стадия: Согласовании КП",
        key: "/project/kp/table",
        icon: <AuditOutlined />,
        permission: ["read-project-kp", "create-project-kp"],
      },
      {
        label: "Стадия: Согласовании договора",
        key: "/project/contract/table",
        icon: <FileProtectOutlined />,
        permission: ["read-project-contract", "create-project-contract"],
      },
      {
        label: "Стадия: Подготовка к работе",
        key: "/project/waiting_start_work/table",
        icon: <HistoryOutlined />,
        permission: ["read-project-work", "create-project-work"],
      },
      {
        label: "Стадия: В работе",
        key: "/project/work/table",
        icon: <ReconciliationOutlined />,
        permission: ["read-project-work", "create-project-work"],
      },
    ],
  },
  {
    label: "Бухгалтерия",
    key: "/bookeep/",
    icon: <SolutionOutlined />,
    permission: ["read-project-payments"],
    children: [
      {
        label: "Оплаты по проектам",
        key: "/bookeep/executor_order_table",
        icon: null,
        children: null,
        permission: ["read-project-payments"],
      },
      {
        label: "Все запросы на оплату исполнителям",
        key: "/bookeep/all_executor_order_table",
        icon: null,
        children: null,
        permission: ["read-project-payments"],
      },
    ],
  },
  // {
  //   label: "Пользователи",
  //   key: "/user/",
  //   icon: <IdcardOutlined />,
  //   permission: ["dev"],
  //   children: [
  //     {
  //       label: "Учётные записи",
  //       key: "/user/person",
  //       icon: null,
  //       permission: ["dev"],
  //       children: [
  //         {
  //           label: "Регистрация учётной записи",
  //           key: "/user/person/form",
  //           icon: null,
  //           children: null,
  //           permission: ["dev"],
  //         },
  //         {
  //           label: "Список учётных записей",
  //           key: "/user/person/table",
  //           icon: null,
  //           children: null,
  //           permission: ["dev"],
  //         },
  //       ],
  //     },
  //     {
  //       label: "Роли и права доступа",
  //       key: "/user/role",
  //       icon: null,
  //       permission: ["dev"],
  //       children: [
  //         {
  //           label: "Создать роль",
  //           key: "/user/role/form",
  //           icon: null,
  //           children: null,
  //           permission: ["dev"],
  //         },
  //         {
  //           label: "Список ролей и прав доступа",
  //           key: "/user/role/table",
  //           icon: null,
  //           children: null,
  //           permission: ["dev"],
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    label: "Расчёты",
    key: "/math/",
    icon: <CalculatorOutlined />,
    permission: ["math"],
    children: [
      {
        label: "Справочники",
        key: "/math/reference",
        icon: null,
        permission: ["math"],
        children: [
          {
            label: "Создать справочник",
            key: "/math/reference/form",
            icon: null,
            children: null,
            permission: ["math"],
          },
          {
            label: "Список справочников",
            key: "/math/reference/table",
            icon: null,
            children: null,
            permission: ["math"],
          },
        ],
      },
      {
        label: "Вычисления",
        key: "/math/module",
        icon: null,
        permission: ["math"],
        children: [
          {
            label: "Создать модуль расчёта",
            key: "/math/module/creater",
            icon: null,
            children: null,
            permission: ["math"],
          },
          {
            label: "Воспользоваться модулем расчёта",
            key: "/math/module/coputing",
            icon: null,
            children: null,
            disable: true,
            permission: ["math"],
          },
        ],
      },
      {
        label: "Технические задания",
        key: "/tech/tech_ref",
        icon: null,
        permission: ["math"],
        children: [
          {
            label: "Создать раздел ТЗ",
            key: "/math/tech_ref/form/chapter",
            icon: null,
            children: null,
            permission: ["math"],
          },
          {
            label: "Создать шаблон ТЗ для проекта",
            key: "/math/tech_ref/table/structure",
            icon: null,
            children: null,
            permission: ["math"],
          },
          {
            label: "Заполнить ТЗ-проекта данными",
            key: "/math/tech_ref/table/manager",
            icon: null,
            children: null,
            permission: ["math"],
          },
        ],
      },
      {
        label: "Формулы",
        key: "/math/formuls",
        icon: null,
        permission: ["math"],
        children: [
          {
            label: "Создать формулу",
            key: "/math/formuls/form",
            icon: null,
            children: null,
            permission: ["math"],
          },
          {
            label: "Список формул",
            key: "/math/formuls/table",
            icon: null,
            children: null,
            disable: true,
            permission: ["math"],
          },
        ],
      },
    ],
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
  // {
  //   label: "",
  //   key: "/test",
  //   permission: ["dev"],
  //   icon: <BugOutlined />,
  //   children: [
  //     {
  //       label: "Тест 1",
  //       key: "/test/test1",
  //       icon: null,
  //       children: null,
  //       permission: ["dev"],
  //     },
  //     {
  //       label: "Тест 2",
  //       key: "/test/test2",
  //       icon: null,
  //       children: null,
  //       permission: ["dev"],
  //     },
  //     {
  //       label: "Распределение задач",
  //       key: "/form/tasks_project",
  //       icon: null,
  //       children: null,
  //       permission: ["dev"],
  //     },
  //   ],
  // },
  // Без индексации
  {
    label: "Авторизация",
    key: "/auth/login",
    permission: ["bug"],
    disable: true,
    icon: <LoginOutlined />,
  },
];

const MenuItemsByPermission = (currentUser) => {
  if (!currentUser) return [];
  console.log("112 currentUser", currentUser.permissions);
  // Получаем список прав пользователя
  const userPermissions =
    currentUser?.permissions?.map((p) => p.name_key) ?? [];

  console.log(userPermissions);

  const hasPermission = (userPermissions, requiredPermissions) => {
    return requiredPermissions.some((row) => userPermissions.includes(row));
  };
  // Функция для фильтрации элементов меню
  const filterMenuItems = (items, userPermissions) => {
    return items
      .filter((item) => {
        if (item.disable) return false;
        if (item.permission && item.permission.length > 0) {
          return hasPermission(userPermissions, item.permission);
        }
        return true;
      })
      .map((item) => ({
        ...item,
        children: item.children
          ? filterMenuItems(item.children, userPermissions)
          : null,
      }));
  };

  // Фильтруем элементы меню по правам пользователя
  return filterMenuItems(MenuItems, userPermissions);
};

export { MenuItems, MenuItemsByPermission };
