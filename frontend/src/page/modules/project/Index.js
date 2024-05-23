import React, {useEffect, useState} from 'react';
import {Anchor, Button, Col, Divider, Form, Row, Steps, theme} from 'antd';
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";
import StagesProjectForm from "./components/StagesProjectForm";

import ProjectForm from "./components/ProjectForm";
import {shallow} from "zustand/shallow";
import {useProjectStore} from "./Store";
import IrdsProjectForm from "./components/IrdsProjectForm";
// import IrdsProjectForm from "./components/IrdsProjectForm";


const Index = () => {
    const current = useProjectStore((state) => state.step);
    const setCurrent = useProjectStore((state) => state.setSteps);

    const updateProject = useProjectStore((state) => state.updateProject);
    const updateIrds = useProjectStore((state) => state.updateIrds);
    const updateStages = useProjectStore((state) => state.updateStages);


    const [form] = Form.useForm();

    const {token} = theme.useToken();


    const saveProject = (steps) => {

        console.log(steps);

        // switch (steps) {
        //     case 0:
        //         updateProject();
        //         return true;
        //     case 1:
        //         updateStages();
        //         return true;
        //     case 2:
        //         updateIrds();
        //         return true;
        // }
        return true;

    }
    const next = () => {
        if (saveProject(current))
            setCurrent(current + 1);
    };
    const prev = () => {
        if (saveProject(current))
            setCurrent(current - 1);
    };
    const onChangeStep = (value) => {
        if (saveProject(current))
            setCurrent(value);
    };


    const contentStyle = {
        lineHeight: '260px',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

    const getNewProject = (value, type) => {
        console.log('onChange:', value);
        //setCurrent(value);
    };
    return (
        <>
            <Steps
                type="navigation"
                size="small"
                current={current}
                onChange={onChangeStep}
                className="site-navigation-steps"
                items={[
                    {
                        title: 'Этап 1',
                        status: 'Требует сохранения',
                        description: 'Заполнение основной ифнормации.',
                    },
                    {
                        title: 'Этап 2',
                        status: 'Требует сохранения',
                        description: 'Указание этапов проекта.',
                    },
                    {
                        title: 'Этап 3',
                        status: 'Требует сохранения',
                        description: 'Указание ИРД по проекту.',
                    },
                    {
                        title: 'Этап 4',
                        subTitle: 'waiting for longlong time',
                        status: 'Требует сохранения',
                        description: 'Вывод документов.',
                    },
                ]}
            />
            <div style={contentStyle}>
                {current === 0 ? (
                        <StyledBlockRegular label={"Основные данные об проекте"}>
                            <ProjectForm/>
                        </StyledBlockRegular>
                    ) :
                    current === 1 ? (
                            <StyledBlockLarge label={"Этапы"}>
                                <StagesProjectForm onCompleted={(value) => getNewProject(value, "STAGES")}/>
                            </StyledBlockLarge>
                        ) :
                        current === 2 ? (
                                <StyledBlockLarge label={"Ирд"}>
                                    <IrdsProjectForm onCompleted={(value) => getNewProject(value, "IRDS")}/>
                                </StyledBlockLarge>) :
                            current === 3 ? (<></>) :
                                <></>
                }
            </div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < 4 - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Вперёд
                    </Button>
                )}
                {current === 4 - 1 && (
                    <Button type="primary" onClick={() => console.log('Processing complete!')}>
                        Завершить
                    </Button>
                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Назад
                    </Button>
                )}
            </div>
        </>

    )
        ;

};

export default Index;
