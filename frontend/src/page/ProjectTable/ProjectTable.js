import React, {useEffect, useState} from 'react';
import './Styles.css';
import ProjectTableComponent from "./components/ProjectTableComponent";
import {Alert, Divider, Space} from "antd";
import ToolBarComponent from "./components/ToolBarComponent";

const template = {
    request: {
        projectStatuses: ["DESIGN_REQUEST"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...
                menu: ["crud", "request"],
                //  Кнопки быстрых действий
                hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main"],
        },
        //  Все компоненты в выпадающем меню

    },
    kp: {
        projectStatuses: ["APPROVAL_KP"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...
                menu: ["crud", "kp", "stages", "template"],
                //  Кнопки быстрых действий
                hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main"],
        },
        //  Все компоненты в выпадающем меню
        expandable: ["stages"]
    },
    contract: {
        projectStatuses: ["APPROVAL_AGREEMENT"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...
                menu: ["crud", "contract", "stages",
                    "irds", "template"],
                //  Кнопки быстрых действий
                hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main"],
        },
        //  Все компоненты в выпадающем меню
        expandable: ["stages",
            "irds",
        ]
    },
    work: {
        projectStatuses: ["WORKING"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...
                menu: ["crud", "contract", "tasks_management", "template"],
                //  Кнопки быстрых действий
                hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main"],
        },
        //  Все компоненты в выпадающем меню
        expandable: ["stages",
            "irds",
            "executors",
            "stages-extra",
            "tasks",
            "executor_orders",
        ]
    },
    executorPayment: {
        projectStatuses: ["WORKING", "COMPLETED"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...

                //  Кнопки быстрых действий
                //  hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main", "money"],
        },
        //  Все компоненты в выпадающем меню
        expandable: [
            "executor_orders",
        ]
    },

    archive: {
        projectStatuses: ["ARCHIVE", "COMPLETED"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...
                menu: ["crud", "contract", "kp", "request"],
                //  Кнопки быстрых действий
                hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main"],
        },
        //  Все компоненты в выпадающем меню
        expandable: ["stages",
            "irds",
            "executors",
            "stages-extra",
            "tasks",
            "executor_orders",
        ]
    },


    extra: {
        //  Параметры фильтрации таблицы (статус)
        projectStatuses: ["WORKING", "APPROVAL_AGREEMENT", "APPROVAL_KP", "ARCHIVE", "COMPLETED",
            "DESIGN_REQUEST", "WAITING_SOURCE"],
        //  Параметры таблицы
        column: {
            //  Первая колонка кнопок управления таблицей
            tool: {
                //  Компоненты скрытые в ...
                menu: ["crud", "contract", "kp", "request"],
                //  Кнопки быстрых действий
                hotKey: ["archive", "up"],
            },
            //  Ключи колонок таблицы
            columns: ["main"],
        },
        //  Все компоненты в выпадающем меню
        expandable: ["stages",
            "irds",
            "executors",
            "stages-extra",
            "tasks",
            "executor_orders",
        ]
    }
}
const ProjectTable = ({mode}) => {
        const [search, setSearch] = useState('');
        const [refetch, setRefetch] = useState(false);
    const onRefetch = () => {
            setRefetch(!refetch);
        }
    useEffect(() => {
        onRefetch();
    }, [mode,]);
    if (!mode)
        return <Alert type={"error"} message={"Ошибка конфигурации"} showIcon/>
        return (
            <div>
                {/*{legendOptions && (*/}
                {/*    <>*/}
                {/*        <StatusLegendComponent projectStatuses={legendOptions} data-permission={"read-project-statistic"}/>*/}
                {/*        <Divider/>*/}
                {/*    </>*/}
                {/*)}*/}

                <Space.Compact direction={"horizontal"}>
                    <ToolBarComponent onCompleted={() => onRefetch()} options={['search', 'add_request']} gutter={5}
                                      onSearch={setSearch}/>
                </Space.Compact>
                <Divider/>

                <ProjectTableComponent settings={template[mode]} search={search} state={refetch}/>
            </div>

        )
    }
;

export default ProjectTable;
